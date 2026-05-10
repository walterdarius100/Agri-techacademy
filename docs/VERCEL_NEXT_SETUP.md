# Configuration Vercel / Next.js

## Cause de l’erreur

Vercel affichait :

- `Warning: Could not identify Next.js version`
- `Error: No Next.js version detected`

Cette erreur apparaît lorsque Vercel ne lit pas un `package.json` contenant `next` dans le dossier utilisé comme **Root Directory**, ou lorsque la branche déployée ne contient pas encore les dépendances Next.js attendues.

Dans ce repo, `package.json` est à la racine du dépôt. Vercel doit donc utiliser la racine du repo comme **Root Directory**. Il ne faut pas pointer Vercel vers `academy/`, `app/`, `public/` ou un autre sous-dossier, car ces dossiers ne contiennent pas le `package.json` principal.

## Fichiers corrigés

- `package.json`
  - ajoute `next`, `react`, `react-dom` dans `dependencies` ;
  - ajoute `typescript`, `@types/react`, `@types/react-dom`, `@types/node` dans `devDependencies` ;
  - expose les scripts standards `dev`, `build`, `start` ;
  - conserve les scripts Prisma pour les étapes futures.
- `next.config.mjs`
  - configuration Next.js minimale.
- `tsconfig.json` et `next-env.d.ts`
  - configuration TypeScript/App Router minimale.
- `app/layout.tsx`
  - layout racine minimal avec les styles existants du site public.
- `app/page.tsx`
  - page d’accueil Next.js qui réutilise le HTML statique existant sans redessiner le site.
- `app/[...path]/route.ts`
  - route handler qui sert les fichiers statiques existants (`academy/**`, `assets/**`, `components/**`, `data/**`, `lib/**`) pendant la migration progressive.
- `vercel.json`
  - verrouille les commandes attendues côté Vercel (`npm install`, `npm run build`, `npm run dev`) sans définir d’Output Directory.

## Configuration Vercel attendue

Dans les réglages du projet Vercel :

- **Framework Preset** : `Next.js`
- **Root Directory** : racine du repo, c’est-à-dire le dossier qui contient `package.json`
- **Install Command** : `npm install` ou valeur par défaut Vercel
- **Build Command** : `npm run build`
- **Output Directory** : laisser vide pour Next.js
- `vercel.json` dans le repo confirme les commandes `installCommand`, `buildCommand` et `devCommand` sans définir de sortie personnalisée.

Ne pas configurer `Output Directory` sur `public`, `academy`, `.next` ou un autre dossier. Next.js et Vercel gèrent la sortie automatiquement.

## Comment redéployer

1. Vérifier que Vercel pointe vers la racine du repo.
2. Vérifier que la branche déployée contient le `package.json` avec `next` dans `dependencies`.
3. Lancer un nouveau déploiement Vercel avec cache désactivé si l’ancien build a gardé une mauvaise configuration.
4. Confirmer dans les logs que Vercel exécute `npm install`, puis `npm run build`.

## Vérifications après déploiement

- La racine `/` affiche toujours le site Agri-Tech existant.
- `/academy/` affiche toujours l’Academy statique validée.
- `/academy/courses/`, `/academy/login/`, `/academy/register/`, `/academy/dashboard/` et `/academy/my-courses/` restent visuellement stables.
- Aucun `Output Directory` personnalisé n’est requis.
- Aucun paiement réel n’est déclenché : le checkout reste mock/local.

## Migration progressive restante

Le projet est maintenant une base Next.js minimale, mais plusieurs pages restent servies depuis les fichiers statiques historiques :

- `index.html`, `script.js`, `styles.css` pour le site public ;
- `academy/**/*.html`, `academy/**/*.js`, `academy/academy.css` pour l’Academy ;
- `components/academy/*.js`, `data/*.js`, `lib/*.js` pour les modules statiques partagés.

Ces pages devront être migrées une par une vers `app/.../page.tsx`, sans refonte globale ni modification non demandée de la navbar, du footer, du hero ou des cartes de formations.
