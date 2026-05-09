import { AcademyHero } from '../components/academy/AcademyHero.js';
import { CourseCard } from '../components/academy/CourseCard.js';
import { SectionTitle } from '../components/academy/SectionTitle.js';
import { upcomingCourses } from '../data/academy-courses.js';

/**
 * Point d’entrée de la route statique /academy.
 * Le rendu est segmenté par composants pour préparer une migration Next.js
 * sans impacter le site vitrine existant à la racine du projet.
 */
const academyRoot = document.querySelector('#academyRoot');

function renderAcademyPage() {
  if (!academyRoot) return;

  academyRoot.innerHTML = `
    ${AcademyHero({
      eyebrow: 'Académie Agri-Tech',
      title: 'Des formations pratiques pour transformer les idées agricoles en projets solides.',
      description: 'La future Académie Agri-Tech centralisera des parcours courts, concrets et adaptés au terrain pour accompagner producteurs, jeunes entrepreneurs et institutions.',
      ctaLabel: 'Découvrir les formations',
      ctaHref: '#formations'
    })}

    <section class="section-pad academy-intro" aria-labelledby="academy-intro-title">
      ${SectionTitle({
        eyebrow: 'Vision pédagogique',
        title: 'Une académie pensée pour apprendre, appliquer et progresser.',
        description: 'Cette première fondation pose une structure simple, performante et maintenable. Elle laisse le site actuel intact tout en préparant les futures briques e-learning.',
        align: 'left'
      })}
      <div class="academy-feature-grid">
        <article>
          <span>01</span>
          <h3>Contenus terrain</h3>
          <p>Des modules courts centrés sur les décisions pratiques : budget, organisation, suivi et rentabilité.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Parcours évolutifs</h3>
          <p>Une structure prête pour connecter plus tard l’authentification, les paiements et la progression étudiant.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Administration future</h3>
          <p>Des espaces dédiés sont réservés pour la gestion des cours, des inscriptions et du pilotage interne.</p>
        </article>
      </div>
    </section>

    <section class="section-pad" id="formations" aria-labelledby="formations-title">
      ${SectionTitle({
        eyebrow: 'Formations à venir',
        title: 'Premiers parcours en préparation.',
        description: 'Ces cartes sont temporaires et servent de base visuelle avant la connexion à une vraie source de données.'
      })}
      <div class="academy-course-grid">
        ${upcomingCourses.map((course) => CourseCard(course)).join('')}
      </div>
    </section>

    <section class="section-pad academy-roadmap" aria-labelledby="roadmap-title">
      <div>
        <span class="eyebrow">Prochaines étapes</span>
        <h2 id="roadmap-title">Une fondation prête pour les modules clés.</h2>
      </div>
      <div class="academy-roadmap__items">
        <span>Authentification</span>
        <span>Paiement</span>
        <span>Espace étudiant</span>
        <span>Dashboard admin</span>
        <span>Gestion des cours</span>
      </div>
    </section>
  `;
}

renderAcademyPage();


function initAcademyNavigation() {
  const menuButton = document.querySelector('#academyMenuBtn');
  const navLinks = document.querySelector('#academyNavLinks');

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

initAcademyNavigation();
