import { requireAuth, updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { createMockPayment } from '../../lib/academy-payments.js';
import { getCourseBySlug } from '../../data/courses.js';
import { escapeHtml } from '../../lib/html.js';

const authUser = requireAuth({ loginPath: '../login/' });
const checkoutRoot = document.querySelector('#checkoutRoot');
const params = new URLSearchParams(window.location.search);
const courseSlug = params.get('course');
const course = getCourseBySlug(courseSlug);

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
  const box = checkoutRoot?.querySelector('[data-checkout-message]');
  if (!box) return;

  box.textContent = message;
  box.className = `checkout-message checkout-message--${type}`;
  box.hidden = !message;
}

function setLoading(isLoading) {
  checkoutRoot?.querySelectorAll('button, a').forEach((item) => {
    if (item.matches('[data-pay-now]')) item.disabled = isLoading;
  });

  const payButton = checkoutRoot?.querySelector('[data-pay-now]');
  if (payButton) payButton.textContent = isLoading ? 'Paiement mock en cours…' : 'Payer et activer mon accès';
}

function renderCheckout() {
  if (!checkoutRoot) return;

  if (!course) {
    checkoutRoot.innerHTML = `
      <section class="student-access-denied" aria-labelledby="checkout-missing-title">
        <span class="eyebrow">Checkout</span>
        <h1 id="checkout-missing-title">Formation introuvable.</h1>
        <p>Retournez au catalogue pour sélectionner une formation disponible avant de démarrer le paiement mock.</p>
        <a href="../courses/" class="btn primary academy-cta">Voir le catalogue</a>
      </section>
    `;
    return;
  }

  checkoutRoot.innerHTML = `
    <section class="checkout-layout section-pad" aria-labelledby="checkout-title">
      <div class="checkout-copy reveal is-visible">
        <span class="eyebrow">Checkout mock</span>
        <h1 id="checkout-title">Finaliser l’inscription à ${escapeHtml(course.title)}.</h1>
        <p>Cette étape prépare l’intégration future PayPal, MonCash, Stripe, Clerk et base de données sans appel backend au build.</p>
        <div class="checkout-provider-note" role="note">
          Connecté : <strong>${escapeHtml(authUser.name)}</strong> · Paiement simulé localement · Redirections relatives.
        </div>
      </div>

      <aside class="checkout-card" aria-label="Résumé du paiement">
        <span class="academy-pill">${escapeHtml(course.category)}</span>
        <h2>${escapeHtml(course.title)}</h2>
        <p>${escapeHtml(course.description)}</p>
        <dl class="checkout-summary">
          <div><dt>Durée</dt><dd>${escapeHtml(course.duration)}</dd></div>
          <div><dt>Niveau</dt><dd>${escapeHtml(course.level)}</dd></div>
          <div><dt>Montant</dt><dd>${escapeHtml(course.price)}</dd></div>
          <div><dt>Provider</dt><dd>Mock aujourd’hui · Stripe/PayPal/MonCash demain</dd></div>
        </dl>
        <div class="checkout-actions">
          <button class="btn primary academy-cta" type="button" data-pay-now>Payer et activer mon accès</button>
          <a href="../payment-cancel/?course=${escapeHtml(course.slug)}" class="btn secondary academy-cta academy-cta--light" data-cancel-payment>Annuler</a>
        </div>
        <p class="checkout-message" data-checkout-message hidden></p>
      </aside>
    </section>
  `;

  checkoutRoot.querySelector('[data-pay-now]')?.addEventListener('click', async () => {
    setCheckoutMessage('');
    setLoading(true);

    try {
      const payment = await createMockPayment({ courseSlug: course.slug, provider: 'mock' });
      window.location.assign(`../payment-success/?course=${encodeURIComponent(course.slug)}&payment=${encodeURIComponent(payment.id)}`);
    } catch (error) {
      setCheckoutMessage(error.message || 'Paiement mock indisponible pour le moment.');
      setLoading(false);
    }
  });
}

if (authUser) {
  updateAcademyAuthNavigation({ loginHref: '../login/', registerHref: '../register/', dashboardHref: '../dashboard/', myCoursesHref: '../my-courses/', logoutRedirectHref: '../login/' });
  renderCheckout();
  initAcademyNavigation();
}
