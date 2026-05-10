import { escapeHtml } from '../../lib/html.js';

/**
 * CTA public vers le checkout mock, sans paiement réel ni fournisseur externe.
 */
export function CourseCTA(course) {
  return `
    <section class="academy-course-cta section-pad" aria-labelledby="course-cta-title">
      <div>
        <span class="eyebrow">Inscription</span>
        <h2 id="course-cta-title">Prêt à rejoindre la formation&nbsp;?</h2>
        <p>Le checkout mock active l’accès de démonstration sans paiement réel, sans clé sensible et sans appel fournisseur.</p>
      </div>
      <div class="academy-course-cta__actions">
        <span>${escapeHtml(course.status)}</span>
        <a href="../../checkout/${escapeHtml(course.slug)}/" class="btn primary academy-cta">S’inscrire à la formation</a>
      </div>
    </section>
  `;
}
