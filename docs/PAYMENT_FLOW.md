# Payment flow mock — Agri-Tech Academy

## Objectif

Cette branche met en place uniquement le flow paiement + accès cours :

1. L’étudiant consulte une formation depuis `/academy/courses/[courseSlug]`.
2. Le CTA envoie vers `/academy/checkout/[courseSlug]`.
3. Le checkout affiche le résumé du cours, le prix mock, les bénéfices inclus et le bouton **Payer maintenant**.
4. Le paiement mock redirige vers `/academy/payment/success` avec des paramètres de confirmation.
5. La page success enregistre localement un Enrollment simulé et un paiement mock.
6. `/academy/my-courses` lit ces données locales et affiche l’accès + l’historique paiements.
7. En cas d’annulation, `/academy/payment/cancel` propose de réessayer ou de revenir aux formations.

## Règles importantes respectées

- Aucun redesign global de l’Academy.
- Navbar et footer conservés dans le style existant.
- Aucun paiement réel.
- Aucun appel Stripe, PayPal, MonCash ou Resend pendant le build.
- Aucune clé sensible requise.
- Aucune URL `localhost` dans les redirections.
- Redirections internes utilisées :
  - `/academy/payment/success`
  - `/academy/payment/cancel`
  - `/academy/my-courses`
  - `/academy/dashboard`

## Provider mock

`PAYMENT_PROVIDER=mock` est la valeur par défaut. Le module `lib/payment/mock.js` prépare :

- le cours du checkout ;
- le montant affiché ;
- une référence `MOCK-*` ;
- l’URL relative de succès.

Le provider ne contacte aucun service externe. Il sert uniquement à stabiliser l’UX et à préparer le futur branchement vers Stripe, PayPal, MonCash ou un autre fournisseur.

## Enrollment simulé

Après succès, le composant client de la page success écrit dans `localStorage` :

- `agritech.academy.enrollments.v1` pour l’accès cours ;
- `agritech.academy.payments.v1` pour l’historique paiements.

Cette logique est volontairement légère pour éviter de complexifier Prisma maintenant. Le futur backend pourra remplacer ces écritures locales par :

- une table `Enrollment` ;
- une table `Payment` ;
- un webhook fournisseur ;
- une vérification Clerk côté serveur.

## Historique paiements

`/academy/my-courses` affiche une section simple avec :

- cours ;
- montant ;
- statut ;
- date ;
- référence.

L’historique est mocké localement et ne doit pas être considéré comme preuve de paiement réel.

## Email confirmation

Architecture préparée :

- `lib/email/index.js`
- `lib/email/providers/mock.js`
- `lib/email/templates/purchase-confirmation.js`

`EMAIL_PROVIDER=mock` ne déclenche aucun vrai email. Un vrai provider ne doit être activé que plus tard avec des variables serveur configurées.

## Variables attendues

```env
PAYMENT_PROVIDER=mock
NEXT_PUBLIC_APP_URL=
EMAIL_PROVIDER=mock
RESEND_API_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
MONCASH_CLIENT_ID=
MONCASH_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Ne jamais commiter de vraies clés.

## Erreurs évitées

- Pas de `localhost` dans le flow.
- Pas de checkout SaaS générique : les classes Academy existantes sont réutilisées.
- Pas d’appel fournisseur au build.
- Pas de refonte de `/academy`, `/academy/courses`, `/academy/login`, `/academy/register`, `/academy/dashboard` ou `/academy/my-courses`.
