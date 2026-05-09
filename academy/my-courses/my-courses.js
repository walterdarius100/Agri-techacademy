import { escapeHtml } from '../../lib/html.js';
import { getAccessibleStudentCourses, simulatedStudent } from '../../data/student-academy.js';

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

function renderMyCourses() {
  if (!myCoursesRoot) return;

  const courses = getAccessibleStudentCourses();

  myCoursesRoot.innerHTML = `
    <section class="academy-list-hero student-list-hero section-pad" aria-labelledby="my-courses-title">
      <span class="eyebrow">${escapeHtml(simulatedStudent.role)}</span>
      <h1 id="my-courses-title">Mes formations accessibles.</h1>
      <p>Cette page simule les cours inscrits, leur progression et les liens de reprise. Aucun paiement, login ou stockage réel n’est encore activé.</p>
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
  `;
}

renderMyCourses();
initAcademyNavigation();
