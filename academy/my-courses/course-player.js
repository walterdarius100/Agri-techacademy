import { requireAuth, updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { escapeHtml } from '../../lib/html.js';
import { canAccessCourse, getStudentCourseBySlug } from '../../data/student-academy.js';

const authUser = requireAuth({ loginPath: '../../login/' });
const coursePlayerRoot = document.querySelector('#coursePlayerRoot');
const slug = window.location.pathname.split('/').filter(Boolean).at(-1);
const course = getStudentCourseBySlug(slug);

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

function renderAccessDenied() {
  coursePlayerRoot.innerHTML = `
    <section class="section-pad student-access-denied" aria-labelledby="access-denied-title">
      <span class="eyebrow">Accès réservé</span>
      <h1 id="access-denied-title">Vous devez être inscrit à cette formation pour accéder au contenu.</h1>
      <p>Cette vérification est temporaire et simule le futur contrôle lié au compte étudiant, au paiement et aux inscriptions.</p>
      <div class="hero-actions academy-hero__actions">
        <a href="../" class="btn primary academy-cta">Retour à mes formations</a>
        <a href="../../courses/" class="btn secondary academy-cta academy-cta--light">Voir les formations publiques</a>
      </div>
    </section>
  `;
}

function renderLessons(modules) {
  return modules
    .map(
      (module, moduleIndex) => `
        <article class="student-module-card">
          <div class="student-module-card__header">
            <span>${String(moduleIndex + 1).padStart(2, '0')}</span>
            <h3>${escapeHtml(module.title)}</h3>
          </div>
          <ul class="student-lesson-list">
            ${module.lessons
              .map(
                (lesson) => `
                  <li class="${lesson.current ? 'is-current' : ''}">
                    <span aria-hidden="true">${lesson.completed ? '✓' : lesson.current ? '▶' : '○'}</span>
                    <div>
                      <strong>${escapeHtml(lesson.title)}</strong>
                      <small>${escapeHtml(lesson.duration)}${lesson.completed ? ' · terminé' : lesson.current ? ' · en cours' : ''}</small>
                    </div>
                  </li>
                `
              )
              .join('')}
          </ul>
        </article>
      `
    )
    .join('');
}

function renderResources(resources) {
  return resources
    .map(
      (resource) => `
        <a class="student-resource-link" href="${escapeHtml(resource.href)}" aria-label="Ressource temporaire ${escapeHtml(resource.title)}">
          <span>${escapeHtml(resource.type)}</span>
          <strong>${escapeHtml(resource.title)}</strong>
          <small>Téléchargement placeholder</small>
        </a>
      `
    )
    .join('');
}

function renderCoursePlayer() {
  if (!coursePlayerRoot) return;

  if (!course || !canAccessCourse(slug, authUser)) {
    renderAccessDenied();
    return;
  }

  document.title = `${course.title} · Espace étudiant | Académie Agri-Tech`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `Contenu étudiant temporaire pour ${course.title}.`);

  coursePlayerRoot.innerHTML = `
    <section class="student-player-hero section-pad" aria-labelledby="student-course-title">
      <div>
        <a class="academy-back-link" href="../">← Mes formations</a>
        <span class="eyebrow">${escapeHtml(course.category)}</span>
        <h1 id="student-course-title">${escapeHtml(course.title)}</h1>
        <p>${escapeHtml(course.description)}</p>
        <div class="student-progress-label student-progress-label--hero">
          <span>Progression du cours</span>
          <strong>${course.progress}%</strong>
        </div>
        ${renderProgressBar(course.progress, `Progression de ${course.title}`)}
      </div>
      <aside class="student-next-card">
        <span>Leçon actuelle</span>
        <strong>${escapeHtml(course.currentLesson)}</strong>
        <p>Prochaine étape : ${escapeHtml(course.nextLesson)}</p>
      </aside>
    </section>

    <section class="section-pad student-learning-layout" aria-label="Contenu du cours">
      <div class="student-video-panel">
        <div class="student-video-placeholder" role="img" aria-label="Lecteur vidéo placeholder">
          <span>▶</span>
          <strong>Lecteur vidéo placeholder</strong>
          <small>Les vidéos réelles seront connectées plus tard.</small>
        </div>
        <div class="student-video-actions">
          <button class="btn primary academy-cta" type="button">Leçon suivante</button>
          <span>Aucune sauvegarde réelle de progression pour le moment.</span>
        </div>
      </div>

      <aside class="student-sidebar">
        <section aria-labelledby="student-resources-title">
          <h2 id="student-resources-title">Ressources PDF</h2>
          <div class="student-resource-list">
            ${renderResources(course.resources)}
          </div>
        </section>
      </aside>
    </section>

    <section class="section-pad student-modules-section" aria-labelledby="student-modules-title">
      <div class="academy-section-title academy-section-title--left">
        <span class="eyebrow">Modules et leçons</span>
        <h2 id="student-modules-title">Parcours pédagogique simulé.</h2>
        <p>Cette structure prépare le futur suivi des leçons terminées, en cours et à venir.</p>
      </div>
      <div class="student-module-list">
        ${renderLessons(course.modules)}
      </div>
    </section>
  `;
}

if (authUser) {
  updateAcademyAuthNavigation({ loginHref: '../../login/', registerHref: '../../register/', dashboardHref: '../../dashboard/', myCoursesHref: '../', logoutRedirectHref: '../../login/' });
  renderCoursePlayer();
  initAcademyNavigation();
}
