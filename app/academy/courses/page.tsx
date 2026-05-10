import type { CSSProperties } from 'react';
import { courses } from '../../../data/courses.js';
import { AcademyShell, CourseCard, Eyebrow, academyTheme } from '../AcademyChrome';

export default function AcademyCoursesPage() {
  return (
    <AcademyShell current="courses">
      <main style={styles.page}>
        <header style={styles.header}>
          <Eyebrow>Catalogue</Eyebrow>
          <h1 style={styles.title}>Formations de l’Académie</h1>
          <p style={styles.description}>Sélectionnez un parcours pour consulter le résumé d’achat et tester le checkout sécurisé préparé côté serveur.</p>
        </header>

        <section style={styles.grid} aria-label="Formations de l’Académie">
          {courses.map((course) => <CourseCard key={course.slug} course={course} actionLabel="Acheter la formation" />)}
        </section>
      </main>
    </AcademyShell>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 1180, margin: '0 auto', padding: '72px 20px 10px' },
  header: { maxWidth: 780, margin: '0 auto 34px', textAlign: 'center' as const },
  title: { margin: 0, fontSize: 'clamp(2.5rem, 6vw, 4.8rem)', lineHeight: .95, letterSpacing: '-.055em', color: academyTheme.ink },
  description: { color: academyTheme.muted, lineHeight: 1.7, fontSize: '1.08rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: 18 },
};
