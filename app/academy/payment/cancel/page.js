import { AcademyPageShell } from '../../_components/AcademyShell.js';
import { getCheckoutCourse } from '../../../../lib/payment/mock.js';

export const metadata = {
  title: 'Paiement annulé | Académie Agri-Tech',
  description: 'Paiement mock annulé, avec options pour réessayer ou revenir aux formations.'
};

export default function PaymentCancelPage({ searchParams }) {
  const courseSlug = searchParams?.course || 'cuniculture';
  const course = getCheckoutCourse(courseSlug) || getCheckoutCourse('cuniculture');

  return (
    <AcademyPageShell current="formations">
      <section className="academy-payment section-pad" aria-labelledby="payment-cancel-title">
        <article className="academy-payment__card academy-payment__card--cancel">
          <span className="eyebrow">Paiement annulé</span>
          <h1 id="payment-cancel-title">Votre accès n’a pas été activé.</h1>
          <p>Aucune transaction réelle n’a été effectuée. Vous pouvez reprendre le checkout mock ou retourner au catalogue des formations.</p>
          <dl className="academy-payment__details">
            <div><dt>Formation</dt><dd>{course.title}</dd></div>
            <div><dt>Statut</dt><dd>Annulé</dd></div>
          </dl>
          <div className="academy-payment__actions">
            <a className="btn primary academy-cta" href={`/academy/checkout/${course.slug}/`}>Réessayer</a>
            <a className="btn secondary academy-cta academy-cta--light" href="/academy/courses/">Retour formations</a>
          </div>
        </article>
      </section>
    </AcademyPageShell>
  );
}
