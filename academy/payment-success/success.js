import { requireAuth, updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { getEmailOutbox, getPaymentHistory } from '../../lib/academy-payments.js';
import { getCourseBySlug } from '../../data/courses.js';
import { escapeHtml } from '../../lib/html.js';

const authUser = requireAuth({ loginPath: '../login/' });
const successRoot = document.querySelector('#paymentSuccessRoot');
const params = new URLSearchParams(window.location.search);
const courseSlug = params.get('course');
const paymentId = params.get('payment');
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

function renderSuccess() {
  if (!successRoot) return;

  const payment = getPaymentHistory(authUser).find((item) => item.id === paymentId);
  const confirmationEmail = getEmailOutbox(authUser).find((item) => item.id === `email_${paymentId}`);

  successRoot.innerHTML = `
    <section class="payment-result section-pad" aria-labelledby="payment-success-title">
      <span class="eyebrow">Paiement confirmé</span>
      <h1 id="payment-success-title">Votre accès est activé${course ? ` : ${escapeHtml(course.title)}` : ''}.</h1>
      <p>Le paiement mock a inscrit automatiquement la formation dans votre espace étudiant. Une confirmation email est simulée dans l’outbox locale.</p>

      <div class="payment-result__grid">
        <article class="payment-result__card">
          <h2>Détails paiement</h2>
          <p><strong>Référence :</strong> ${escapeHtml(payment?.id || paymentId || 'mock')}</p>
          <p><strong>Statut :</strong> ${escapeHtml(payment?.status || 'paid')}</p>
          <p><strong>Montant :</strong> ${escapeHtml(payment?.amountLabel || course?.price || 'Mock')}</p>
        </article>
        <article class="payment-result__card">
          <h2>Email confirmation</h2>
          <p>${escapeHtml(confirmationEmail?.preview || 'Confirmation prête pour EmailJS/SMTP lors du branchement backend.')}</p>
        </article>
      </div>

      <div class="hero-actions academy-hero__actions">
        <a href="../my-courses/${escapeHtml(courseSlug || '')}/" class="btn primary academy-cta">Accéder au cours</a>
        <a href="../my-courses/" class="btn secondary academy-cta academy-cta--light">Voir mes formations</a>
      </div>
    </section>
  `;
}

if (authUser) {
  updateAcademyAuthNavigation({ loginHref: '../login/', registerHref: '../register/', dashboardHref: '../dashboard/', myCoursesHref: '../my-courses/', logoutRedirectHref: '../login/' });
  renderSuccess();
  initAcademyNavigation();
}
