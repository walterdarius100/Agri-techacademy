import { escapeHtml } from '../../lib/html.js';

/**
 * Titre de section réutilisable pour garder une hiérarchie cohérente
 * sur les futures pages academy/courses, academy/dashboard et academy/admin.
 */
export function SectionTitle({ eyebrow, title, description, align = 'center', id = '' }) {
  const alignmentClass = align === 'left' ? 'academy-section-title--left' : '';
  const titleId = id ? ` id="${escapeHtml(id)}"` : '';

  return `
    <div class="academy-section-title ${alignmentClass}">
      <span class="eyebrow">${escapeHtml(eyebrow)}</span>
      <h2${titleId}>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}
