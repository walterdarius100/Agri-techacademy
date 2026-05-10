# Base Next.js minimale pour Vercel

## Décision

Cette branche doit être détectable et buildable comme une application Next.js avant de poursuivre les chantiers paiement, Clerk et Prisma côté serveur.

Le projet reste encore majoritairement statique : les pages validées visuellement (`index.html`, `academy/**`, `styles.css`, `script.js`, `components/**`, `data/**`, `lib/**`, `assets/**`) ne sont pas migrées en composants React dans ce changement afin d’éviter une refonte involontaire du design.

## Stabilisation ajoutée

- `next`, `react` et `react-dom` sont déclarés comme dépendances applicatives.
- `typescript`, `@types/react` et `@types/node` sont déclarés pour permettre l’App Router et les futurs modules serveur.
- `next.config.mjs`, `tsconfig.json` et `next-env.d.ts` fournissent la configuration minimale attendue par Vercel.
- `app/[[...path]]/route.ts` sert les fichiers statiques existants depuis Next.js afin de préserver le rendu actuel pendant la migration progressive.
- Les scripts `dev`, `build`, `start`, `check` et Prisma restent disponibles dans `package.json`.

## Migration progressive recommandée

Migrer progressivement, page par page, sans modifier le design global validé :

1. Créer une vraie route React pour la page concernée dans `app/`.
2. Reprendre le HTML/CSS existant sans refonte visuelle.
3. Déplacer uniquement les données nécessaires vers des modules partagés.
4. Remplacer les scripts navigateur par des composants client ciblés lorsque c’est nécessaire.
5. Supprimer le fichier statique correspondant seulement lorsque la route Next.js est validée.

## Fichiers statiques encore à migrer

- `index.html`, `styles.css`, `script.js`
- `academy/index.html` et `academy/academy.css`
- `academy/courses/**`
- `academy/dashboard/**`
- `academy/my-courses/**`
- `academy/login/**`, `academy/register/**`, `academy/forgot-password/**`
- `academy/checkout/**`, `academy/payment/**`, `academy/payments/**`
- `components/academy/**`, `data/**`, `lib/**` utilisés par les scripts statiques

## Points à ne pas casser

- Ne pas redessiner `/academy`.
- Ne pas redessiner `/academy/courses`.
- Ne pas remplacer la navbar ou le footer.
- Ne pas appeler Prisma, un provider paiement ou un provider email au build.
- Ne pas exposer de clés secrètes côté client.
- Ne pas introduire de redirection vers `localhost` en production ou preview.
