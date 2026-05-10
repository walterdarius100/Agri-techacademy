import { AcademyPageShell } from '../../_components/AcademyShell.js';
import { getCheckoutCourse, formatCurrency } from '../../../../lib/payment/mock.js';
import SuccessRecorder from './SuccessRecorder.js';

export const metadata = {
  title: 'Paiement confirmé | Académie Agri-Tech',
  description: 'Confirmation de paiement mock et activation de l’accès cours.'
};

export default function PaymentSuccessPage({ searchParams }) {
  const courseSlug = searchParams?.course || 'cuniculture';
  const course = getCheckoutCourse(courseSlug) || getCheckoutCourse('cuniculture');
  const amount = Number(searchParams?.amount || course.amount);
  const currency = searchParams?.currency || course.currency;
  const reference = searchParams?.ref || `MOCK-${course.slug.toUpperCase()}-CONFIRMED`;
  const formattedAmount = formatCurrency(amount, currency);
  const payment = {
    courseSlug: course.slug,
    courseTitle: course.title,
    amount: formattedAmount,
    status: 'confirmé',
    reference,
    date: new Date().toISOString()
  };

  return (
    <AcademyPageShell current="formations">
      <SuccessRecorder payment={payment} />
      <section className="academy-payment section-pad" aria-labelledby="payment-success-title">
        <article className="academy-payment__card academy-payment__card--success">
          <span className="academy-payment__badge">✓ Validé</span>
          <span className="eyebrow">Paiement confirmé</span>
          <h1 id="payment-success-title">Accès activé pour votre formation.</h1>
          <p>Le paiement mock est confirmé. L’inscription est simulée localement pour préparer la future création d’un Enrollment en base de données.</p>

          <dl className="academy-payment__details">
            <div><dt>Cours acheté</dt><dd>{course.title}</dd></div>
            <div><dt>Référence paiement</dt><dd className="academy-payment__reference">{reference}</dd></div>
            <div><dt>Montant</dt><dd>{formattedAmount}</dd></div>
            <div><dt>Accès</dt><dd>Activé</dd></div>
          </dl>

          <div className="academy-payment__actions">
            <a className="btn primary academy-cta" href="/academy/my-courses/">Aller à Mes formations</a>
            <a className="btn secondary academy-cta academy-cta--light" href="/academy/dashboard/">Aller au Dashboard</a>
            <a className="btn secondary academy-cta academy-cta--light" href={`/academy/my-courses/${course.slug}/`}>Continuer le cours</a>
          </div>
        </article>
      </section>
    </AcademyPageShell>
  );
}
