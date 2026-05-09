import { escapeHtml } from '../../lib/html.js';

/**
 * Programme modulaire d’une formation.
 */
export function CourseModuleList(modules) {
  return `
    <div class="academy-module-list">
      ${modules
        .map(
          (module, index) => `
            <article class="academy-module-card">
              <span>${String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>${escapeHtml(module.title)}</h3>
                <p>${escapeHtml(module.description)}</p>
              </div>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}
