# Agri-Tech Academy — Flow paiement et accès cours

## Objectif

Ce flow ajoute le checkout, la confirmation de paiement, la création d’accès cours, l’historique des paiements et l’email de confirmation sans redessiner les pages publiques `/academy`, `/academy/courses`, la navbar, le footer ou l’espace étudiant existants.

## Flow utilisateur

1. L’utilisateur consulte une page formation publique, par exemple `/academy/courses/cuniculture/`.
2. Le CTA `Acheter / s’inscrire` ouvre `/academy/checkout/cuniculture/`.
3. Si l’utilisateur n’est pas connecté, `requireAuth` redirige vers `/academy/login/` avec un paramètre `redirect` pointant vers le checkout.
4. Après connexion ou inscription mock, l’utilisateur revient vers le checkout demandé.
5. Le checkout affiche le résumé de formation, le prix, les bénéfices inclus, l’accès après paiement et le provider actif.
6. Le bouton `Payer maintenant` lance le provider mock par défaut.
7. Après validation mock :
   - un paiement `paid` est enregistré dans le stockage local de développement ;
   - le slug de la formation est ajouté dans `enrolledCourseSlugs` de l’utilisateur ;
   - l’accès à `/academy/my-courses/[courseSlug]/` devient disponible ;
   - un email de confirmation mock est journalisé ;
   - l’utilisateur est redirigé vers `/academy/payment/success/`.
8. Si l’utilisateur annule, il arrive sur `/academy/payment/cancel/` avec un message propre et un lien pour réessayer.

## Paiement mock

Le provider mock vit dans `lib/payments/` et confirme uniquement une transaction locale de développement. Il génère une référence unique, retourne le statut `paid`, puis laisse la couche de confirmation créer le paiement et l’inscription.

Ce mock permet aux builds Vercel et aux previews de passer sans clés PayPal, MonCash ou Stripe. Il ne fait aucun appel réseau et n’est pas appelé au build.

## Future intégration PayPal / MonCash / Stripe

La couche `lib/payments/` est prévue pour devenir un point d’entrée unique :

- `PAYMENT_PROVIDER=paypal` : création d’ordre côté serveur, capture via API route, vérification webhook PayPal.
- `PAYMENT_PROVIDER=moncash` : création de transaction côté serveur, validation via webhook ou endpoint de retour MonCash.
- `PAYMENT_PROVIDER=stripe` : création de Checkout Session côté serveur, validation via webhook Stripe.

Règles obligatoires pour ces intégrations futures :

- garder `PAYPAL_CLIENT_SECRET`, `MONCASH_CLIENT_SECRET`, `STRIPE_SECRET_KEY` et webhooks uniquement côté serveur ;
- ne jamais exposer une clé secrète dans un fichier JS navigateur ;
- ne jamais appeler un provider au build ;
- valider les webhooks avant de créer `Payment` et `Enrollment` ;
- préférer les routes relatives de retour (`/academy/payment/success`, `/academy/payment/cancel`).

## Création Enrollment

Le schéma Prisma contient déjà `User`, `Course`, `Enrollment`, `Payment` et `Progress`. Aucun doublon de modèle n’a été ajouté.

En production Next.js, la confirmation provider devra faire une transaction DB :

1. retrouver `User` via Clerk ;
2. retrouver `Course` via `courseSlug` ;
3. créer ou mettre à jour `Payment` avec `status=PAID` ;
4. créer `Enrollment` unique sur `(userId, courseId)` avec `status=ACTIVE` ;
5. renvoyer l’utilisateur vers `/academy/payment/success`.

Dans la version statique actuelle, cette logique est simulée via `localStorage` pour valider l’expérience utilisateur sans serveur.

## Historique paiement

Deux surfaces affichent l’historique :

- section courte dans `/academy/dashboard/` ;
- page dédiée `/academy/payments/history/`.

Chaque ligne affiche : formation achetée, montant, statut, date et lien vers le cours.

## Email de confirmation

La couche `lib/email/` prépare un provider mock/log :

- génération d’un sujet et d’un corps texte ;
- journalisation locale et `console.info` en développement ;
- aucun email réel envoyé sans provider configuré.

Une intégration future Resend devra rester côté serveur et utiliser `EMAIL_PROVIDER=resend` avec `RESEND_API_KEY` dans les variables Vercel.

## Variables Vercel nécessaires

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
PAYMENT_PROVIDER=mock
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
MONCASH_CLIENT_ID=
MONCASH_CLIENT_SECRET=
MONCASH_MODE=sandbox
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EMAIL_PROVIDER=mock
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

`NEXT_PUBLIC_APP_URL` ne doit servir que lorsqu’une URL absolue est strictement requise par un provider. Les redirections internes doivent rester relatives.

## Erreurs connues à éviter

- Ne pas rediriger vers `localhost` en production ou preview.
- Ne pas refaire le design global de `/academy` ou `/academy/courses`.
- Ne pas remplacer la navbar ou le footer globaux.
- Ne pas appeler la DB ou un provider paiement au build.
- Ne pas exposer les clés secrètes côté client.
- Ne pas créer de modèles Prisma en doublon si `User`, `Course`, `Enrollment`, `Payment` ou `Progress` existent déjà.
