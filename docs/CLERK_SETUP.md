# Configuration Clerk + Google OAuth — Agri-Tech Academy

Ce guide explique comment activer une authentification Clerk propre pour l’Academy, avec inscription/connexion email et connexion Google. Ne committez jamais de vraies clés dans le dépôt.

## 1. Créer un compte Clerk

1. Ouvrez [clerk.com](https://clerk.com/).
2. Créez un compte ou connectez-vous avec votre compte existant.
3. Accédez au dashboard Clerk.

## 2. Créer une application Clerk

1. Dans le dashboard Clerk, cliquez sur **Create application**.
2. Nommez l’application, par exemple `Agri-Tech Academy`.
3. Activez les méthodes d’authentification nécessaires :
   - email/password ou email code selon le choix produit ;
   - Google OAuth.
4. Validez la création de l’application.

## 3. Récupérer les clés Clerk

Dans le dashboard Clerk, ouvrez **Developers > API keys** puis copiez :

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` : clé publique utilisable côté navigateur ;
- `CLERK_SECRET_KEY` : clé serveur strictement secrète.

> Important : `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` peut être exposée côté client, mais `CLERK_SECRET_KEY` ne doit jamais être publiée, affichée dans le navigateur ou commitée dans Git.

## 4. Ajouter les clés dans `.env.local`

Créez un fichier `.env.local` à la racine du projet, puis ajoutez uniquement vos vraies valeurs locales :

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/academy/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/academy/register
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/academy/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/academy/dashboard
```

Ne committez pas `.env.local`.

## 5. Garder `.env.example` avec des placeholders

Le dépôt doit seulement contenir des placeholders, par exemple :

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/academy/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/academy/register
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/academy/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/academy/dashboard
```

## 6. Activer Google OAuth dans Clerk

1. Dans Clerk, ouvrez **User & Authentication > Social connections**.
2. Activez **Google**.
3. Utilisez le mode recommandé par Clerk pour démarrer rapidement, ou connectez vos identifiants Google Cloud si vous souhaitez utiliser votre propre application OAuth.
4. Vérifiez que Google est activé pour sign-in et sign-up.

## 7. Configurer les redirections

Dans Clerk, configurez les URLs adaptées à l’Academy :

- Sign-in URL : `/academy/login`
- Sign-up URL : `/academy/register`
- After sign-in URL : `/academy/dashboard`
- After sign-up URL : `/academy/dashboard`

Pour cette branche paiement, gardez les redirections applicatives en chemins relatifs Academy. Les origines de développement ne doivent pas être copiées dans le flow de paiement ni dans les variables de preview Vercel.

En production, ajoutez le domaine Vercel final, par exemple :

- `https://votre-domaine.vercel.app`
- `https://votre-domaine.com`

## 8. Ajouter les variables dans Vercel

1. Ouvrez le projet dans Vercel.
2. Allez dans **Settings > Environment Variables**.
3. Ajoutez les variables suivantes avec les vraies valeurs Clerk :
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`
4. Appliquez-les aux environnements nécessaires : Preview, Production et Development si utilisé.
5. Redéployez l’application après modification.

## 9. Relancer le serveur local

Après avoir modifié `.env.local`, arrêtez puis relancez le serveur pour que les variables soient rechargées.

Exemple Next.js futur :

```bash
npm run dev
```

Exemple pour tester la version statique actuelle :

```bash
python3 -m http.server 4173
```

## 10. Tester les parcours Academy

Vérifiez au minimum :

1. **Inscription email** : ouvrir `/academy/register`, créer un compte, puis vérifier la redirection vers `/academy/dashboard`.
2. **Connexion email** : ouvrir `/academy/login`, se connecter, puis vérifier la redirection vers `/academy/dashboard`.
3. **Connexion avec Google** : cliquer sur **Continuer avec Google**, terminer le flux Google, puis vérifier la redirection vers `/academy/dashboard`.
4. **Routes protégées** : sans session, ouvrir `/academy/dashboard` ou `/academy/my-courses` et vérifier la redirection vers `/academy/login`.
5. **Déconnexion** : cliquer sur **Déconnexion** et vérifier le retour à l’état déconnecté.

## Notes pour l’intégration Next.js

- Garder les formulaires actuels comme UI de base si la migration Next.js n’est pas encore terminée.
- Remplacer progressivement le mock local par les composants/hooks Clerk officiels côté Next.js.
- Ne pas ajouter de paiement, base PostgreSQL ou admin panel tant que l’authentification n’est pas validée.
