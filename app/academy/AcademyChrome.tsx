import type { CSSProperties, ReactNode } from 'react';

export const academyTheme = {
  green950: '#06281f',
  green900: '#0f3d2e',
  green700: '#176b48',
  green100: '#e8f5ee',
  gold: '#f2b84b',
  cream: '#f8f4ea',
  ink: '#14211b',
  muted: '#64736b',
  border: 'rgba(20,33,27,.12)',
  shadow: '0 24px 70px rgba(6,40,31,.14)',
};

type AcademyShellProps = {
  children: ReactNode;
  current?: 'academy' | 'courses' | 'checkout' | 'payment';
};

export function AcademyShell({ children, current }: AcademyShellProps) {
  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <nav style={styles.navbar} aria-label="Navigation Academy">
          <a href="/academy" style={styles.brand}>
            <span style={styles.brandMark}><img src="/assets/images/logo-agritech.png" alt="" style={styles.brandLogo} /></span>
            <span style={styles.brandText}><strong>Agri-tech</strong><small style={styles.brandSmall}>Académie</small></span>
          </a>
          <div style={styles.navLinks}>
            <a href="/academy" style={navLinkStyle(current === 'academy')}>Académie</a>
            <a href="/academy/courses" style={navLinkStyle(current === 'courses')}>Formations</a>
            <a href="/academy/dashboard" style={navLinkStyle(false)}>Dashboard</a>
            <a href="/academy/courses" style={styles.navCta}>Choisir une formation</a>
          </div>
        </nav>
      </header>
      {children}
      <AcademyFooter />
    </div>
  );
}

export function AcademyFooter() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerGrid}>
        <div>
          <div style={styles.footerBrand}><span style={styles.footerMark}>A</span><strong>Agri-Tech Academy</strong></div>
          <p style={styles.footerText}>Une plateforme e-learning agricole pratique, pensée pour former, accompagner et ouvrir l’accès aux parcours terrain.</p>
        </div>
        <div style={styles.footerCol}>
          <strong>Academy</strong>
          <a href="/academy">Accueil</a>
          <a href="/academy/courses">Formations</a>
          <a href="/academy/dashboard">Dashboard</a>
        </div>
        <div style={styles.footerCol}>
          <strong>Compte</strong>
          <a href="/academy/login">Connexion</a>
          <a href="/academy/register">Créer un compte</a>
          <a href="/academy/my-courses">Mes formations</a>
        </div>
        <div style={styles.footerCol}>
          <strong>Agri-Tech</strong>
          <a href="/#services">Services</a>
          <a href="/#preuves">À propos</a>
          <a href="/#contact">Contact</a>
        </div>
      </div>
      <div style={styles.footerBottom}>© 2026 Agri-tech — Tous droits réservés</div>
    </footer>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p style={styles.eyebrow}>{children}</p>;
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} style={styles.primaryButton}>{children}</a>;
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} style={styles.secondaryButton}>{children}</a>;
}

export function CourseCard({ course, actionLabel = 'Voir le checkout' }: { course: { slug: string; title: string; category?: string; level?: string; duration?: string; description: string }; actionLabel?: string }) {
  return (
    <article style={styles.courseCard}>
      <div style={styles.cardTopLine}>
        <span style={styles.tag}>{course.category ?? course.level ?? 'Formation'}</span>
        {course.duration ? <span style={styles.duration}>{course.duration}</span> : null}
      </div>
      <h2 style={styles.cardTitle}>{course.title}</h2>
      <p style={styles.cardText}>{course.description}</p>
      <a href={`/academy/checkout/${course.slug}`} style={styles.cardButton}>{actionLabel}</a>
    </article>
  );
}

function navLinkStyle(isActive: boolean): CSSProperties {
  return {
    color: isActive ? academyTheme.green700 : academyTheme.ink,
    fontWeight: 800,
    textDecoration: 'none',
  };
}

export const styles: Record<string, CSSProperties> = {
  shell: { minHeight: '100vh', background: academyTheme.cream, color: academyTheme.ink, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  header: { position: 'sticky', top: 0, zIndex: 20, background: 'rgba(248,244,234,.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${academyTheme.border}` },
  navbar: { maxWidth: 1180, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 },
  brand: { display: 'flex', alignItems: 'center', gap: 12, color: academyTheme.ink, textDecoration: 'none' },
  brandMark: { width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: academyTheme.green900, overflow: 'hidden' },
  brandLogo: { width: 32, height: 32, objectFit: 'contain' },
  brandText: { display: 'flex', flexDirection: 'column', lineHeight: 1.15, fontWeight: 900 },
  brandSmall: { color: academyTheme.muted, fontWeight: 700 },
  navLinks: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 18, flexWrap: 'wrap' },
  navCta: { background: academyTheme.green900, color: '#fff', padding: '10px 16px', borderRadius: 999, fontWeight: 900, textDecoration: 'none', boxShadow: '0 14px 30px rgba(15,61,46,.16)' },
  footer: { borderTop: `1px solid ${academyTheme.border}`, background: academyTheme.green950, color: '#fff', marginTop: 80 },
  footerGrid: { maxWidth: 1180, margin: '0 auto', padding: '44px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 24 },
  footerBrand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  footerMark: { width: 34, height: 34, borderRadius: 12, display: 'grid', placeItems: 'center', background: academyTheme.gold, color: academyTheme.green950, fontWeight: 900 },
  footerText: { color: 'rgba(255,255,255,.72)', maxWidth: 420, lineHeight: 1.65, margin: 0 },
  footerCol: { display: 'grid', gap: 9, alignContent: 'start', color: 'rgba(255,255,255,.76)' },
  footerBottom: { maxWidth: 1180, margin: '0 auto', padding: '16px 20px 26px', color: 'rgba(255,255,255,.62)', borderTop: '1px solid rgba(255,255,255,.12)' },
  eyebrow: { color: academyTheme.green700, fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: '.78rem', margin: '0 0 12px' },
  primaryButton: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '13px 20px', borderRadius: 999, background: academyTheme.green900, color: '#fff', fontWeight: 900, textDecoration: 'none', boxShadow: '0 14px 30px rgba(15,61,46,.22)' },
  secondaryButton: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '13px 20px', borderRadius: 999, background: '#fff', color: academyTheme.ink, fontWeight: 900, textDecoration: 'none', border: `1px solid ${academyTheme.border}` },
  courseCard: { background: '#fff', border: `1px solid ${academyTheme.border}`, borderRadius: 28, padding: 24, boxShadow: 'none', display: 'flex', flexDirection: 'column', minHeight: 320 },
  cardTopLine: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  tag: { display: 'inline-block', fontSize: '.78rem', fontWeight: 900, color: academyTheme.green700, background: academyTheme.green100, borderRadius: 999, padding: '7px 11px' },
  duration: { color: academyTheme.muted, fontSize: '.86rem', fontWeight: 800 },
  cardTitle: { margin: '0 0 12px', fontSize: '1.35rem', lineHeight: 1.1, color: academyTheme.green950 },
  cardText: { color: academyTheme.muted, lineHeight: 1.65, marginBottom: 22, flex: 1 },
  cardButton: { display: 'inline-flex', justifyContent: 'center', alignItems: 'center', minHeight: 46, borderRadius: 999, padding: '12px 16px', background: academyTheme.green900, color: '#fff', textDecoration: 'none', fontWeight: 900, marginTop: 'auto' },
};
