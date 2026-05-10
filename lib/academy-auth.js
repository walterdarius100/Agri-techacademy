const AUTH_STORAGE_KEY = 'agritech.academy.session.v1';
const USER_STORAGE_KEY = 'agritech.academy.users.v1';
const MOCK_DELAY = 450;
const ACADEMY_DASHBOARD_PATH = '../dashboard/';
const CLERK_GOOGLE_STRATEGY = 'oauth_google';

export const AUTH_PERMISSIONS = Object.freeze({
  VIEW_DASHBOARD: 'academy.dashboard.view',
  VIEW_COURSES: 'academy.courses.view',
  MANAGE_BILLING: 'academy.billing.manage',
  REQUEST_SUPPORT: 'academy.support.request'
});

export const AUTH_ROLES = Object.freeze({
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin'
});

export const DEMO_USER = Object.freeze({
  id: 'usr_demo_student',
  name: 'Mika Jean',
  email: 'demo@agritech.academy',
  role: AUTH_ROLES.STUDENT,
  permissions: [AUTH_PERMISSIONS.VIEW_DASHBOARD, AUTH_PERMISSIONS.VIEW_COURSES, AUTH_PERMISSIONS.REQUEST_SUPPORT],
  enrolledCourseSlugs: ['cuniculture', 'apiculture'],
  cohort: 'Cohorte test · Académie Agri-Tech',
  accessStatus: 'active',
  billingStatus: 'mock-paid',
  createdAt: '2026-05-10T00:00:00.000Z'
});

function wait(ms = MOCK_DELAY) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getStoredUsers() {
  return safeJsonParse(window.localStorage.getItem(USER_STORAGE_KEY), []);
}

