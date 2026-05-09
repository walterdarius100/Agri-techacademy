import { escapeHtml } from '../../lib/html.js';

/**
 * Titre de section réutilisable pour garder une hiérarchie cohérente
 * sur les futures pages academy/courses, academy/dashboard et academy/admin.
 */
export function SectionTitle({ eyebrow, title, description, align = 'center' }) {
  const alignmentClass = align === 'left' ? 'academy-section-title--left' : '';

  return `
    <div class="academy-section-title ${alignmentClass}">
      <span class="eyebrow">${escapeHtml(eyebrow)}</span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}
