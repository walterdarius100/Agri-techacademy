import type { CSSProperties } from 'react';
import { courses } from '../../../data/courses.js';

export default function AcademyCoursesPage() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <p style={styles.kicker}>Catalogue</p>
        <h1 style={styles.title}>Formations de l’Académie</h1>
        <p style={styles.description}>Sélectionnez une formation pour tester le parcours checkout préparé côté serveur.</p>
      </header>

      <section style={styles.grid}>
        {courses.map((course) => (
          <article key={course.slug} style={styles.card}>
            <span style={styles.badge}>{course.level}</span>
            <h2 style={styles.cardTitle}>{course.title}</h2>
            <p style={styles.cardText}>{course.description}</p>
            <dl style={styles.meta}>
              <div><dt>Durée</dt><dd>{course.duration}</dd></div>
              <div><dt>Statut</dt><dd>{course.status}</dd></div>
            </dl>
            <a href={`/academy/checkout/${course.slug}`} style={styles.button}>Acheter la formation</a>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', padding: 'clamp(24px, 6vw, 72px)', background: '#f3f8ef', color: '#17351f', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  header: { maxWidth: '760px', margin: '0 auto 34px', textAlign: 'center' },
  kicker: { color: '#4a7f36', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px', fontSize: '0.78rem' },
  title: { margin: 0, fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1 },
  description: { color: '#4b5f50', lineHeight: 1.65, fontSize: '1.05rem' },
  grid: { width: 'min(100%, 1120px)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 18px 50px rgba(23, 53, 31, 0.1)', border: '1px solid rgba(74, 127, 54, 0.14)' },
  badge: { color: '#4a7f36', fontWeight: 800, fontSize: '0.82rem' },
  cardTitle: { margin: '12px 0', fontSize: '1.35rem' },
  cardText: { color: '#4b5f50', lineHeight: 1.6 },
  meta: { display: 'grid', gap: '8px', color: '#607064', margin: '16px 0' },
  button: { display: 'inline-flex', justifyContent: 'center', width: '100%', boxSizing: 'border-box', background: '#4a7f36', color: '#fff', textDecoration: 'none', borderRadius: '999px', padding: '13px 18px', fontWeight: 800 },
};
