import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { startCoursePayment } from './actions';
import { getPublishedCourseBySlug } from '../../../../lib/payments/courses';
import { formatMoney } from '../../../../lib/payments/money';

export const dynamic = 'force-dynamic';

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
    <main style={styles.page}>
      <section style={styles.card} aria-labelledby="checkout-title">
        <p style={styles.kicker}>Paiement sécurisé</p>
        <div style={styles.header}>
          <div>
            <h1 id="checkout-title" style={styles.title}>{course.title}</h1>
            <p style={styles.description}>{course.description ?? 'Formation pratique de l’Académie Agri-Tech.'}</p>
          </div>
          <div style={styles.priceBox}>
            <span style={styles.priceLabel}>Prix</span>
            <strong style={styles.price}>{formattedPrice}</strong>
          </div>
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
              <dd>Accès étudiant après validation du paiement</dd>
            </div>
            <div style={styles.summaryRow}>
              <dt>Total</dt>
              <dd>{formattedPrice}</dd>
            </div>
          </dl>
        </div>

        <form action={pay} style={styles.form}>
          <button type="submit" style={styles.button}>Payer maintenant</button>
          <p style={styles.notice}>
            La création de commande et la redirection fournisseur sont exécutées côté serveur. En développement, un paiement simulé peut être activé sans exposer de clés sensibles.
          </p>
        </form>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f3f8ef 0%, #eef7f2 50%, #fff7e8 100%)',
    color: '#17351f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  card: {
    width: 'min(100%, 880px)',
    background: '#ffffff',
    borderRadius: '28px',
    boxShadow: '0 24px 70px rgba(23, 53, 31, 0.14)',
    padding: 'clamp(24px, 5vw, 48px)',
    border: '1px solid rgba(74, 127, 54, 0.16)',
  },
  kicker: {
    color: '#4a7f36',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    margin: '0 0 12px',
    fontSize: '0.78rem',
  },
  header: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2rem, 5vw, 3.4rem)',
    lineHeight: 1,
  },
  description: {
    margin: '16px 0 0',
    color: '#4b5f50',
    fontSize: '1.06rem',
    lineHeight: 1.65,
  },
  priceBox: {
    background: '#f3f8ef',
    borderRadius: '22px',
    padding: '20px',
    textAlign: 'right',
    border: '1px solid rgba(74, 127, 54, 0.18)',
  },
  priceLabel: {
    display: 'block',
    color: '#5d705f',
    fontSize: '0.9rem',
    marginBottom: '8px',
  },
  price: {
    color: '#2f6b2f',
    fontSize: '1.8rem',
  },
  summary: {
    marginTop: '32px',
    borderRadius: '22px',
    border: '1px solid #e1eadf',
    overflow: 'hidden',
  },
  summaryTitle: {
    margin: 0,
    padding: '18px 20px',
    background: '#fbfdf8',
    fontSize: '1.1rem',
  },
  summaryList: {
    margin: 0,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '16px 20px',
    borderTop: '1px solid #e1eadf',
  },
  form: {
    marginTop: '28px',
  },
  button: {
    width: '100%',
    border: 0,
    borderRadius: '999px',
    background: '#4a7f36',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: '1rem',
    padding: '16px 24px',
    boxShadow: '0 14px 28px rgba(74, 127, 54, 0.24)',
  },
  notice: {
    color: '#607064',
    fontSize: '0.9rem',
    lineHeight: 1.55,
    margin: '14px 0 0',
  },
};
