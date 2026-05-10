'use client';

import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';

type ClerkLike = {
  loaded?: boolean;
  user?: { fullName?: string | null; primaryEmailAddress?: { emailAddress?: string } | null } | null;
  load?: (options?: Record<string, unknown>) => Promise<void>;
  redirectToSignIn?: (options?: Record<string, unknown>) => Promise<void>;
  redirectToSignUp?: (options?: Record<string, unknown>) => Promise<void>;
  signOut?: () => Promise<void>;
  setActive?: (options: { session: string }) => Promise<void>;
  client?: {
    signIn?: {
      create?: (input: Record<string, unknown>) => Promise<{ status?: string; createdSessionId?: string | null }>;
    };
    signUp?: {
      create?: (input: Record<string, unknown>) => Promise<{ status?: string; createdSessionId?: string | null }>;
    };
  };
};

declare global {
  interface Window {
    Clerk?: ClerkLike;
  }
}

const AUTH_STORAGE_KEY = 'agritech.academy.session.v1';
const USER_STORAGE_KEY = 'agritech.academy.users.v1';
const DEMO_EMAIL = 'demo@agritech.academy';
const DEMO_PASSWORD = 'academy123';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DASHBOARD_PATH = '/academy/dashboard';

function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');

  if (!redirect || redirect.startsWith('http') || redirect.startsWith('//')) {
    return DASHBOARD_PATH;
  }

  return redirect;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function mockPasswordFingerprint(password: string) {
  return window.btoa(unescape(encodeURIComponent(`mock:${password}`)));
}

function persistLocalSession(user: { name: string; email: string }) {
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      user: {
        id: user.email === DEMO_EMAIL ? 'usr_demo_student' : `usr_${Date.now()}`,
        name: user.name,
        email: user.email,
        role: 'student',
        permissions: ['academy.dashboard.view', 'academy.courses.view', 'academy.support.request'],
        enrolledCourseSlugs: ['cuniculture'],
        cohort: 'Académie Agri-Tech',
        accessStatus: 'active',
        billingStatus: 'mock-paid',
        createdAt: new Date().toISOString(),
      },
      issuedAt: new Date().toISOString(),
      provider: 'local-mock',
    }),
  );
}

