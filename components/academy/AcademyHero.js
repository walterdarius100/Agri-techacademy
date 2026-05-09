import { escapeHtml } from '../../lib/html.js';

/**
 * Hero de l’académie : composant volontairement léger et statique.
 * Les prochaines étapes pourront y injecter l’état d’authentification,
 * des liens de paiement ou des CTA personnalisés sans toucher au reste de la page.
 */
export function AcademyHero({ eyebrow, title, description, ctaLabel, ctaHref }) {
  return `
    <section class="academy-hero section-pad" aria-labelledby="academy-title">
      <div class="academy-hero__content reveal is-visible">
        <span class="eyebrow">${escapeHtml(eyebrow)}</span>
        <h1 id="academy-title">${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
        <div class="hero-actions academy-hero__actions">
          <a href="${escapeHtml(ctaHref)}" class="btn primary academy-cta">${escapeHtml(ctaLabel)}</a>
          <a href="../#contact" class="btn secondary academy-cta academy-cta--light">Parler à un conseiller</a>
        </div>
        <div class="academy-hero__kpis" aria-label="Repères de l’académie">
          <span><strong>3</strong> parcours pilotes</span>
          <span><strong>100%</strong> terrain</span>
          <span><strong>Mobile</strong> ready</span>
        </div>
      </div>

      <aside class="academy-hero__panel reveal is-visible reveal-delay-1" aria-label="Fondation de la plateforme">
        <span class="academy-pill">Fondation technique</span>
        <h2>Une base prête pour évoluer</h2>
        <p>Architecture préparée pour accueillir progressivement les cours, l’espace étudiant, l’admin, l’authentification et le paiement.</p>
        <div class="academy-card-visual" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="academy-stack" aria-label="Modules prévus">
          <span>Cours</span>
          <span>Étudiants</span>
          <span>Admin</span>
          <span>Paiement</span>
        </div>
      </aside>
    </section>
  `;
}
