import { requireAuth, updateAcademyAuthNavigation } from '../../../lib/academy-auth.js';
import { escapeHtml } from '../../../lib/html.js';
import { formatMoney } from '../../../lib/payments/index.js';
import { getPaymentsForUser } from '../../../lib/payments/store.js';

const authUser = requireAuth({ loginPath: '../../login/' });
const root = document.querySelector('#paymentHistoryRoot');

function initAcademyNavigation() {
  const menuButton = document.querySelector('#academyMenuBtn');
  const navLinks = document.querySelector('#academyNavLinks');
  if (!menuButton || !navLinks) return;
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function formatDate(value) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function renderHistory() {
  if (!root) return;
  const payments = getPaymentsForUser(authUser.id);
  root.innerHTML = `
    <section class="academy-list-hero student-list-hero section-pad" aria-labelledby="payment-history-title">
      <span class="eyebrow">Historique paiements</span>
      <h1 id="payment-history-title">Vos achats Academy.</h1>
      <p>Retrouvez les formations achetées, montants, statuts et liens de reprise. Les entrées actuelles viennent du provider mock de développement.</p>
      <div class="hero-actions academy-hero__actions">
        <a href="../../dashboard/" class="btn secondary academy-cta academy-cta--light">Retour dashboard</a>
        <a href="../../courses/" class="btn primary academy-cta">Explorer le catalogue</a>
      </div>
    </section>
    <section class="section-pad payment-history" aria-label="Historique des paiements">
      ${payments.length ? `
        <div class="payment-history__table">
          ${payments.map((payment) => `
            <article class="payment-history__row">
              <div><span>Formation</span><strong>${escapeHtml(payment.courseTitle)}</strong></div>
              <div><span>Montant</span><strong>${formatMoney(payment.amountCents, payment.currency)}</strong></div>
              <div><span>Statut</span><strong>${escapeHtml(payment.status)}</strong></div>
              <div><span>Date</span><strong>${formatDate(payment.paidAt || payment.createdAt)}</strong></div>
              <a href="../../my-courses/${escapeHtml(payment.courseSlug)}/" class="btn secondary academy-cta academy-cta--light">Voir le cours</a>
            </article>
          `).join('')}
        </div>` : `
        <div class="student-access-denied">
          <span class="eyebrow">Aucun paiement</span>
          <h2>Aucun achat confirmé pour ce compte.</h2>
          <p>Choisissez une formation puis validez le paiement mock pour générer un historique.</p>
          <a href="../../courses/" class="btn primary academy-cta">Voir les formations</a>
        </div>`}
    </section>
  `;
}

if (authUser) {
  updateAcademyAuthNavigation({ loginHref: '../../login/', registerHref: '../../register/', dashboardHref: '../../dashboard/', myCoursesHref: '../../my-courses/', logoutRedirectHref: '../../login/' });
  renderHistory();
  initAcademyNavigation();
}
