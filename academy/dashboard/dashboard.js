import { requireAuth, updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { getPaymentHistory } from '../../lib/academy-payments.js';
import { escapeHtml } from '../../lib/html.js';
import { getAccessibleStudentCourses, getOverallProgress, simulatedStudent } from '../../data/student-academy.js';

const authUser = requireAuth({ loginPath: '../login/' });
const dashboardRoot = document.querySelector('#studentDashboardRoot');

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

function renderDashboard() {
  if (!dashboardRoot) return;

  const courses = getAccessibleStudentCourses(authUser);
  const overallProgress = getOverallProgress(authUser);
  const completedCourses = courses.filter((course) => course.progress >= 100).length;
  const activeCourses = courses.filter((course) => course.progress > 0 && course.progress < 100).length;
  const payments = getPaymentHistory(authUser).slice(0, 3);

  dashboardRoot.innerHTML = `
    <section class="student-hero section-pad" aria-labelledby="student-dashboard-title">
      <div class="student-hero__content reveal is-visible">
        <span class="eyebrow">Espace étudiant · simulation</span>
        <h1 id="student-dashboard-title">Bienvenue, ${escapeHtml(authUser?.name || simulatedStudent.name)} 👋</h1>
        <p>Voici une première structure visuelle de votre espace étudiant. Les données, accès et progressions sont temporaires en attendant l’authentification, le paiement et la base de données.</p>
        <div class="hero-actions academy-hero__actions">
          <a href="../my-courses/" class="btn primary academy-cta">Mes formations</a>
          <a href="../courses/" class="btn secondary academy-cta academy-cta--light">Explorer le catalogue</a>
        </div>
      </div>
      <aside class="student-summary-card reveal is-visible reveal-delay-1" aria-label="Progression globale">
        <span>${escapeHtml(authUser?.cohort || simulatedStudent.cohort)}</span>
        <strong>${overallProgress}%</strong>
        <p>Progression globale moyenne sur les formations accessibles.</p>
        ${renderProgressBar(overallProgress, 'Progression globale')}
      </aside>
    </section>

    <section class="section-pad student-stats" aria-label="Résumé des cours">
      <article>
        <span>${courses.length}</span>
        <h2>Cours inscrits</h2>
        <p>Formations simulées auxquelles l’étudiant a actuellement accès.</p>
      </article>
      <article>
        <span>${activeCourses}</span>
        <h2>En cours</h2>
        <p>Parcours commencés avec au moins une leçon consultée.</p>
      </article>
      <article>
        <span>${completedCourses}</span>
        <h2>Terminés</h2>
        <p>Compteur prêt pour les futurs certificats et validations.</p>
      </article>
    </section>

    <section class="section-pad student-dashboard-grid" aria-labelledby="student-next-title">
      <div class="academy-section-title academy-section-title--left">
        <span class="eyebrow">Continuer</span>
        <h2 id="student-next-title">Reprendre vos formations pilotes.</h2>
        <p>Chaque carte utilise des données temporaires pour préparer l’expérience d’apprentissage réelle.</p>
      </div>
      <div class="student-course-mini-list">
        ${courses
          .map(
            (course) => `
              <article class="student-course-row">
                <div>
                  <span>${escapeHtml(course.category)}</span>
                  <h3>${escapeHtml(course.title)}</h3>
                  <p>${escapeHtml(course.lastActivity)} · Leçon actuelle : ${escapeHtml(course.currentLesson)}</p>
                  ${renderProgressBar(course.progress, `Progression de ${course.title}`)}
                </div>
                <a href="../my-courses/${escapeHtml(course.slug)}/" class="btn secondary academy-cta academy-cta--light">Continuer</a>
              </article>
            `
          )
          .join('')}
      </div>
    </section>

    <section class="section-pad student-dashboard-grid" aria-labelledby="student-payments-title">
      <div class="academy-section-title academy-section-title--left">
        <span class="eyebrow">Paiements</span>
        <h2 id="student-payments-title">Historique mock récent.</h2>
        <p>Ces lignes préparent les futures écritures PostgreSQL/Prisma et les webhooks des providers de paiement.</p>
      </div>
      <div class="student-course-mini-list">
        ${payments.length > 0
          ? payments
              .map(
                (payment) => `
                  <article class="student-course-row">
                    <div>
                      <span>${escapeHtml(payment.status === 'paid' ? 'Payé' : 'Annulé')}</span>
                      <h3>${escapeHtml(payment.courseTitle)}</h3>
                      <p>${escapeHtml(payment.id)} · ${escapeHtml(payment.amountLabel)} · ${escapeHtml(payment.provider)}</p>
                    </div>
                    <a href="../my-courses/${escapeHtml(payment.courseSlug)}/" class="btn secondary academy-cta academy-cta--light">Cours</a>
                  </article>
                `
              )
              .join('')
          : '<article class="student-course-row"><div><span>Aucun paiement</span><h3>Historique vide pour cette session.</h3><p>Un paiement mock réussi apparaîtra ici automatiquement.</p></div><a href="../courses/" class="btn secondary academy-cta academy-cta--light">Catalogue</a></article>'}
      </div>
    </section>

  `;
}

if (authUser) {
  updateAcademyAuthNavigation({ loginHref: '../login/', registerHref: '../register/', dashboardHref: './', myCoursesHref: '../my-courses/', logoutRedirectHref: '../login/' });
  renderDashboard();
  initAcademyNavigation();
}
