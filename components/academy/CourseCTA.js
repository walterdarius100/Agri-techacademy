import { escapeHtml } from '../../lib/html.js';

/**
 * CTA public relié au checkout mock sans modifier le design global.
 */
export function CourseCTA(course) {
  return `
    <section class="academy-course-cta section-pad" aria-labelledby="course-cta-title">
      <div>
        <span class="eyebrow">Inscription</span>
        <h2 id="course-cta-title">Prêt à rejoindre la formation&nbsp;?</h2>
        <p>Inscription via checkout mock : connexion requise, paiement simulé, puis accès automatique au cours dans votre espace étudiant.</p>
      </div>
      <div class="academy-course-cta__actions">
        <span>${escapeHtml(course.status)}</span>
        <a href="../../checkout/?course=${escapeHtml(course.slug)}" class="btn primary academy-cta">Acheter / s’inscrire</a>
      </div>
    </section>
  `;
}
