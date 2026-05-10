import { requireAuth, updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { escapeHtml } from '../../lib/html.js';
import { getAccessibleStudentCourses, getMockPaymentHistory, simulatedStudent } from '../../data/student-academy.js';

const authUser = requireAuth({ loginPath: '../login/' });
const myCoursesRoot = document.querySelector('#myCoursesRoot');

function initAcademyNavigation() {
  const menuButton = document.querySelector('#academyMenuBtn');
  const navLinks = document.querySelector('#academyNavLinks');

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function renderProgressBar(progress, label) {
  return `
    <div class="student-progress" aria-label="${escapeHtml(label)}">
      <span style="width: ${progress}%"></span>
    </div>
  `;
}

function renderPaymentHistory() {
  const payments = getMockPaymentHistory();

  return `
    <section class="section-pad student-payment-history" aria-labelledby="payment-history-title">
      <article class="student-payment-history__card">
        <h2 id="payment-history-title">Historique paiements</h2>
        <p>Historique mock local en attendant la future table Payment liée aux inscriptions.</p>
        ${payments.length > 0 ? `
          <div class="student-payment-history__table" role="table" aria-label="Historique paiements mock">
            <div class="student-payment-history__row student-payment-history__row--head" role="row">
              <span>Cours</span><span>Montant</span><span>Statut</span><span>Date</span><span>Référence</span>
            </div>
            ${payments.map((payment) => `
              <div class="student-payment-history__row" role="row">
                <span data-label="Cours">${escapeHtml(payment.courseTitle)}</span>
                <span data-label="Montant">${escapeHtml(payment.amount)}</span>
                <span data-label="Statut">${escapeHtml(payment.status)}</span>
                <span data-label="Date">${escapeHtml(new Date(payment.date).toLocaleDateString('fr-FR'))}</span>
                <span data-label="Référence" class="student-payment-history__ref">${escapeHtml(payment.reference)}</span>
              </div>
            `).join('')}
          </div>
        ` : '<div class="student-payment-history__empty">Aucun paiement mock enregistré pour cette session locale.</div>'}
      </article>
    </section>
  `;
}

function renderMyCourses() {
  if (!myCoursesRoot) return;

  const courses = getAccessibleStudentCourses(authUser);

  myCoursesRoot.innerHTML = `
    <section class="academy-list-hero student-list-hero section-pad" aria-labelledby="my-courses-title">
      <span class="eyebrow">${escapeHtml(authUser?.role === 'student' ? 'Étudiant connecté' : simulatedStudent.role)}</span>
      <h1 id="my-courses-title">Mes formations accessibles.</h1>
      <p>Cette page utilise une session locale temporaire pour simuler les cours inscrits, leur progression et les liens de reprise avant le backend réel.</p>
      <div class="hero-actions academy-hero__actions">
        <a href="../dashboard/" class="btn secondary academy-cta academy-cta--light">Retour dashboard</a>
        <a href="../courses/" class="btn primary academy-cta">Voir le catalogue public</a>
      </div>
    </section>

    <section class="section-pad student-course-grid" aria-label="Cours auxquels l’étudiant a accès">
      ${courses
        .map(
          (course) => `
            <article class="student-course-card">
              <img src="${escapeHtml(course.listImage)}" alt="" loading="lazy" decoding="async" />
              <div class="student-course-card__body">
                <span class="academy-pill">${escapeHtml(course.category)}</span>
                <h2>${escapeHtml(course.title)}</h2>
                <p>${escapeHtml(course.description)}</p>
                <div class="student-course-card__meta">
                  <span>${escapeHtml(course.duration)}</span>
                  <span>${escapeHtml(course.level)}</span>
                </div>
                <div>
                  <div class="student-progress-label">
                    <span>Progression</span>
                    <strong>${course.progress}%</strong>
                  </div>
                  ${renderProgressBar(course.progress, `Progression de ${course.title}`)}
                </div>
                <a href="./${escapeHtml(course.slug)}/" class="btn primary academy-cta">Continuer</a>
              </div>
            </article>
          `
        )
        .join('')}
    </section>

    ${renderPaymentHistory()}
  `;
}

if (authUser) {
  updateAcademyAuthNavigation({ loginHref: '../login/', registerHref: '../register/', dashboardHref: '../dashboard/', myCoursesHref: './', logoutRedirectHref: '../login/' });
  renderMyCourses();
  initAcademyNavigation();
}
