import { escapeHtml } from '../../lib/html.js';

export function CourseCTA(course) {
  return `
    <section class="academy-course-cta section-pad" aria-labelledby="course-cta-title">
      <div>
        <span class="eyebrow">Inscription</span>
        <h2 id="course-cta-title">Prêt à rejoindre la formation&nbsp;?</h2>
        <p>Finalisez l’inscription via le checkout sécurisé de l’Academy. L’accès au cours sera activé automatiquement après validation du paiement.</p>
      </div>
      <div class="academy-course-cta__actions">
        <span>${escapeHtml(course.status)}</span>
        <a href="../../checkout/${escapeHtml(course.slug)}/" class="btn primary academy-cta">Acheter / s’inscrire</a>
      </div>
    </section>
  `;
}
