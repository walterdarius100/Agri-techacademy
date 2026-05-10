import { updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { cancelMockPayment } from '../../lib/academy-payments.js';
import { getCourseBySlug } from '../../data/courses.js';
import { escapeHtml } from '../../lib/html.js';

const cancelRoot = document.querySelector('#paymentCancelRoot');
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

function renderCancel() {
  if (!cancelRoot) return;

  const payment = cancelMockPayment({ courseSlug });

  cancelRoot.innerHTML = `
    <section class="payment-result section-pad" aria-labelledby="payment-cancel-title">
      <span class="eyebrow">Paiement annulé</span>
      <h1 id="payment-cancel-title">Aucun accès cours n’a été activé.</h1>
      <p>Votre tentative a été marquée comme annulée dans l’historique mock. Vous pouvez reprendre le checkout quand vous êtes prêt.</p>
      <div class="payment-result__card">
        <h2>Diagnostic</h2>
        <p><strong>Référence :</strong> ${escapeHtml(payment.id)}</p>
        <p><strong>Formation :</strong> ${escapeHtml(course?.title || 'Non sélectionnée')}</p>
      </div>
      <div class="hero-actions academy-hero__actions">
        <a href="../checkout/?course=${escapeHtml(courseSlug || '')}" class="btn primary academy-cta">Reprendre le checkout</a>
        <a href="../courses/" class="btn secondary academy-cta academy-cta--light">Retour catalogue</a>
      </div>
    </section>
  `;
}

updateAcademyAuthNavigation({ loginHref: '../login/', registerHref: '../register/', dashboardHref: '../dashboard/', myCoursesHref: '../my-courses/', logoutRedirectHref: '../login/' });
renderCancel();
initAcademyNavigation();
