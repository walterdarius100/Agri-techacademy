import { requireAuth, updateAcademyAuthNavigation } from '../../../lib/academy-auth.js';
import { escapeHtml } from '../../../lib/html.js';
import { getCourseBySlug } from '../../../data/courses.js';
import { formatMoney } from '../../../lib/payments/index.js';
import { getPaymentByReference } from '../../../lib/payments/store.js';

const authUser = requireAuth({ loginPath: '../../login/' });
const root = document.querySelector('#paymentSuccessRoot');
const params = new URLSearchParams(window.location.search);
const course = getCourseBySlug(params.get('course'));
const payment = getPaymentByReference(params.get('payment'), authUser?.id);

function initAcademyNavigation() {
  const menuButton = document.querySelector('#academyMenuBtn');
  const navLinks = document.querySelector('#academyNavLinks');
  if (!menuButton || !navLinks) return;
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function renderSuccess() {
  if (!root) return;
  const title = course?.title ?? payment?.courseTitle ?? 'votre formation';
  root.innerHTML = `
    <section class="section-pad payment-result" aria-labelledby="payment-success-title">
      <div class="payment-result__card">
        <span class="payment-result__icon" aria-hidden="true">✓</span>
        <span class="eyebrow">Paiement validé</span>
        <h1 id="payment-success-title">Votre accès à ${escapeHtml(title)} est activé.</h1>
        <p>Le paiement mock a créé l’inscription, ajouté la formation à votre espace étudiant et préparé l’email de confirmation.</p>
        ${payment ? `<div class="payment-receipt"><span>Référence</span><strong>${escapeHtml(payment.reference)}</strong><span>Montant</span><strong>${formatMoney(payment.amountCents, payment.currency)}</strong></div>` : ''}
        <div class="hero-actions academy-hero__actions payment-result__actions">
          <a href="../../my-courses/" class="btn primary academy-cta">Aller vers Mes formations</a>
          <a href="../../dashboard/" class="btn secondary academy-cta academy-cta--light">Aller vers Dashboard</a>
          ${course ? `<a href="../../my-courses/${escapeHtml(course.slug)}/" class="btn secondary academy-cta academy-cta--light">Continuer vers le cours acheté</a>` : ''}
        </div>
      </div>
    </section>
  `;
}

if (authUser) {
  updateAcademyAuthNavigation({ loginHref: '../../login/', registerHref: '../../register/', dashboardHref: '../../dashboard/', myCoursesHref: '../../my-courses/', logoutRedirectHref: '../../login/' });
  renderSuccess();
  initAcademyNavigation();
}
