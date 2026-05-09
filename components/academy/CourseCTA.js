import { escapeHtml } from '../../lib/html.js';

/**
 * CTA public temporaire : aucune authentification ni paiement n’est déclenché.
 */
export function CourseCTA(course) {
  return `
    <section class="academy-course-cta section-pad" aria-labelledby="course-cta-title">
      <div>
        <span class="eyebrow">Inscription</span>
        <h2 id="course-cta-title">Prêt à rejoindre la formation&nbsp;?</h2>
        <p>Les inscriptions complètes seront activées plus tard. Pour l’instant, ce bouton prépare le parcours public sans paiement, compte étudiant ou dashboard.</p>
      </div>
      <div class="academy-course-cta__actions">
        <span>${escapeHtml(course.status)}</span>
        <a href="../../../#contact" class="btn primary academy-cta">S’inscrire à la formation</a>
      </div>
    </section>
  `;
}
