/**
 * Helpers HTML partagés par la future académie.
 * Ce fichier centralise les utilitaires sans dépendance afin de faciliter
 * une migration progressive vers Next.js tout en sécurisant le rendu statique actuel.
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
