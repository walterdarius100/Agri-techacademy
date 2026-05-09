# Agri-Tech — Version finale prête pour GitHub

## Fichiers

- `index.html`
- `styles.css`
- `script.js`
- `assets/images/`
- `EMAILJS_GUIDE.md`
- `GUIDE_PHOTOS.md`
- `CHECKLIST.md`

## Points corrigés

- HTML, CSS et JavaScript séparés
- Images locales dans `assets/images`
- EmailJS intégré proprement
- Google Sheets endpoint intégré
- Validation email
- Anti-spam simple via champ caché
- Carousel formations dynamique
- Carousel témoignages
- Menu mobile
- Tests console intégrés
- Protection contre injection HTML dans les éléments dynamiques

## À faire avant mise en ligne finale

Dans `script.js`, configure EmailJS :

```js
publicKey: 'VOTRE_PUBLIC_KEY',
serviceId: 'VOTRE_SERVICE_ID',
templateId: 'VOTRE_TEMPLATE_ID',
```

Remplace aussi :
- `+509 XXXX XXXX`
- `contact@agritech.ht`
- les liens réseaux sociaux `href="#"`
- les images placeholder dans `assets/images/`

## Important

Le Google Sheets endpoint est déjà placé dans `script.js`.
Mais si EmailJS n’est pas configuré, le formulaire affichera un message d’erreur propre.

## Fondation Académie Agri-Tech

Une première route statique `/academy/` a été ajoutée sans modifier la page d’accueil existante.

Architecture préparée pour les prochaines étapes :

- `academy/` : route publique actuelle de l’académie.
- `components/academy/` : composants réutilisables de présentation.
- `data/` : données temporaires des formations.
- `lib/` : helpers partagés sans dépendance.
- `types/` : contrats JSDoc des modèles de l’académie.
- `app/academy/` : emplacement réservé à une future migration Next.js App Router.
