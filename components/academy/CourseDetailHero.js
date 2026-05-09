import { escapeHtml } from '../../lib/html.js';

/**
 * En-tête d’une page détail de formation.
 */
export function CourseDetailHero(course) {
  return `
    <section class="academy-course-hero section-pad" aria-labelledby="course-title">
      <div class="academy-course-hero__content reveal is-visible">
        <a class="academy-back-link" href="../">← Toutes les formations</a>
        <span class="eyebrow">${escapeHtml(course.category)}</span>
        <h1 id="course-title">${escapeHtml(course.title)}</h1>
        <p>${escapeHtml(course.description)}</p>
        <div class="academy-course-hero__meta" aria-label="Informations rapides">
          <span>${escapeHtml(course.duration)}</span>
          <span>${escapeHtml(course.level)}</span>
          <span>${escapeHtml(course.status)}</span>
        </div>
      </div>
      <aside class="academy-course-hero__card reveal is-visible reveal-delay-1">
        <img src="${escapeHtml(course.image)}" alt="" loading="eager" decoding="async" />
        <div>
          <span>Disponibilité</span>
          <strong>${escapeHtml(course.price)}</strong>
        </div>
      </aside>
    </section>
  `;
}
