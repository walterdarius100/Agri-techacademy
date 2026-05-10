import { enrollCurrentUserInCourse, requireAuth, updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { escapeHtml } from '../../lib/html.js';
import { getCourseBySlug } from '../../data/courses.js';
import { formatMoney, getPaymentProviderName, startPayment } from '../../lib/payments/index.js';
import { confirmCoursePayment, hasPaidForCourse } from '../../lib/payments/store.js';

const authUser = requireAuth({ loginPath: '../../login/' });
const checkoutRoot = document.querySelector('#checkoutRoot');
const slug = window.location.pathname.split('/').filter(Boolean).at(-1);
const course = getCourseBySlug(slug);

function initAcademyNavigation() {
  const menuButton = document.querySelector('#academyMenuBtn');
  const navLinks = document.querySelector('#academyNavLinks');
  if (!menuButton || !navLinks) return;
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function setCheckoutMessage(message, type = 'error') {
  const box = document.querySelector('[data-checkout-message]');
  if (!box) return;
  box.textContent = message;
  box.className = `payment-message payment-message--${type}`;
  box.hidden = !message;
}

function setCheckoutLoading(isLoading) {
  document.querySelectorAll('[data-payment-action]').forEach((button) => {
    button.disabled = isLoading;
  });
  const payButton = document.querySelector('[data-payment-action="pay"]');
  if (payButton) payButton.textContent = isLoading ? 'Validation du paiement…' : 'Payer maintenant';
}

function renderCheckout() {
  if (!checkoutRoot) return;

  if (!course) {
    checkoutRoot.innerHTML = `
      <section class="section-pad academy-not-found" aria-labelledby="checkout-not-found-title">
        <span class="eyebrow">Checkout indisponible</span>
        <h1 id="checkout-not-found-title">Cette formation n’est pas disponible au paiement.</h1>
        <p>Retournez au catalogue pour choisir une formation active.</p>
        <a href="../../courses/" class="btn primary academy-cta">Voir les formations</a>
      </section>
    `;
    return;
  }

  const alreadyPaid = hasPaidForCourse(authUser.id, course.slug);
  document.title = `Checkout · ${course.title} | Académie Agri-Tech`;

  checkoutRoot.innerHTML = `
    <section class="section-pad payment-checkout" aria-labelledby="checkout-title">
      <div class="payment-checkout__copy reveal is-visible">
        <span class="eyebrow">Checkout sécurisé</span>
        <h1 id="checkout-title">Finaliser votre accès à ${escapeHtml(course.title)}.</h1>
        <p>${escapeHtml(course.description)}</p>
        <ul class="academy-check-list payment-benefits" aria-label="Bénéfices inclus">
          <li>Accès immédiat au cours après paiement validé.</li>
          <li>Formation ajoutée automatiquement à Mes formations.</li>
          <li>Confirmation d’achat préparée par email mock.</li>
          <li>Historique disponible dans l’espace étudiant.</li>
        </ul>
      </div>
      <aside class="payment-summary-card reveal is-visible reveal-delay-1" aria-label="Résumé de commande">
        <span class="academy-pill">${escapeHtml(course.category)}</span>
        <h2>${escapeHtml(course.title)}</h2>
        <p>${escapeHtml(course.duration)} · ${escapeHtml(course.level)}</p>
        <div class="payment-summary-card__price">
          <span>Total</span>
          <strong>${formatMoney(course.priceCents, course.currency)}</strong>
        </div>
        <div class="payment-summary-card__meta">
          <span>Provider actif</span>
          <strong>${escapeHtml(getPaymentProviderName())}</strong>
        </div>
        <div class="payment-message" data-checkout-message hidden></div>
        ${alreadyPaid
          ? `<a href="../../my-courses/${escapeHtml(course.slug)}/" class="btn primary academy-cta">Continuer vers le cours</a>`
          : `<button type="button" class="btn primary academy-cta payment-primary-button" data-payment-action="pay">Payer maintenant</button>`}
        <a href="../../payment/cancel/?course=${encodeURIComponent(course.slug)}" class="btn secondary academy-cta academy-cta--light" data-payment-action="cancel">Annuler</a>
        <small>Aucune clé PayPal, MonCash ou Stripe n’est exposée côté client. Le mock confirme seulement une transaction locale de développement.</small>
      </aside>
    </section>
  `;
}

async function handlePayment() {
  if (!course || !authUser) return;
  setCheckoutMessage('');
  setCheckoutLoading(true);

  try {
    const providerPayment = await startPayment({ course, user: authUser });
    const { payment } = await confirmCoursePayment({
      user: authUser,
      course,
      providerPayment,
      updateUserEnrollment: enrollCurrentUserInCourse
    });

    window.location.assign(`../../payment/success/?course=${encodeURIComponent(course.slug)}&payment=${encodeURIComponent(payment.reference)}`);
  } catch (error) {
    setCheckoutMessage(error.message || 'Impossible de valider le paiement pour le moment.');
    setCheckoutLoading(false);
  }
}

if (authUser) {
  updateAcademyAuthNavigation({ loginHref: '../../login/', registerHref: '../../register/', dashboardHref: '../../dashboard/', myCoursesHref: '../../my-courses/', logoutRedirectHref: '../../login/' });
  renderCheckout();
  initAcademyNavigation();
  checkoutRoot?.addEventListener('click', (event) => {
    if (event.target.closest('[data-payment-action="pay"]')) handlePayment();
  });
}
