import { updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { CourseCTA } from '../../components/academy/CourseCTA.js';
import { CourseDetailHero } from '../../components/academy/CourseDetailHero.js';
import { CourseModuleList } from '../../components/academy/CourseModuleList.js';
import { SectionTitle } from '../../components/academy/SectionTitle.js';
import { getCourseBySlug } from '../../data/courses.js';
import { escapeHtml } from '../../lib/html.js';

const detailRoot = document.querySelector('#courseDetailRoot');
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

function renderList(items, label) {
  return `
    <ul class="academy-check-list" aria-label="${escapeHtml(label)}">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
    </ul>
  `;
}

function renderCourseDetailPage() {
  if (!detailRoot) return;

  if (!course) {
    detailRoot.innerHTML = `
      <section class="section-pad academy-not-found" aria-labelledby="course-not-found-title">
        <span class="eyebrow">Formation introuvable</span>
        <h1 id="course-not-found-title">Cette formation n’est pas disponible.</h1>
        <p>Retournez au catalogue pour consulter les parcours actuellement préparés.</p>
        <a href="../" class="btn primary academy-cta">Voir les formations</a>
      </section>
    `;
    return;
  }

  document.title = `${course.title} | Académie Agri-Tech`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', course.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${course.title} | Académie Agri-Tech`);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', course.description);

  detailRoot.innerHTML = `
    ${CourseDetailHero(course)}

    <section class="section-pad academy-course-detail-grid" aria-label="Détails de la formation">
      <article class="academy-detail-panel" aria-labelledby="objectives-title">
        ${SectionTitle({
          eyebrow: 'Objectifs',
          title: 'Ce que vous saurez faire à la fin du parcours.',
          description: 'La formation reste orientée action : chaque objectif prépare une décision concrète sur le terrain.',
          align: 'left',
          id: 'objectives-title'
        })}
        ${renderList(course.objectives, `Objectifs de ${course.title}`)}
      </article>

      <aside class="academy-detail-panel academy-detail-panel--compact" aria-labelledby="audience-title">
        <span class="eyebrow">Public cible</span>
        <h2 id="audience-title">À qui s’adresse cette formation&nbsp;?</h2>
        ${renderList(course.targetAudience, `Public cible de ${course.title}`)}
        <div class="academy-duration-card">
          <span>Durée indicative</span>
          <strong>${escapeHtml(course.duration)}</strong>
        </div>
      </aside>
    </section>

    <section class="section-pad academy-program" aria-labelledby="program-title">
      ${SectionTitle({
        eyebrow: 'Programme',
        title: 'Un parcours découpé en modules progressifs.',
        description: 'Les modules ci-dessous sont des contenus temporaires destinés à structurer la future expérience d’apprentissage.',
        id: 'program-title'
      })}
      ${CourseModuleList(course.modules)}
    </section>

    ${CourseCTA(course)}
  `;
}

renderCourseDetailPage();
updateAcademyAuthNavigation({ loginHref: '../../login/', registerHref: '../../register/', dashboardHref: '../../dashboard/', myCoursesHref: '../../my-courses/', logoutRedirectHref: '../../login/' });
initAcademyNavigation();