function loadClerkScript(publishableKey: string) {
  return new Promise<ClerkLike>((resolve, reject) => {
    if (window.Clerk) {
      resolve(window.Clerk);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-agritech-clerk="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Clerk as ClerkLike), { once: true });
      existing.addEventListener('error', () => reject(new Error('Impossible de charger ClerkJS.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.agritechClerk = 'true';
    script.dataset.clerkPublishableKey = publishableKey;
    script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
    script.addEventListener('load', () => resolve(window.Clerk as ClerkLike), { once: true });
    script.addEventListener('error', () => reject(new Error('Impossible de charger ClerkJS.')), { once: true });
    document.head.append(script);
  });
}

async function getLoadedClerk(publishableKey?: string) {
  if (!publishableKey) return null;

  const clerk = await loadClerkScript(publishableKey);
  if (typeof clerk.load === 'function' && !clerk.loaded) {
    await clerk.load({
      signInUrl: '/academy/login',
      signUpUrl: '/academy/register',
      signInForceRedirectUrl: DASHBOARD_PATH,
      signUpForceRedirectUrl: DASHBOARD_PATH,
    });
  }

  return clerk;
}

function AuthShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <a href="/academy" style={styles.backLink}>← Académie</a>
        <p style={styles.kicker}>Agri-Tech Academy</p>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
        {children}
      </section>
    </main>
  );
}

export function AuthForm({ mode, publishableKey }: { mode: 'login' | 'register'; publishableKey?: string }) {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const localSession = readJson<{ user?: unknown } | null>(AUTH_STORAGE_KEY, null);
    if (localSession?.user) {
      window.location.assign(getRedirectTarget());
      return;
    }

    getLoadedClerk(publishableKey)
      .then((clerk) => {
        if (clerk?.user) window.location.assign(getRedirectTarget());
      })
      .catch(() => undefined);
  }, [publishableKey]);

  async function submitWithClerk(email: string, password: string, name?: string) {
    const clerk = await getLoadedClerk(publishableKey);
    if (!clerk?.client) {
      throw new Error('ClerkJS est chargé, mais le client Clerk n’est pas disponible. Vérifiez NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.');
    }

    if (mode === 'login') {
      const signIn = await clerk.client.signIn?.create?.({ identifier: email, password });
      if (signIn?.status === 'complete' && signIn.createdSessionId) {
        await clerk.setActive?.({ session: signIn.createdSessionId });
        return true;
      }
      throw new Error('Connexion Clerk incomplète. Vérifiez la configuration Email/Password dans Clerk.');
    }

    const [firstName, ...lastNameParts] = String(name || '').trim().split(' ');
    const signUp = await clerk.client.signUp?.create?.({
      emailAddress: email,
      password,
      firstName,
      lastName: lastNameParts.join(' '),
    });

    if (signUp?.status === 'complete' && signUp.createdSessionId) {
      await clerk.setActive?.({ session: signUp.createdSessionId });
      return true;
    }

    throw new Error('Inscription Clerk créée mais une vérification email peut être requise dans le dashboard Clerk.');
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setMessageType('error');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');
    const name = String(form.get('name') || '').trim();
    const terms = form.get('terms');

    if (!EMAIL_PATTERN.test(email)) {
      setMessage('Entrez un email valide.');
      return;
    }

    if (password.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (mode === 'register' && name.length < 2) {
      setMessage('Indiquez votre nom complet.');
      return;
    }

    if (mode === 'register' && !terms) {
      setMessage('Vous devez accepter les conditions pour créer un compte.');
      return;
    }

    setIsLoading(true);

    try {
      if (publishableKey) {
        await submitWithClerk(email, password, name);
      } else if (mode === 'login') {
        const users = readJson<Array<{ name: string; email: string; passwordFingerprint: string }>>(USER_STORAGE_KEY, []);
        const storedUser = users.find((user) => user.email === email);
        const isDemo = email === DEMO_EMAIL && password === DEMO_PASSWORD;
        const isStored = storedUser?.passwordFingerprint === mockPasswordFingerprint(password);

        if (!isDemo && !isStored) {
          throw new Error('Email ou mot de passe incorrect. Essayez demo@agritech.academy avec academy123.');
        }

        persistLocalSession(isDemo ? { name: 'Mika Jean', email } : { name: storedUser?.name || email, email });
      } else {
        const users = readJson<Array<{ name: string; email: string; passwordFingerprint: string }>>(USER_STORAGE_KEY, []);
        if (email === DEMO_EMAIL || users.some((user) => user.email === email)) {
          throw new Error('Un compte existe déjà avec cet email. Connectez-vous plutôt.');
        }
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([...users, { name, email, passwordFingerprint: mockPasswordFingerprint(password) }]));
        persistLocalSession({ name, email });
      }

      setMessageType('success');
      setMessage(mode === 'login' ? 'Connexion réussie. Redirection…' : 'Compte créé. Redirection…');
      window.location.assign(getRedirectTarget());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentification impossible pour le moment.');
      setIsLoading(false);
    }
  }

  async function onGoogle() {
    setMessage('');
    setMessageType('error');

    if (!publishableKey) {
      setMessage('Google OAuth nécessite NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY dans Vercel.');
      return;
    }

    setIsGoogleLoading(true);
    try {
      const clerk = await getLoadedClerk(publishableKey);
      const options = {
        strategy: 'oauth_google',
        redirectUrl: DASHBOARD_PATH,
        redirectUrlComplete: DASHBOARD_PATH,
        forceRedirectUrl: DASHBOARD_PATH,
        fallbackRedirectUrl: DASHBOARD_PATH,
        signInForceRedirectUrl: DASHBOARD_PATH,
        signUpForceRedirectUrl: DASHBOARD_PATH,
      };
      const redirectMethod = mode === 'register' ? clerk?.redirectToSignUp : clerk?.redirectToSignIn;
      if (typeof redirectMethod !== 'function') {
        throw new Error('ClerkJS ne fournit pas de méthode de redirection OAuth. Vérifiez la configuration Clerk.');
      }
      await redirectMethod.call(clerk, options);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de démarrer Google OAuth.');
      setIsGoogleLoading(false);
    }
  }

  return (
    <AuthShell
      title={mode === 'login' ? 'Connexion étudiant' : 'Créer un compte étudiant'}
      subtitle={mode === 'login' ? 'Connectez-vous pour accéder au dashboard et à vos formations.' : 'Créez votre accès étudiant pour suivre vos formations Agri-Tech.'}
    >
      <form onSubmit={onSubmit} style={styles.form} noValidate>
        {message ? <div style={messageType === 'success' ? styles.success : styles.error}>{message}</div> : null}
        {mode === 'register' ? (
          <label style={styles.label}>Nom complet<input name="name" autoComplete="name" style={styles.input} /></label>
        ) : null}
        <label style={styles.label}>Email<input name="email" type="email" autoComplete="email" style={styles.input} /></label>
        <label style={styles.label}>Mot de passe<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} style={styles.input} /></label>
        {mode === 'register' ? (
          <label style={styles.checkbox}><input name="terms" type="checkbox" /> J’accepte les conditions de l’Académie.</label>
        ) : null}
        <button type="submit" disabled={isLoading || isGoogleLoading} style={styles.submit}>{isLoading ? 'Traitement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</button>
        <button type="button" onClick={onGoogle} disabled={isLoading || isGoogleLoading} style={styles.google}>{isGoogleLoading ? 'Ouverture de Google…' : 'Continuer avec Google'}</button>
      </form>
      <p style={styles.switchText}>
        {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
        <a href={mode === 'login' ? '/academy/register' : '/academy/login'} style={styles.inlineLink}>{mode === 'login' ? 'Créer un compte' : 'Se connecter'}</a>
      </p>
      {!publishableKey ? <p style={styles.hint}>Mode local actif : compte démo {DEMO_EMAIL} / {DEMO_PASSWORD}.</p> : null}
    </AuthShell>
  );
}

export function ProtectedAcademyPage({ publishableKey, title, children }: { publishableKey?: string; title: string; children: ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'signed-in'>('checking');
  const [userLabel, setUserLabel] = useState('Étudiant');

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const localSession = readJson<{ user?: { name?: string; email?: string } } | null>(AUTH_STORAGE_KEY, null);
      if (localSession?.user) {
        setUserLabel(localSession.user.name || localSession.user.email || 'Étudiant');
        setStatus('signed-in');
        return;
      }

      try {
        const clerk = await getLoadedClerk(publishableKey);
        if (clerk?.user) {
          if (!isMounted) return;
          setUserLabel(clerk.user.fullName || clerk.user.primaryEmailAddress?.emailAddress || 'Étudiant');
          setStatus('signed-in');
          return;
        }
      } catch {
        // Redirect below.
      }

      const loginUrl = new URL('/academy/login', window.location.origin);
      loginUrl.searchParams.set('redirect', window.location.pathname);
      window.location.replace(loginUrl.toString());
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [publishableKey]);

  async function signOut() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    try {
      const clerk = await getLoadedClerk(publishableKey);
      await clerk?.signOut?.();
    } finally {
      window.location.assign('/academy/login');
    }
  }

  if (status === 'checking') {
    return <main style={styles.page}><section style={styles.card}><p style={styles.subtitle}>Vérification de la session…</p></section></main>;
  }

  return (
    <main style={styles.page}>
      <section style={styles.cardWide}>
        <p style={styles.kicker}>Espace étudiant</p>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>Connecté : {userLabel}</p>
        <div style={styles.actions}>
          <a href="/academy" style={styles.secondary}>Académie</a>
          <a href="/academy/my-courses" style={styles.secondary}>Mes formations</a>
          <button type="button" onClick={signOut} style={styles.logout}>Déconnexion</button>
        </div>
        {children}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: 'linear-gradient(135deg, #f3f8ef 0%, #fff7e8 100%)', color: '#17351f', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  card: { width: 'min(100%, 520px)', background: '#fff', borderRadius: '28px', padding: 'clamp(22px, 5vw, 40px)', boxShadow: '0 24px 70px rgba(23, 53, 31, 0.14)', border: '1px solid rgba(74, 127, 54, 0.16)' },
  cardWide: { width: 'min(100%, 920px)', background: '#fff', borderRadius: '28px', padding: 'clamp(22px, 5vw, 44px)', boxShadow: '0 24px 70px rgba(23, 53, 31, 0.14)', border: '1px solid rgba(74, 127, 54, 0.16)' },
  backLink: { color: '#2f6b2f', textDecoration: 'none', fontWeight: 800 },
  kicker: { margin: '18px 0 10px', color: '#4a7f36', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.78rem' },
  title: { margin: 0, fontSize: 'clamp(2rem, 7vw, 3.5rem)', lineHeight: 1 },
  subtitle: { color: '#4b5f50', lineHeight: 1.65, fontSize: '1rem' },
  form: { display: 'grid', gap: '14px', marginTop: '22px' },
  label: { display: 'grid', gap: '8px', fontWeight: 800, color: '#2d4433' },
  input: { width: '100%', boxSizing: 'border-box', border: '1px solid #d7e4d5', borderRadius: '16px', padding: '14px 15px', font: 'inherit', fontWeight: 700, color: '#17351f' },
  checkbox: { display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5f50', lineHeight: 1.4 },
  submit: { width: '100%', minHeight: '52px', border: 0, borderRadius: '999px', background: '#4a7f36', color: '#fff', font: 'inherit', fontWeight: 900, cursor: 'pointer' },
  google: { width: '100%', minHeight: '52px', border: '1px solid rgba(15,61,46,.16)', borderRadius: '999px', background: '#fff', color: '#17351f', font: 'inherit', fontWeight: 900, cursor: 'pointer' },
  error: { padding: '13px 15px', borderRadius: '16px', background: 'rgba(179,38,30,.09)', color: '#8f1d17', border: '1px solid rgba(179,38,30,.18)', fontWeight: 800 },
  success: { padding: '13px 15px', borderRadius: '16px', background: 'rgba(45,106,79,.12)', color: '#17351f', border: '1px solid rgba(45,106,79,.22)', fontWeight: 800 },
  switchText: { color: '#4b5f50', textAlign: 'center' },
  inlineLink: { color: '#2f6b2f', fontWeight: 900 },
  hint: { color: '#607064', fontSize: '0.9rem', lineHeight: 1.55, textAlign: 'center' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '12px', margin: '24px 0' },
  secondary: { display: 'inline-flex', alignItems: 'center', minHeight: '42px', borderRadius: '999px', padding: '0 16px', background: '#f3f8ef', color: '#2f6b2f', textDecoration: 'none', fontWeight: 900 },
  logout: { display: 'inline-flex', alignItems: 'center', minHeight: '42px', border: '1px solid rgba(15,61,46,.16)', borderRadius: '999px', padding: '0 16px', background: '#fff', color: '#17351f', font: 'inherit', fontWeight: 900, cursor: 'pointer' },
};
