# Troubleshooting Vercel Preview — Agri-Tech Academy

Ce document résume les points de build vérifiés et les corrections appliquées pour stabiliser le déploiement Vercel du PR de paiement.

## Cause probable

Le projet était historiquement servi comme site statique HTML. L’ajout de Next.js, Prisma et des routes App Router a changé le mode de déploiement Vercel vers une application Next.js.

Les causes probables du preview cassé étaient :

1. **Prisma Client non généré ou généré sans `DATABASE_URL`** pendant l’installation/build Vercel.
2. **Routes Next.js sans page racine App Router**, ce qui pouvait donner un preview vide ou une 404 à la racine même si le build passait.
3. **Accès base de données trop strict pour les pages de preview**, notamment le checkout qui lisait les formations via Prisma alors qu’une Preview Vercel peut ne pas encore avoir de base connectée.
4. **Commandes Vercel implicites** potentiellement différentes des scripts attendus du projet.
5. **Postinstall automatique de `@prisma/client`** pouvant se lancer avant notre fallback `DATABASE_URL`; Vercel force maintenant `PRISMA_SKIP_POSTINSTALL_GENERATE=true` pendant `npm install`, puis le projet lance sa génération safe.

## Erreurs / risques vérifiés

- TypeScript : les routes ajoutées restent côté serveur et ne mélangent pas de code client avec Prisma.
- Prisma Client : génération obligatoire avant `next build`.
- `DATABASE_URL` : fallback uniquement pour `prisma generate` / `prisma validate`, jamais comme vraie connexion runtime.
- Clerk : aucune clé Clerk n’est requise au build par le code actuel.
- Paiement : les clés PayPal, MonCash et Stripe ne sont lues que lorsque le provider réel est activé côté serveur.
- Build-time DB calls : les pages publiques de preview utilisent des données statiques; le checkout peut revenir aux données statiques si aucune base n’est configurée.
- Edge runtime : les routes qui utilisent Prisma sont forcées en runtime Node.js.
- Vercel : `vercel.json` fixe explicitement le framework Next.js, désactive l’auto-génération Prisma du postinstall package, puis utilise la commande `npm run build`.

## Fixes appliqués

### 1. Génération Prisma safe

`scripts/prisma-generate-safe.js` injecte une URL PostgreSQL factice uniquement si `DATABASE_URL` est absente, afin que Prisma puisse générer/valider le client pendant le build.

Cette URL ne doit pas être utilisée comme base réelle. Elle sert seulement à satisfaire la validation du schéma Prisma pendant la génération.

### 2. Scripts package.json stabilisés

- `postinstall` génère Prisma Client après installation avec notre wrapper safe.
- `vercel.json` utilise `PRISMA_SKIP_POSTINSTALL_GENERATE=true npm install` pour éviter que le postinstall interne de `@prisma/client` échoue avant notre fallback.
- `build` regénère Prisma Client puis lance `next build`.
- `prisma:generate` et `prisma:validate` passent par le wrapper safe.
- `prisma` et `typescript` sont dans `dependencies` pour rester disponibles dans les environnements de build stricts.

### 3. Preview App Router restaurée

- `/` redirige vers `/academy`.
- `/academy` affiche une page preview Next.js légère.
- `/academy/courses` affiche une liste de formations et des liens vers le checkout.

### 4. Checkout safe sans base en Preview

`lib/payments/courses.ts` utilise Prisma lorsque `DATABASE_URL` est disponible. Sans base configurée, il retourne les formations statiques existantes afin que les pages puissent s’afficher en Preview.

Si une Preview Vercel n’a pas encore de `DATABASE_URL`, le démarrage du paiement est également mocké côté serveur et redirige vers la page succès sans créer de `Payment`/`Enrollment`. Dès qu’une vraie `DATABASE_URL` est configurée, le flux Prisma normal reprend.

## Variables requises pour production

### Base de données

```env
DATABASE_URL=
```

Obligatoire pour les vrais paiements, inscriptions, progressions et données Academy persistées.

### Clerk

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Obligatoire avant d’activer l’authentification réelle en production.

### Paiements

Pour une Preview sans fournisseur réel :

```env
PAYMENT_PROVIDER=dev-simulated
NEXT_PUBLIC_APP_URL=https://votre-preview.vercel.app
```

Pour PayPal :

```env
PAYMENT_PROVIDER=paypal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
```

Pour MonCash :

```env
PAYMENT_PROVIDER=moncash
MONCASH_CLIENT_ID=
MONCASH_CLIENT_SECRET=
MONCASH_MODE=sandbox
```

Pour Stripe plus tard :

```env
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Commandes de vérification

```bash
npm install
npm run prisma:generate
npm run build
npm run lint
```

Note : `npm run lint` lance actuellement `tsc --noEmit --pretty false` afin de bloquer les erreurs TypeScript en attendant une configuration ESLint complète.

## Diagnostic npm 403 sur `@prisma/client`

Erreur observée dans l’environnement Codex :

```text
npm ERR! 403 Forbidden - GET https://registry.npmjs.org/@prisma%2fclient
```

Vérifications effectuées :

- Aucun `.npmrc` projet ou utilisateur n’était présent avant correction.
- `npm config get registry` retournait déjà `https://registry.npmjs.org/`.
- Le projet n’a pas de `package-lock.json` généré, car `npm install` n’a pas pu aboutir dans l’environnement bloqué.
- `@prisma/client` n’est pas une dépendance privée et le scope `@prisma` doit être résolu depuis le registry public npm.
- Le 403 local vient de la configuration réseau/proxy injectée dans l’environnement Codex (`http-proxy` / `https-proxy` vers `http://proxy:8080`). Quand ces variables proxy sont retirées, l’accès échoue avec `EAI_AGAIN`, ce qui confirme un blocage réseau externe plutôt qu’un problème de package privé.

Corrections appliquées :

1. Ajout d’un `.npmrc` projet pour forcer explicitement le registry public :

   ```ini
   registry=https://registry.npmjs.org/
   @prisma:registry=https://registry.npmjs.org/
   strict-ssl=true
   fund=false
   audit=false
   ```

2. Alignement strict des versions Prisma :

   ```json
   "@prisma/client": "6.0.0",
   "prisma": "6.0.0"
   ```

Commandes à relancer dans un environnement avec accès npm public :

```bash
npm install
npx prisma generate
npm run build
npm run check
```

Si `npm install` échoue encore avec un 403 malgré `.npmrc`, vérifier les variables d’environnement CI suivantes et les supprimer/corriger si elles pointent vers un proxy ou registry privé :

```bash
npm config get registry
env | grep -i proxy
env | grep -i npm_config
```
