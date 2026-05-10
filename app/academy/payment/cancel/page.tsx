import type { CSSProperties } from 'react';
export default function PaymentCancelPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Paiement annulé</p>
        <h1 style={styles.title}>Aucun paiement n’a été validé.</h1>
        <p style={styles.text}>Vous pouvez reprendre l’achat depuis la page de la formation. Aucune inscription payante n’est créée tant que le paiement n’est pas confirmé.</p>
        <a href="/academy/courses" style={styles.link}>Retour aux formations</a>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#fff7e8', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', color: '#17351f' },
  card: { width: 'min(100%, 680px)', background: '#fff', borderRadius: '28px', padding: 'clamp(24px, 6vw, 48px)', boxShadow: '0 24px 70px rgba(23, 53, 31, 0.12)' },
  kicker: { color: '#b7791f', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px', fontSize: '0.78rem' },
  title: { margin: 0, fontSize: 'clamp(2rem, 5vw, 3rem)' },
  text: { color: '#5f5344', lineHeight: 1.65, fontSize: '1.05rem' },
  link: { display: 'inline-flex', marginTop: '18px', background: '#4a7f36', color: '#fff', textDecoration: 'none', borderRadius: '999px', padding: '13px 22px', fontWeight: 800 },
};
