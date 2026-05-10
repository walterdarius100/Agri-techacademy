# Configuration des paiements — Académie Agri-Tech

Ce document décrit la fondation paiement préparée pour l’achat de formations de l’Académie Agri-Tech.

## Architecture

La logique paiement est isolée côté serveur dans `lib/payments/` afin d’éviter l’exposition de secrets dans le frontend.

- `app/academy/checkout/[courseSlug]` affiche la formation, le prix et le résumé d’achat, puis déclenche une action serveur.
- `lib/payments/checkout.ts` crée une référence interne, appelle le fournisseur configuré et crée un `Payment` en statut `PENDING`.
- `lib/payments/providers.ts` contient les adaptateurs PayPal, MonCash, Stripe et développement simulé.
- `app/api/payments/webhook/route.ts` reçoit les confirmations fournisseur.
- `lib/payments/fulfillment.ts` marque le paiement en `PAID` et crée ou réactive l’`Enrollment` si le paiement est validé.
- `app/academy/payment/success` et `app/academy/payment/cancel` sont les pages de retour utilisateur.

## Choisir PayPal, MonCash ou Stripe

### PayPal

PayPal est le fournisseur le plus prêt dans cette fondation. L’adaptateur crée un token serveur, prépare une commande Checkout Orders et redirige vers le lien d’approbation PayPal.

À finaliser avant production :

1. Configurer les credentials sandbox/live.
2. Vérifier les signatures de webhook avec `PAYPAL_WEBHOOK_ID`.
3. Capturer ou vérifier définitivement la commande selon le flux PayPal choisi.

### MonCash

MonCash est prévu comme fournisseur local important pour Haïti. L’adaptateur est volontairement structuré mais partiellement mocké tant que les endpoints, paramètres exacts et règles de signature ne sont pas raccordés.

À finaliser avant production :

1. Confirmer le mode `sandbox` ou `live` via `MONCASH_MODE`.
2. Remplacer la redirection temporaire par la création de commande MonCash réelle.
3. Valider la signature et le statut de transaction dans le webhook.

### Stripe

Stripe est préparé pour une activation future. L’adaptateur existe pour conserver la même interface, mais il ne crée pas encore de Checkout Session réelle.

À finaliser si Stripe devient disponible :

1. Installer et configurer le SDK Stripe ou utiliser l’API HTTP.
2. Créer une Checkout Session côté serveur.
3. Vérifier le webhook avec `STRIPE_WEBHOOK_SECRET`.

## Variables d’environnement

Ajouter les valeurs réelles uniquement dans `.env.local`, dans Vercel Environment Variables, ou dans un gestionnaire de secrets. Ne jamais committer de secrets.

```env
PAYMENT_PROVIDER=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
MONCASH_CLIENT_ID=
MONCASH_CLIENT_SECRET=
MONCASH_MODE=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Valeurs attendues pour `PAYMENT_PROVIDER` :

- `dev-simulated` : simulation locale uniquement.
- `paypal` : création de commande PayPal.
- `moncash` : adaptateur MonCash préparé.
- `stripe` : adaptateur Stripe préparé pour plus tard.

`NEXT_PUBLIC_APP_URL` peut aussi être défini pour générer les URLs absolues de retour et de simulation locale.

## Fonctionnement du webhook

Le endpoint `/api/payments/webhook` :

1. Identifie le fournisseur via `PAYMENT_PROVIDER`.
2. Parse l’événement fournisseur dans un format interne commun.
3. Cherche le `Payment` par sa référence interne.
4. Si le statut est payé, met le paiement en `PAID`.
5. Crée ou réactive l’inscription de l’étudiant à la formation.

La vérification cryptographique des webhooks PayPal, MonCash et Stripe doit être activée avant toute mise en production. La structure est en place, mais les signatures restent à raccorder aux exigences exactes de chaque fournisseur.

## Paiement simulé vs paiement réel

En développement, si aucun `PAYMENT_PROVIDER` n’est défini, la plateforme utilise `dev-simulated`.

- Le checkout crée quand même un `Payment` en base.
- L’utilisateur est redirigé vers `/api/payments/dev/simulate-success/[reference]`.
- Cette route marque le paiement comme payé, crée l’inscription, puis redirige vers `/academy/payment/success`.
- Cette route refuse le fonctionnement en production.

En paiement réel, l’utilisateur est redirigé vers le fournisseur. La validation finale doit venir du webhook fournisseur, pas uniquement de la page de succès affichée au navigateur.

## Étapes pour passer en production

1. Configurer `DATABASE_URL`, Clerk et les credentials du fournisseur choisi dans l’environnement de production.
2. Définir `PAYMENT_PROVIDER=paypal` ou `PAYMENT_PROVIDER=moncash` selon le fournisseur retenu.
3. Définir l’URL publique de l’application avec `NEXT_PUBLIC_APP_URL`.
4. Créer les webhooks côté fournisseur vers `/api/payments/webhook`.
5. Activer et tester la vérification de signature du webhook.
6. Tester un paiement complet en sandbox.
7. Vérifier que l’utilisateur authentifié Clerk est correctement relié au modèle `User` avant d’autoriser les paiements live.
8. Désactiver toute simulation en production et refuser `dev-simulated` dans les variables live.
9. Surveiller les logs de webhook et les statuts `Payment`/`Enrollment` après les premiers paiements réels.
