import { notFound } from 'next/navigation';
import { AcademyPageShell } from '../../_components/AcademyShell.js';
import { buildMockSuccessParams, formatCurrency, getCheckoutCourse, PAYMENT_PROVIDER } from '../../../../lib/payment/mock.js';

export function generateMetadata({ params }) {
  const course = getCheckoutCourse(params.courseSlug);
  return {
    title: course ? `Checkout — ${course.title} | Académie Agri-Tech` : 'Checkout | Académie Agri-Tech',
    description: course?.description || 'Checkout mock Agri-Tech Academy.'
  };
}

export default function CheckoutPage({ params }) {
  const course = getCheckoutCourse(params.courseSlug);
  if (!course) notFound();

  const formattedAmount = formatCurrency(course.amount, course.currency);
  const successHref = buildMockSuccessParams(course);
  const cancelHref = `/academy/payment/cancel/?course=${encodeURIComponent(course.slug)}`;

  return (
    <AcademyPageShell current="formations">
      <section className="academy-checkout section-pad" aria-labelledby="checkout-title">
        <div className="academy-checkout__intro">
          <a className="academy-back-link" href={`/academy/courses/${course.slug}/`}>← Retour à la formation</a>
          <span className="eyebrow">Paiement mock · {PAYMENT_PROVIDER}</span>
          <h1 id="checkout-title">Confirmer l’accès à la formation.</h1>
          <p>{course.description}</p>
          <div className="academy-course-hero__meta" aria-label="Informations rapides">
            <span>{course.duration}</span>
            <span>{course.level}</span>
            <span>Aucun paiement réel</span>
          </div>
        </div>

        <aside className="academy-checkout__card" aria-label="Résumé du checkout">
          <div className="academy-course-card__accent" aria-hidden="true" />
          <span className="academy-pill">{course.category}</span>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <div className="academy-checkout__price">
            <span>Montant à payer</span>
            <strong>{formattedAmount}</strong>
          </div>
          <ul className="academy-checkout__benefits" aria-label="Bénéfices inclus">
            {course.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
          <div className="academy-checkout__actions">
            <a className="btn primary academy-cta" href={successHref}>Payer maintenant</a>
            <a className="btn secondary academy-cta academy-cta--light" href={cancelHref}>Annuler</a>
          </div>
          <p className="academy-checkout__note">Provider mock par défaut : aucune clé sensible, aucun appel fournisseur et aucune transaction réelle.</p>
        </aside>
      </section>
    </AcademyPageShell>
  );
}