function setStoredUsers(users) {
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

function persistSession(user) {
  const session = {
    user,
    issuedAt: new Date().toISOString(),
    provider: 'local-mock',
    strategy: 'replace-with-secure-http-only-cookie'
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('academy-auth-change', { detail: session }));
  return session;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function mockPasswordFingerprint(password) {
  return window.btoa(unescape(encodeURIComponent(`mock:${password}`)));
}

function sanitizeUser(user) {
  const { passwordFingerprint, ...safeUser } = user;
  return safeUser;
}

export function getCurrentSession() {
  return safeJsonParse(window.localStorage.getItem(AUTH_STORAGE_KEY), null);
}

export function getCurrentUser() {
  return getCurrentSession()?.user ?? null;
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export function hasPermission(permission) {
  const user = getCurrentUser();
  return Boolean(user?.permissions?.includes(permission));
}

export function requireAuth({ loginPath = '../login/', returnParam = 'redirect' } = {}) {
  const user = getCurrentUser();

  if (user) return user;

  const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const separator = loginPath.includes('?') ? '&' : '?';
  window.location.replace(`${loginPath}${separator}${returnParam}=${encodeURIComponent(next)}`);
  return null;
}

export async function loginWithMockCredentials({ email, password }) {
  await wait();

  const normalizedEmail = normalizeEmail(email);
  const storedUser = getStoredUsers().find((user) => user.email === normalizedEmail);
  const matchesDemo = normalizedEmail === DEMO_USER.email && password === 'academy123';
  const matchesStored = storedUser?.passwordFingerprint === mockPasswordFingerprint(password);

  if (!matchesDemo && !matchesStored) {
    throw new Error('Email ou mot de passe incorrect. Essayez demo@agritech.academy avec academy123.');
  }

  return persistSession(matchesDemo ? DEMO_USER : sanitizeUser(storedUser));
}

export async function registerMockUser({ name, email, password }) {
  await wait();

  const normalizedEmail = normalizeEmail(email);
  const users = getStoredUsers();
  const exists = normalizedEmail === DEMO_USER.email || users.some((user) => user.email === normalizedEmail);

  if (exists) {
    throw new Error('Un compte existe déjà avec cet email. Connectez-vous plutôt.');
  }

  const user = {
    id: `usr_${Date.now()}`,
    name: String(name || '').trim(),
    email: normalizedEmail,
    role: AUTH_ROLES.STUDENT,
    permissions: [AUTH_PERMISSIONS.VIEW_DASHBOARD, AUTH_PERMISSIONS.VIEW_COURSES, AUTH_PERMISSIONS.REQUEST_SUPPORT],
    enrolledCourseSlugs: ['cuniculture'],
    cohort: 'Nouvelle cohorte · Académie Agri-Tech',
    accessStatus: 'trial',
    billingStatus: 'pending-payment',
    createdAt: new Date().toISOString(),
    passwordFingerprint: mockPasswordFingerprint(password)
  };

  setStoredUsers([...users, user]);
  return persistSession(sanitizeUser(user));
}

export function enrollCurrentUserInCourse(courseSlug, updates = {}) {
  const session = getCurrentSession();
  const user = session?.user;

  if (!user || !courseSlug) return null;

  const enrolledCourseSlugs = Array.from(new Set([...(user.enrolledCourseSlugs || []), courseSlug]));
  const updatedUser = {
    ...user,
    ...updates,
    enrolledCourseSlugs
  };

  const users = getStoredUsers();
  const userIndex = users.findIndex((storedUser) => storedUser.email === updatedUser.email);
  if (userIndex >= 0) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    setStoredUsers(users);
  }

  return persistSession(updatedUser);
}

export async function requestPasswordResetMock(email) {
  await wait(350);
  return {
    email: normalizeEmail(email),
    status: 'mock-sent',
    message: 'Si un compte existe, un lien de réinitialisation sera envoyé lors de la connexion au backend.'
  };
}

export function getGoogleOAuthDiagnostic() {
  const clerk = window.Clerk;

  if (!clerk) {
    return {
      ok: false,
      code: 'clerk-not-loaded',
      details: 'Clerk absent sur window.Clerk. Vérifier la clé publique, le script/SDK et le domaine de redirection Academy.'
    };
  }

  const hasRedirect = typeof clerk.redirectToSignIn === 'function' || typeof clerk.redirectToSignUp === 'function';
  const hasSso = typeof clerk.client?.signIn?.sso === 'function' || typeof clerk.client?.signUp?.sso === 'function';

  return {
    ok: hasRedirect || hasSso,
    code: hasRedirect || hasSso ? 'google-oauth-ready' : 'unsupported-clerk-runtime',
    details: hasRedirect || hasSso
      ? 'Clerk est détecté avec une méthode OAuth compatible Google.'
      : 'Clerk est chargé, mais aucune méthode redirectToSignIn/redirectToSignUp ou SSO compatible n’est disponible.'
  };
}

export async function continueWithGoogleOAuth({ mode = 'sign-in' } = {}) {
  const clerk = window.Clerk;
  const redirectUrl = ACADEMY_DASHBOARD_PATH;

  if (!clerk) {
    const diagnostic = getGoogleOAuthDiagnostic();
    return {
      ok: false,
      reason: diagnostic.code,
      message: `Connexion Google prête côté UI. Diagnostic : ${diagnostic.details}`
    };
  }

  if (typeof clerk.load === 'function' && !clerk.loaded) {
    await clerk.load();
  }

  const redirectOptions = {
    strategy: CLERK_GOOGLE_STRATEGY,
    forceRedirectUrl: redirectUrl,
    fallbackRedirectUrl: redirectUrl,
    signInForceRedirectUrl: redirectUrl,
    signUpForceRedirectUrl: redirectUrl
  };
  const redirectMethod = mode === 'sign-up' ? clerk.redirectToSignUp : clerk.redirectToSignIn;

  if (typeof redirectMethod === 'function') {
    await redirectMethod.call(clerk, redirectOptions);
    return { ok: true, status: 'redirecting', provider: 'clerk', redirectUrl };
  }

  const flow = mode === 'sign-up' ? clerk.client?.signUp : clerk.client?.signIn;

  if (typeof flow?.sso === 'function') {
    await flow.sso({
      strategy: CLERK_GOOGLE_STRATEGY,
      redirectUrl,
      redirectCallbackUrl: redirectUrl
    });
    return { ok: true, status: 'redirecting', provider: 'clerk', redirectUrl };
  }

  return {
    ok: false,
    reason: 'unsupported-clerk-runtime',
    message: `Diagnostic Google OAuth : ${getGoogleOAuthDiagnostic().details}`
  };
}

export function logout({ redirectTo } = {}) {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('academy-auth-change', { detail: null }));

  if (redirectTo) {
    window.location.assign(redirectTo);
  }
}

export function getRedirectTarget(defaultTarget = '../dashboard/') {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');

  if (!redirect || redirect.startsWith('http') || redirect.startsWith('//')) return defaultTarget;
  return redirect;
}

export function updateAcademyAuthNavigation({
  loginHref = '/academy/login/',
  registerHref = '/academy/register/',
  dashboardHref = '/academy/dashboard/',
  myCoursesHref = '/academy/my-courses/',
  logoutRedirectHref = '/academy/login/',
  currentPage = getAcademyCurrentPage()
} = {}) {
  const navLinks = document.querySelector('#academyNavLinks');
  if (!navLinks) return;

  pruneAcademyNavigation(navLinks);

  const user = getCurrentUser();
  const wrapper = document.createDocumentFragment();

  if (user) {
    wrapper.append(createNavLink('Dashboard', dashboardHref));
    wrapper.append(createNavLink('Mes formations', myCoursesHref, 'nav-cta'));
    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.className = 'academy-logout-link';
    logoutButton.dataset.academyAuthLink = 'true';
    logoutButton.textContent = 'Déconnexion';
    logoutButton.setAttribute('aria-label', `Déconnecter ${user.name}`);
    logoutButton.addEventListener('click', () => logout({ redirectTo: logoutRedirectHref }));
    wrapper.append(logoutButton);
  } else {
    if (currentPage !== 'login') {
      wrapper.append(createNavLink('Connexion', loginHref));
    }
    if (currentPage !== 'register') {
      wrapper.append(createNavLink('Créer un compte', registerHref, 'nav-cta'));
    }
  }

  navLinks.append(wrapper);
}

function pruneAcademyNavigation(navLinks) {
  const academyOnlyLabels = new Set([
    'demander un devis',
    'services',
    'méthode',
    'dashboard',
    'mes formations',
    'espace étudiant',
    'connexion',
    'créer un compte',
    'deconnexion',
    'déconnexion'
  ]);

  navLinks.querySelectorAll('[data-academy-auth-link]').forEach((node) => node.remove());
  [...navLinks.children].forEach((item) => {
    const label = item.textContent.trim().toLowerCase();
    if (academyOnlyLabels.has(label)) {
      item.remove();
    }
  });
}

function getAcademyCurrentPage() {
  const pathname = window.location.pathname;

  if (pathname.includes('/academy/login')) return 'login';
  if (pathname.includes('/academy/register')) return 'register';
  if (pathname.includes('/academy/dashboard')) return 'dashboard';
  if (pathname.includes('/academy/my-courses')) return 'my-courses';
  return 'academy';
}

function createNavLink(label, href, className = '') {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  link.dataset.academyAuthLink = 'true';
  if (className) link.className = className;
  return link;
}
