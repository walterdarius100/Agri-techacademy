/**
 * Données temporaires des formations publiques de l’Académie Agri-Tech.
 * Ce fichier reste volontairement sans dépendance afin d’être remplacé plus tard
 * par une API, un CMS ou une base de données sans changer les composants UI.
 *
 * @type {import('../types/academy.js').AcademyCourse[]}
 */
export const courses = [
  {
    slug: 'cuniculture',
    title: 'Formation pratique en cuniculture',
    category: 'Élevage de lapins',
    duration: '4 semaines · 8 modules',
    level: 'Débutant à intermédiaire',
    status: 'Disponible en paiement mock',
    price: '49 USD',
    priceCents: 4900,
    currency: 'USD',
    image: '../../../assets/images/formation-cuniculture.jpg',
    listImage: '../../assets/images/formation-cuniculture.jpg',
    description:
      'Un parcours concret pour apprendre à installer, organiser et rentabiliser un petit élevage de lapins avec des méthodes adaptées au terrain local.',
    objectives: [
      'Choisir un modèle d’élevage cohérent avec son budget et son espace disponible.',
      'Mettre en place un logement sain, ventilé et simple à entretenir.',
      'Comprendre l’alimentation, la reproduction, le sevrage et le suivi sanitaire.',
      'Construire un plan de production et estimer les charges principales avant de se lancer.'
    ],
    modules: [
      { title: 'Introduction au projet cunicole', description: 'Marché, opportunités, contraintes et profil d’un élevage rentable.' },
      { title: 'Logement et matériel', description: 'Clapiers, ventilation, hygiène, densité et organisation de l’espace.' },
      { title: 'Alimentation et abreuvement', description: 'Besoins nutritionnels, rationnement, eau propre et suivi des consommations.' },
      { title: 'Reproduction et conduite du troupeau', description: 'Choix des reproducteurs, saillie, gestation, mise bas et sevrage.' },
      { title: 'Santé et biosécurité', description: 'Prévention, observation quotidienne, isolement et bonnes pratiques sanitaires.' },
      { title: 'Rentabilité et plan d’action', description: 'Budget de démarrage, coûts récurrents, prix de vente et calendrier de production.' }
    ],
    targetAudience: [
      'Jeunes entrepreneurs agricoles',
      'Producteurs souhaitant diversifier leurs revenus',
      'Familles ou coopératives avec un petit espace d’élevage',
      'Institutions préparant des projets de formation terrain'
    ]
  },
  {
    slug: 'aviculture',
    title: 'Formation pratique en aviculture',
    category: 'Poulets de chair et pondeuses',
    duration: '5 semaines · 9 modules',
    level: 'Débutant à pratique',
    status: 'Disponible en paiement mock',
    price: '59 USD',
    priceCents: 5900,
    currency: 'USD',
    image: '../../../assets/images/formation-poulet.jpg',
    listImage: '../../assets/images/formation-poulet.jpg',
    description:
      'Une formation structurée pour lancer ou améliorer un élevage avicole : bâtiment, poussins, alimentation, biosécurité, suivi technique et commercialisation.',
    objectives: [
      'Comprendre les différences entre poulets de chair, pondeuses et petits ateliers mixtes.',
      'Préparer un bâtiment fonctionnel avec une gestion correcte de la chaleur, de l’air et de la lumière.',
      'Appliquer les bases de biosécurité, vaccination, observation et tenue de registres.',
      'Suivre les performances pour réduire les pertes et améliorer la rentabilité.'
    ],
    modules: [
      { title: 'Choisir son modèle avicole', description: 'Objectifs, races, cycles de production et capacité de démarrage.' },
      { title: 'Bâtiment, litière et ambiance', description: 'Orientation, ventilation, densité, chauffage, lumière et confort des oiseaux.' },
      { title: 'Démarrage des poussins', description: 'Réception, température, eau, aliment de démarrage et surveillance des premiers jours.' },
      { title: 'Nutrition et croissance', description: 'Phases alimentaires, stockage, conversion alimentaire et contrôle du gaspillage.' },
      { title: 'Biosécurité et santé', description: 'Plan sanitaire, vaccination, nettoyage, désinfection et prévention des maladies.' },
      { title: 'Gestion économique', description: 'Registres, coût de production, marge, débouchés et préparation de la vente.' }
    ],
    targetAudience: [
      'Éleveurs débutants',
      'Exploitations familiales',
      'Entrepreneurs qui veulent investir dans un atelier avicole',
      'Techniciens ou animateurs agricoles accompagnant des groupes'
    ]
  },
  {
    slug: 'apiculture',
    title: 'Formation pratique en apiculture',
    category: 'Production de miel',
    duration: '4 semaines · 7 modules',
    level: 'Débutant',
    status: 'Disponible en paiement mock',
    price: '39 USD',
    priceCents: 3900,
    currency: 'USD',
    image: '../../../assets/images/formation-apiculture.jpg',
    listImage: '../../assets/images/formation-apiculture.jpg',
    description:
      'Un parcours d’initiation pour comprendre la ruche, installer un rucher, protéger les colonies et préparer une production de miel propre et valorisable.',
    objectives: [
      'Identifier les éléments essentiels d’une colonie et les rôles des abeilles.',
      'Choisir un emplacement de rucher adapté, sécurisé et productif.',
      'Réaliser les visites de base en respectant la colonie et les règles de sécurité.',
      'Préparer la récolte, l’extraction, le conditionnement et la vente du miel.'
    ],
    modules: [
      { title: 'Bases de l’apiculture', description: 'Biologie de l’abeille, organisation de la colonie et calendrier apicole.' },
      { title: 'Matériel et installation du rucher', description: 'Ruches, protection, enfumoir, emplacement, accès à l’eau et sécurité.' },
      { title: 'Conduite des colonies', description: 'Visites, lecture des cadres, nourrissement, renouvellement et suivi de la reine.' },
      { title: 'Prévention des risques', description: 'Parasites, prédateurs, intoxications, hygiène et bonnes pratiques de manipulation.' },
      { title: 'Récolte et qualité du miel', description: 'Moment de récolte, extraction, filtration, stockage et conditionnement.' },
      { title: 'Commercialisation', description: 'Positionnement, calcul simple des coûts, formats de vente et relation client.' }
    ],
    targetAudience: [
      'Débutants souhaitant installer leurs premières ruches',
      'Agriculteurs voulant diversifier leur exploitation',
      'Associations ou coopératives rurales',
      'Porteurs de projet intéressés par le miel local'
    ]
  }
];

export function getCourseBySlug(slug) {
  return courses.find((course) => course.slug === slug);
}
