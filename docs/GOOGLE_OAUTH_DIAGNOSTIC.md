# Google OAuth diagnostic — Academy

## Statut dans cette branche

Google OAuth n’est pas corrigé dans cette branche, sauf bug bloquant, afin de garder le périmètre centré sur le paiement mock et l’accès cours.

## Comportement observé dans le code existant

Le bouton Google appelle la logique `continueWithGoogleOAuth`. Si `window.Clerk` n’est pas chargé, l’UI affiche un message indiquant que la connexion Google est prête côté interface mais nécessite l’initialisation Clerk avec `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.

## À traiter dans une branche dédiée

- Vérifier le chargement du SDK Clerk côté Academy.
- Vérifier les variables Vercel Clerk.
- Vérifier les URLs de callback Google dans Clerk Dashboard.
- Tester `/academy/login` et `/academy/register` avec un vrai environnement Clerk.

## Non-objectifs de cette branche

- Pas de refonte auth.
- Pas de changement du flow login/register existant.
- Pas de suppression du mock credentials.
