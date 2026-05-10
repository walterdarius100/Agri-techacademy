import type { CSSProperties } from 'react';
export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Paiement confirmé</p>
        <h1 style={styles.title}>Votre achat est validé.</h1>
        <p style={styles.text}>L’inscription à la formation est préparée dès confirmation du fournisseur de paiement. Vous pouvez retourner à votre espace étudiant.</p>
        <a href="/academy/dashboard" style={styles.link}>Aller à mon espace étudiant</a>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f3f8ef', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', color: '#17351f' },
  card: { width: 'min(100%, 680px)', background: '#fff', borderRadius: '28px', padding: 'clamp(24px, 6vw, 48px)', boxShadow: '0 24px 70px rgba(23, 53, 31, 0.14)' },
  kicker: { color: '#4a7f36', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px', fontSize: '0.78rem' },
  title: { margin: 0, fontSize: 'clamp(2rem, 5vw, 3rem)' },
  text: { color: '#4b5f50', lineHeight: 1.65, fontSize: '1.05rem' },
  link: { display: 'inline-flex', marginTop: '18px', background: '#4a7f36', color: '#fff', textDecoration: 'none', borderRadius: '999px', padding: '13px 22px', fontWeight: 800 },
};
