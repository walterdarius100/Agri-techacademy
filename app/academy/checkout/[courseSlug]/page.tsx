import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { AcademyShell, Eyebrow, academyTheme } from '../../AcademyChrome';
import { startCoursePayment } from './actions';
import { getPublishedCourseBySlug } from '../../../../lib/payments/courses';
import { formatMoney } from '../../../../lib/payments/money';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CheckoutPageProps = {
  params: Promise<{ courseSlug: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { courseSlug } = await params;
  const course = await getPublishedCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const formattedPrice = formatMoney(course.priceCents, course.currency);
  const pay = startCoursePayment.bind(null, course.slug);

  return (
    <AcademyShell current="checkout">
      <main style={styles.page}>
        <section style={styles.hero} aria-labelledby="checkout-title">
          <div style={styles.copy}>
            <Eyebrow>Checkout Academy</Eyebrow>
            <h1 id="checkout-title" style={styles.title}>{course.title}</h1>
            <p style={styles.description}>{course.description ?? 'Formation pratique de l’Académie Agri-Tech.'}</p>
            <div style={styles.reassuranceGrid} aria-label="Garanties avant paiement">
              <span>Accès étudiant après confirmation</span>
              <span>Paiement traité côté serveur</span>
              <span>Support Agri-Tech disponible</span>
            </div>
          </div>

          <aside style={styles.checkoutCard} aria-label="Résumé du paiement">
            <div style={styles.priceHeader}>
              <span style={styles.priceLabel}>Total à payer</span>
              <strong style={styles.price}>{formattedPrice}</strong>
            </div>

            <div style={styles.summary}>
              <h2 style={styles.summaryTitle}>Résumé de l’achat</h2>
              <dl style={styles.summaryList}>
                <div style={styles.summaryRow}>
                  <dt>Formation</dt>
                  <dd>{course.title}</dd>
                </div>
                <div style={styles.summaryRow}>
                  <dt>Accès</dt>
                  <dd>Ouverture de l’espace étudiant après validation</dd>
                </div>
                <div style={styles.summaryRow}>
                  <dt>Devise</dt>
                  <dd>{course.currency}</dd>
                </div>
                <div style={styles.totalRow}>
                  <dt>Total</dt>
                  <dd>{formattedPrice}</dd>
                </div>
              </dl>
            </div>

            <form action={pay} style={styles.form}>
              <button type="submit" style={styles.button}>Payer maintenant</button>
              <p style={styles.notice}>
                Vous serez redirigé vers le fournisseur configuré. Aucune clé sensible n’est exposée dans le navigateur; l’inscription est créée uniquement après confirmation du paiement.
              </p>
            </form>
          </aside>
        </section>
      </main>
    </AcademyShell>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 1180, margin: '0 auto', padding: '72px 20px 10px' },
  hero: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 34, alignItems: 'start' },
  copy: { paddingTop: 22 },
  title: { margin: '0 0 18px', fontSize: 'clamp(2.4rem, 6vw, 4.8rem)', lineHeight: .95, letterSpacing: '-.055em', color: academyTheme.ink },
  description: { color: academyTheme.muted, fontSize: '1.08rem', lineHeight: 1.7, maxWidth: 680 },
  reassuranceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: 10, marginTop: 28 },
  checkoutCard: { background: 'rgba(255,255,255,.9)', border: `1px solid ${academyTheme.border}`, borderRadius: 28, padding: 'clamp(22px, 4vw, 32px)', boxShadow: academyTheme.shadow },
  priceHeader: { borderRadius: 24, background: academyTheme.green950, color: '#fff', padding: 22, marginBottom: 18, position: 'relative' as const, overflow: 'hidden' },
  priceLabel: { display: 'block', color: 'rgba(255,255,255,.72)', fontWeight: 800, marginBottom: 6 },
  price: { display: 'block', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1, letterSpacing: '-.04em' },
  summary: { border: `1px solid ${academyTheme.border}`, borderRadius: 24, overflow: 'hidden', background: '#fff' },
  summaryTitle: { margin: 0, padding: '16px 18px', background: academyTheme.green100, color: academyTheme.green900, fontSize: '1rem', fontWeight: 900 },
  summaryList: { margin: 0 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', gap: 18, padding: '15px 18px', borderTop: `1px solid ${academyTheme.border}`, color: academyTheme.muted },
  totalRow: { display: 'flex', justifyContent: 'space-between', gap: 18, padding: '17px 18px', borderTop: `1px solid ${academyTheme.border}`, color: academyTheme.green950, fontWeight: 900, background: '#fbfaf6' },
  form: { marginTop: 22 },
  button: { width: '100%', minHeight: 54, border: 0, borderRadius: 999, background: academyTheme.green900, color: '#fff', cursor: 'pointer', fontWeight: 900, fontSize: '1rem', padding: '15px 22px', boxShadow: '0 14px 30px rgba(15,61,46,.22)' },
  notice: { color: academyTheme.muted, fontSize: '.92rem', lineHeight: 1.6, margin: '14px 0 0', textAlign: 'center' as const },
};
