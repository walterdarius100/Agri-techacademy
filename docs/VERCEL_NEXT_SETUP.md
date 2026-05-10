# Vercel + Next.js setup

## Détection Next.js

Le projet est désormais détectable par Vercel comme application Next.js grâce à :

- `next`, `react` et `react-dom` dans `dependencies` ;
- les scripts `dev`, `build` et `start` ;
- `next.config.mjs` ;
- le dossier `app/` avec des routes Next.js.

## Configuration Vercel attendue

- Framework Preset : **Next.js**.
- Build Command : `npm run build`.
- Install Command : `npm install`.
- Output Directory : laisser vide, Vercel utilise `.next`.

## Variables Vercel

Minimum pour cette branche :

```env
PAYMENT_PROVIDER=mock
EMAIL_PROVIDER=mock
NEXT_PUBLIC_APP_URL=https://votre-preview-ou-domaine
```

Les variables Stripe, PayPal, MonCash et Resend restent des placeholders tant que le provider réel n’est pas branché.

## Routes à vérifier en preview

- `/academy`
- `/academy/courses`
- `/academy/checkout/cuniculture`
- `/academy/payment/success`
- `/academy/payment/cancel`
- `/academy/my-courses`

## Rappels

- Ne pas utiliser `localhost` dans les URLs publiques ou les redirects.
- Ne pas convertir la plateforme en site statique hybride cassé : Vercel doit exécuter `next build`.
- Ne pas redessiner l’Academy pour corriger un problème de déploiement.
