import type { CSSProperties } from 'react';
import { courses } from '../../data/courses.js';

export default function AcademyPage() {
  const featuredCourses = courses.slice(0, 3);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>Académie Agri-Tech</p>
        <h1 style={styles.title}>Formations agricoles pratiques et numériques.</h1>
        <p style={styles.description}>
          Une preview Next.js stable pour présenter les parcours pilotes, tester le checkout et préparer l’intégration paiement sans dépendre des clés réelles au build.
        </p>
        <div style={styles.actions}>
          <a href="/academy/courses" style={styles.primaryLink}>Voir les formations</a>
          <a href="/academy/dashboard" style={styles.secondaryLink}>Espace étudiant</a>
        </div>
      </section>

      <section style={styles.grid} aria-label="Formations disponibles">
        {featuredCourses.map((course) => (
          <article key={course.slug} style={styles.card}>
            <span style={styles.badge}>{course.category}</span>
            <h2 style={styles.cardTitle}>{course.title}</h2>
            <p style={styles.cardText}>{course.description}</p>
            <a href={`/academy/checkout/${course.slug}`} style={styles.cardLink}>Préparer l’achat</a>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', padding: 'clamp(24px, 6vw, 72px)', background: 'linear-gradient(135deg, #f3f8ef 0%, #fff7e8 100%)', color: '#17351f', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  hero: { maxWidth: '920px', margin: '0 auto 40px', textAlign: 'center' },
  kicker: { color: '#4a7f36', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px', fontSize: '0.78rem' },
  title: { margin: 0, fontSize: 'clamp(2.4rem, 7vw, 5rem)', lineHeight: 0.95 },
  description: { margin: '20px auto 0', maxWidth: '720px', color: '#4b5f50', fontSize: '1.08rem', lineHeight: 1.7 },
  actions: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', marginTop: '28px' },
  primaryLink: { background: '#4a7f36', color: '#fff', textDecoration: 'none', borderRadius: '999px', padding: '14px 22px', fontWeight: 800 },
  secondaryLink: { background: '#fff', color: '#2f6b2f', textDecoration: 'none', borderRadius: '999px', padding: '14px 22px', fontWeight: 800, border: '1px solid rgba(74, 127, 54, 0.24)' },
  grid: { width: 'min(100%, 1120px)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 18px 50px rgba(23, 53, 31, 0.1)', border: '1px solid rgba(74, 127, 54, 0.14)' },
  badge: { color: '#4a7f36', fontWeight: 800, fontSize: '0.8rem' },
  cardTitle: { margin: '12px 0', fontSize: '1.35rem' },
  cardText: { color: '#4b5f50', lineHeight: 1.6 },
  cardLink: { display: 'inline-flex', marginTop: '12px', color: '#2f6b2f', fontWeight: 800, textDecoration: 'none' },
};
