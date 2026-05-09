/**
 * Données temporaires de l’académie.
 * À terme, ce module pourra être remplacé par une source CMS, une base de données
 * ou un fetch côté serveur Next.js sans modifier les composants de présentation.
 *
 * @type {import('../types/academy.js').AcademyCourse[]}
 */
export const upcomingCourses = [
  {
    title: 'Démarrer un projet agricole rentable',
    category: 'Entrepreneuriat agricole',
    duration: '4 semaines',
    level: 'Débutant',
    status: 'Bientôt disponible',
    description: 'Apprenez à valider une idée, structurer un budget et planifier les premières actions terrain.',
    outcomes: ['Diagnostic de projet', 'Budget initial', 'Plan d’action simple']
  },
  {
    title: 'Élevage moderne de poulets de chair',
    category: 'Élevage',
    duration: '3 semaines',
    level: 'Pratique',
    status: 'Préinscription',
    description: 'Une base claire pour organiser le logement, l’alimentation, la biosécurité et le suivi technique.',
    outcomes: ['Cycle de production', 'Gestion sanitaire', 'Suivi des performances']
  },
  {
    title: 'Pisciculture adaptée au contexte local',
    category: 'Aquaculture',
    duration: '5 modules',
    level: 'Intermédiaire',
    status: 'En préparation',
    description: 'Comprenez les fondamentaux d’un bassin productif et les décisions clés avant d’investir.',
    outcomes: ['Choix du site', 'Gestion de l’eau', 'Plan de production']
  }
];
