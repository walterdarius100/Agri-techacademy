import { escapeHtml } from '../../lib/html.js';

/**
 * Carte de cours indépendante de la source de données.
 * Elle pourra être portée telle quelle en composant React/Next.js lorsque
 * les cours viendront d’une API, d’un CMS ou d’une base de données.
 */
export function CourseCard(course, { basePath = './courses' } = {}) {
  const outcomes = course.objectives
    .slice(0, 3)
    .map((outcome) => `<li>${escapeHtml(outcome)}</li>`)
    .join('');
  const href = `${basePath.replace(/\/$/, '')}/${course.slug}/`;

  return `
    <article class="academy-course-card">
      <div class="academy-course-card__accent" aria-hidden="true"></div>
      <div class="academy-course-card__meta">
        <span>${escapeHtml(course.category)}</span>
        <strong>${escapeHtml(course.status)}</strong>
      </div>
      <h3>${escapeHtml(course.title)}</h3>
      <p>${escapeHtml(course.description)}</p>
      <ul aria-label="Objectifs de la formation ${escapeHtml(course.title)}">
        ${outcomes}
      </ul>
      <div class="academy-course-card__footer">
        <span>${escapeHtml(course.duration)}</span>
        <span>${escapeHtml(course.level)}</span>
      </div>
      <a class="academy-course-card__link" href="${escapeHtml(href)}" aria-label="Voir le détail : ${escapeHtml(course.title)}">Voir le programme</a>
    </article>
  `;
}
