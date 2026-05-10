import type { CSSProperties } from 'react';
import { courses } from '../../data/courses.js';
import { AcademyShell, CourseCard, Eyebrow, PrimaryButton, SecondaryButton, academyTheme } from './AcademyChrome';

export default function AcademyPage() {
  const featuredCourses = courses.slice(0, 3);

  return (
    <AcademyShell current="academy">
      <main>
        <section style={pageStyles.hero}>
          <div>
            <Eyebrow>Académie Agri-Tech</Eyebrow>
            <h1 style={pageStyles.title}>Apprendre l’agriculture moderne, avec des parcours conçus pour le terrain.</h1>
            <p style={pageStyles.description}>
              Formations pratiques, accès étudiant, suivi de progression et checkout sécurisé : l’Academy prolonge l’univers Agri-Tech avec une expérience claire, chaleureuse et crédible.
            </p>
            <div style={pageStyles.actions}>
              <PrimaryButton href="/academy/courses">Voir les formations</PrimaryButton>
              <SecondaryButton href="/academy/dashboard">Espace étudiant</SecondaryButton>
            </div>
            <div style={pageStyles.trustRow}>
              <span><strong>3</strong> parcours pilotes</span>
              <span><strong>Mobile</strong> ready</span>
              <span><strong>Paiement</strong> préparé</span>
            </div>
          </div>
          <aside style={pageStyles.panel}>
            <span style={pageStyles.panelPill}>Fondation Academy</span>
            <h2 style={pageStyles.panelTitle}>Cours, accès étudiant et paiement dans une même expérience.</h2>
            <p style={pageStyles.panelText}>Une base stable pour connecter progressivement Clerk, PostgreSQL, PayPal, MonCash et les parcours e-learning.</p>
            <div style={pageStyles.stack}><span>Cours</span><span>Étudiants</span><span>Paiement</span></div>
          </aside>
        </section>

        <section style={pageStyles.section}>
          <div style={pageStyles.sectionHead}>
            <Eyebrow>Parcours pilotes</Eyebrow>
            <h2 style={pageStyles.sectionTitle}>Des formations agricoles structurées.</h2>
            <p style={pageStyles.sectionText}>Chaque parcours garde le ton Agri-Tech : concret, professionnel, accessible et pensé pour passer à l’action.</p>
          </div>
          <div style={pageStyles.grid}>
            {featuredCourses.map((course) => <CourseCard key={course.slug} course={course} actionLabel="Préparer l’achat" />)}
          </div>
        </section>
      </main>
    </AcademyShell>
  );
}

const pageStyles: Record<string, CSSProperties> = {
  hero: { maxWidth: 1180, margin: '0 auto', padding: '82px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 44, alignItems: 'center' },
  title: { margin: '0 0 22px', fontSize: 'clamp(2.5rem, 6vw, 5.2rem)', lineHeight: .95, letterSpacing: '-.06em', color: academyTheme.ink },
  description: { color: academyTheme.muted, fontSize: '1.08rem', maxWidth: 720, lineHeight: 1.7 },
  actions: { display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginTop: 28 },
  trustRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 26, color: academyTheme.muted },
  panel: { background: 'rgba(255,255,255,.82)', border: `1px solid ${academyTheme.border}`, borderRadius: 28, padding: 28, boxShadow: academyTheme.shadow },
  panelPill: { display: 'inline-flex', borderRadius: 999, padding: '8px 12px', background: academyTheme.green100, color: academyTheme.green900, fontWeight: 900, fontSize: '.8rem' },
  panelTitle: { margin: '20px 0 12px', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1, letterSpacing: '-.04em', color: academyTheme.green950 },
  panelText: { color: academyTheme.muted, lineHeight: 1.65 },
  stack: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 22, color: academyTheme.green900, fontWeight: 900 },
  section: { maxWidth: 1180, margin: '0 auto', padding: '42px 20px 10px' },
  sectionHead: { textAlign: 'center' as const, maxWidth: 780, margin: '0 auto 32px' },
  sectionTitle: { margin: 0, fontSize: 'clamp(2rem,4vw,3.3rem)', lineHeight: 1, letterSpacing: '-.045em' },
  sectionText: { color: academyTheme.muted, lineHeight: 1.65 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 18 },
};
