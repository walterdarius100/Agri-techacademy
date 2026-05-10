import { courses } from './courses.js';

/**
 * Données temporaires de l’espace étudiant.
 * Elles simulent l’accès, la progression et les contenus pédagogiques en attendant
 * une future connexion à l’authentification, au paiement et à une base de données.
 */
export const simulatedStudent = {
  name: 'Mika',
  role: 'Étudiant pilote',
  cohort: 'Cohorte test · Académie Agri-Tech',
  enrolledCourseSlugs: ['cuniculture', 'apiculture']
};

const ENROLLMENTS_STORAGE_KEY = 'agritech.academy.enrollments.v1';
const PAYMENTS_STORAGE_KEY = 'agritech.academy.payments.v1';

export const studentCourses = [
  {
    slug: 'cuniculture',
    progress: 62,
    currentLesson: 'Alimentation et abreuvement',
    nextLesson: 'Reproduction et conduite du troupeau',
    lastActivity: 'Dernière activité : il y a 2 jours',
    access: true,
    resources: [
      { title: 'Fiche budget cunicole', type: 'PDF', href: '#' },
      { title: 'Checklist hygiène du clapier', type: 'PDF', href: '#' }
    ],
    modules: [
      {
        title: 'Démarrer son projet cunicole',
        lessons: [
          { title: 'Vision du parcours et objectifs', duration: '12 min', completed: true },
          { title: 'Choisir son modèle d’élevage', duration: '18 min', completed: true }
        ]
      },
      {
        title: 'Installer un élevage sain',
        lessons: [
          { title: 'Logement, ventilation et densité', duration: '22 min', completed: true },
          { title: 'Alimentation et abreuvement', duration: '20 min', completed: false, current: true }
        ]
      },
      {
        title: 'Piloter la reproduction',
        lessons: [
          { title: 'Suivi des reproducteurs', duration: '19 min', completed: false },
          { title: 'Mise bas, sevrage et registres', duration: '24 min', completed: false }
        ]
      }
    ]
  },
  {
    slug: 'apiculture',
    progress: 34,
    currentLesson: 'Matériel et installation du rucher',
    nextLesson: 'Conduite des colonies',
    lastActivity: 'Dernière activité : hier',
    access: true,
    resources: [
      { title: 'Guide sécurité au rucher', type: 'PDF', href: '#' },
      { title: 'Modèle de registre de visite', type: 'PDF', href: '#' }
    ],
    modules: [
      {
        title: 'Comprendre la ruche',
        lessons: [
          { title: 'Rôles des abeilles et cycle de la colonie', duration: '16 min', completed: true },
          { title: 'Calendrier apicole local', duration: '14 min', completed: true }
        ]
      },
      {
        title: 'Installer et sécuriser le rucher',
        lessons: [
          { title: 'Matériel et installation du rucher', duration: '21 min', completed: false, current: true },
          { title: 'Première visite guidée', duration: '23 min', completed: false }
        ]
      },
      {
        title: 'Préparer la récolte',
        lessons: [
          { title: 'Qualité du miel et conditionnement', duration: '18 min', completed: false },
          { title: 'Commercialisation simple', duration: '20 min', completed: false }
        ]
      }
    ]
  },
  {
    slug: 'aviculture',
    progress: 0,
    currentLesson: 'Choisir son modèle avicole',
    nextLesson: 'Bâtiment, litière et ambiance',
    lastActivity: 'Accès non activé',
    access: false,
    resources: [
      { title: 'Plan de suivi avicole', type: 'PDF', href: '#' }
    ],
    modules: [
      {
        title: 'Préparer son atelier avicole',
        lessons: [
          { title: 'Choisir son modèle avicole', duration: '15 min', completed: false },
          { title: 'Bâtiment, litière et ambiance', duration: '24 min', completed: false }
        ]
      }
    ]
  }
];

export function getStudentCourseBySlug(slug) {
  const course = courses.find((item) => item.slug === slug);
  const learning = studentCourses.find((item) => item.slug === slug);

  if (!course || !learning) return null;

  return {
    ...course,
    ...learning,
    publicCourse: course
  };
}

function readMockStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getMockEnrollmentSlugs() {
  return readMockStorage(ENROLLMENTS_STORAGE_KEY, [])
    .filter((item) => item?.status === 'active' && item?.courseSlug)
    .map((item) => item.courseSlug);
}

export function getMockPaymentHistory() {
  return readMockStorage(PAYMENTS_STORAGE_KEY, []);
}

export function getAccessibleStudentCourses(user = simulatedStudent) {
  const enrolledCourseSlugs = [...new Set([...(user?.enrolledCourseSlugs ?? []), ...getMockEnrollmentSlugs()])];

  return studentCourses
    .filter((item) => (item.access || enrolledCourseSlugs.includes(item.slug)) && enrolledCourseSlugs.includes(item.slug))
    .map((item) => getStudentCourseBySlug(item.slug))
    .filter(Boolean);
}

export function canAccessCourse(slug, user = simulatedStudent) {
  const learning = studentCourses.find((item) => item.slug === slug);
  const enrolledCourseSlugs = user?.enrolledCourseSlugs ?? [];
  const mockEnrollmentSlugs = getMockEnrollmentSlugs();
  return Boolean((learning?.access || mockEnrollmentSlugs.includes(slug)) && [...enrolledCourseSlugs, ...mockEnrollmentSlugs].includes(slug));
}

export function getOverallProgress(user = simulatedStudent) {
  const accessibleCourses = getAccessibleStudentCourses(user);

  if (accessibleCourses.length === 0) return 0;

  const total = accessibleCourses.reduce((sum, course) => sum + course.progress, 0);
  return Math.round(total / accessibleCourses.length);
}
