import { updateAcademyAuthNavigation } from '../../../lib/academy-auth.js';
import { escapeHtml } from '../../../lib/html.js';
import { getCourseBySlug } from '../../../data/courses.js';

const root = document.querySelector('#paymentCancelRoot');
const course = getCourseBySlug(new URLSearchParams(window.location.search).get('course'));

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
  if (!root) return;
  root.innerHTML = `
    <section class="section-pad payment-result" aria-labelledby="payment-cancel-title">
      <div class="payment-result__card payment-result__card--cancel">
        <span class="payment-result__icon payment-result__icon--cancel" aria-hidden="true">!</span>
        <span class="eyebrow">Paiement annulé</span>
        <h1 id="payment-cancel-title">Aucun accès n’a été activé.</h1>
        <p>Votre paiement n’a pas été confirmé. Vous pouvez réessayer sans perdre votre progression de navigation.</p>
        <div class="hero-actions academy-hero__actions payment-result__actions">
          ${course ? `<a href="../../checkout/${escapeHtml(course.slug)}/" class="btn primary academy-cta">Réessayer le paiement</a>` : '<a href="../../courses/" class="btn primary academy-cta">Choisir une formation</a>'}
          <a href="../../courses/" class="btn secondary academy-cta academy-cta--light">Retour aux formations</a>
        </div>
      </div>
    </section>
  `;
}

updateAcademyAuthNavigation({ loginHref: '../../login/', registerHref: '../../register/', dashboardHref: '../../dashboard/', myCoursesHref: '../../my-courses/', logoutRedirectHref: '../../login/' });
renderCancel();
initAcademyNavigation();
