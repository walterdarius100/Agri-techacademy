import { updateAcademyAuthNavigation } from '../../lib/academy-auth.js';
import { CourseList } from '../../components/academy/CourseList.js';
import { SectionTitle } from '../../components/academy/SectionTitle.js';
import { courses } from '../../data/courses.js';

const coursesRoot = document.querySelector('#coursesRoot');

function initAcademyNavigation() {
  const menuButton = document.querySelector('#academyMenuBtn');
  const navLinks = document.querySelector('#academyNavLinks');

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function renderCoursesPage() {
  if (!coursesRoot) return;

  coursesRoot.innerHTML = `
    <section class="academy-list-hero section-pad" aria-labelledby="courses-title">
      <span class="eyebrow">Formations publiques</span>
      <h1 id="courses-title">Choisissez un parcours pratique pour lancer votre projet agricole.</h1>
      <p>Les premières formations de l’Académie Agri-Tech sont structurées pour présenter clairement les objectifs, le programme, la durée et le public cible avant l’ajout futur du paiement et des espaces privés.</p>
      <div class="hero-actions academy-hero__actions">
        <a href="#courses-list" class="btn primary academy-cta">Voir les formations</a>
        <a href="../../#contact" class="btn secondary academy-cta academy-cta--light">Demander conseil</a>
      </div>
    </section>

    <section class="section-pad" id="courses-list" aria-labelledby="courses-list-title">
      ${SectionTitle({
        eyebrow: 'Catalogue pilote',
        title: 'Trois parcours prêts à évoluer vers l’inscription complète.',
        description: 'Chaque fiche détaille les objectifs, modules, publics ciblés et informations temporaires de disponibilité.',
        id: 'courses-list-title'
      })}
      ${CourseList(courses, { basePath: '.' })}
    </section>
  `;
}

renderCoursesPage();
updateAcademyAuthNavigation({ loginHref: '../login/', registerHref: '../register/', dashboardHref: '../dashboard/', myCoursesHref: '../my-courses/', logoutRedirectHref: '../login/' });
initAcademyNavigation();
