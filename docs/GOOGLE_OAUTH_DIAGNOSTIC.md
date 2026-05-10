# Diagnostic Google OAuth avec Clerk — Agri-Tech Academy

## Résumé exécutif

Le bouton **« Continuer avec Google »** visible sur `/academy/login/` et `/academy/register/` n’est pas une intégration Clerk complète aujourd’hui. Il s’agit d’un bouton UI branché sur une fonction JavaScript qui tente d’utiliser `window.Clerk` si un SDK Clerk navigateur est déjà chargé. Or, dans l’état actuel du dépôt, rien ne charge réellement Clerk dans la page statique et le package officiel `@clerk/nextjs` n’est pas installé.

Conclusion : le login local mock fonctionne, mais Google OAuth ne peut pas fonctionner de manière fiable tant que Clerk n’est pas installé, initialisé et connecté à l’App Router Next.js ou à un SDK navigateur explicitement chargé.

## État actuel de l’implémentation

### Ce qui existe

- Les pages statiques `/academy/login/` et `/academy/register/` affichent un bouton Google avec l’attribut `data-google-auth`.
- `academy/auth-pages.js` écoute les clics sur `[data-google-auth]` et appelle `continueWithGoogleOAuth()`.
- `lib/academy-auth.js` contient une fonction `continueWithGoogleOAuth()` qui cherche `window.Clerk`, puis tente d’appeler `clerk.redirectToSignIn`, `clerk.redirectToSignUp` ou un fallback `clerk.client.signIn/signUp.sso()`.
- `.env.example` déclare les variables Clerk de base :
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`
- `docs/CLERK_SETUP.md` existe déjà comme guide général de configuration Clerk + Google OAuth.

### Ce qui manque

- `@clerk/nextjs` n’est pas présent dans `package.json`.
- Aucun `ClerkProvider` n’est configuré dans `app/layout.tsx`.
- Aucun composant Clerk officiel (`<SignIn />`, `<SignUp />`, `<SignInButton />`, etc.) ni hook Clerk (`useSignIn`, `useSignUp`, `useUser`, `auth`, `currentUser`) n’est utilisé.
- Aucun middleware Clerk (`middleware.ts`) ne protège les routes Academy.
- Aucun script Clerk navigateur n’est chargé dans les fichiers HTML statiques.
- Aucune route callback OAuth dédiée n’est implémentée.
- Les sessions réelles Clerk ne sont pas synchronisées avec le mock localStorage actuel.

## Vérifications demandées

| Point vérifié | État | Diagnostic |
| --- | --- | --- |
| Clerk réellement installé | Non | `package.json` ne contient pas `@clerk/nextjs`. |
| `@clerk/nextjs` présent | Non | À ajouter avant une intégration Next.js officielle. |
| `ClerkProvider` configuré | Non | `app/layout.tsx` est minimal et ne wrappe pas l’application. |
| Composants/hooks Clerk utilisés | Non | Les pages login/register sont statiques et utilisent seulement `academy/auth-pages.js`. |
| Middleware Clerk | Non | Aucun `middleware.ts` n’existe à la racine. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Placeholder dans `.env.example` | Présent comme variable attendue, mais non injecté dans les pages statiques. |
| `CLERK_SECRET_KEY` | Placeholder dans `.env.example` | Présent comme variable serveur attendue, mais aucun code serveur Clerk ne l’utilise. |
| Variables Vercel attendues | Partiellement documentées | Variables Clerk listées, mais pas encore reliées à une intégration réelle. |
| Redirect URLs | Partiellement documentées | Les routes `/academy/login`, `/academy/register`, `/academy/dashboard` sont listées, mais pas de callback OAuth Next/Clerk configuré dans le code. |
| Google activé dans Clerk Dashboard | Inconnu | Non vérifiable depuis le dépôt. À confirmer dans Clerk Dashboard. |
| Bouton Google déclenche Clerk | Partiellement | Le clic appelle une fonction, mais elle échoue si `window.Clerk` est absent. |

## Ce qui fonctionne aujourd’hui

1. La connexion locale mock par email/mot de passe fonctionne via `loginWithMockCredentials()`.
2. L’inscription locale mock fonctionne via `registerMockUser()`.
3. Les redirections locales après login/register mock fonctionnent via le paramètre `redirect` et `getRedirectTarget()`.
4. Le bouton Google affiche un message d’erreur propre si `window.Clerk` n’est pas disponible.
5. Le code évite de casser le login local temporaire : l’OAuth Google est isolé dans le handler des boutons Google.

## Ce qui ne fonctionne pas aujourd’hui

1. Google OAuth réel ne démarre pas dans une installation fraîche du dépôt.
2. Le navigateur n’a pas d’objet `window.Clerk` parce qu’aucun SDK Clerk n’est chargé.
3. Next.js n’a pas de provider Clerk à la racine.
4. Les routes protégées ne vérifient pas une session Clerk serveur.
5. Le callback OAuth Google ne peut pas établir une session Academy réelle.
6. Même si Clerk était chargé manuellement, il faudrait décider comment convertir la session Clerk en session Academy et comment remplacer progressivement le mock localStorage.

## Causes probables

### Cause principale

Le bouton Google est actuellement surtout une UI de préparation. Il est branché sur une tentative d’appel Clerk, mais l’environnement Clerk n’est pas initialisé. La condition suivante dans `lib/academy-auth.js` bloque donc le flux : si `window.Clerk` est absent, la fonction retourne `clerk-not-loaded`.

### Causes secondaires possibles

- Les dépendances Clerk ne sont pas installées.
- Les variables Clerk peuvent exister localement, mais elles ne sont pas utilisées par le runtime statique actuel.
- Google OAuth peut ne pas être activé dans Clerk Dashboard.
- Les domaines Vercel Preview/Production peuvent manquer dans Clerk.
- Les redirect URLs configurées dans Clerk peuvent ne pas correspondre aux routes Academy.
- Le projet mélange encore pages statiques et scaffold Next.js minimal ; il faut choisir une intégration progressive propre plutôt qu’un bricolage dans les fichiers HTML.

## Fichiers concernés

- `academy/login/index.html` : bouton Google visible côté login.
- `academy/register/index.html` : bouton Google visible côté register.
- `academy/auth-pages.js` : listener du bouton Google et affichage des messages.
- `lib/academy-auth.js` : tentative d’appel à `window.Clerk` et login/register mock local.
- `app/layout.tsx` : emplacement cible pour `ClerkProvider` lorsque `@clerk/nextjs` sera installé.
- `package.json` : dépendances actuelles, absence de `@clerk/nextjs`.
- `.env.example` : variables Clerk attendues.
- `docs/CLERK_SETUP.md` : guide existant à garder et compléter si l’intégration est réalisée.

## Variables nécessaires

### Variables déjà listées

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/academy/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/academy/register
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/academy/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/academy/dashboard
```

### Variables recommandées selon l’intégration future

```env
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/academy/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/academy/dashboard
```

Ces variables doivent être validées avec la version de Clerk utilisée au moment de l’intégration. Les variables existantes `FORCE_REDIRECT_URL` peuvent rester utiles, mais il faudra aligner la configuration avec les APIs Clerk effectivement utilisées.

## Checklist Vercel

- [ ] Ajouter `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dans les variables Vercel.
- [ ] Ajouter `CLERK_SECRET_KEY` dans les variables Vercel.
- [ ] Vérifier que les variables sont définies pour **Production**, **Preview** et, si nécessaire, **Development**.
- [ ] Ne jamais exposer `CLERK_SECRET_KEY` dans du JavaScript client.
- [ ] Déployer après installation de `@clerk/nextjs` et configuration de `ClerkProvider`.
- [ ] Vérifier que les domaines Vercel Preview sont autorisés côté Clerk.
- [ ] Vérifier que `/academy/login`, `/academy/register` et `/academy/dashboard` sont cohérents avec les redirects configurés.

## Checklist Clerk Dashboard

- [ ] Créer ou sélectionner l’application Clerk du projet.
- [ ] Activer **Google** dans **User & Authentication > Social connections**.
- [ ] Autoriser Google pour sign-in et sign-up.
- [ ] Configurer les domaines de production et de preview.
- [ ] Vérifier les URLs de redirection autorisées.
- [ ] Vérifier que les clés API correspondent au bon environnement Clerk (`test` vs `live`).
- [ ] Si une application Google Cloud custom est utilisée, vérifier les credentials OAuth Google et les authorized redirect URIs fournis par Clerk.

## Étapes exactes recommandées pour activer Google OAuth proprement

1. Installer Clerk côté Next.js :

   ```bash
   npm install @clerk/nextjs
   ```

2. Ajouter `ClerkProvider` dans `app/layout.tsx` autour de l’application.
3. Ajouter un `middleware.ts` Clerk pour protéger les routes privées, par exemple `/academy/dashboard`, `/academy/my-courses`, `/academy/checkout` et `/academy/payments`.
4. Choisir une stratégie de migration :
   - soit migrer `/academy/login` et `/academy/register` en vraies pages Next.js utilisant les composants Clerk ;
   - soit charger explicitement Clerk côté navigateur pour les pages statiques, mais cette option est moins propre à long terme.
5. Remplacer progressivement le bouton Google statique par un appel Clerk officiel compatible avec la stratégie retenue.
6. Après callback OAuth, synchroniser l’utilisateur Clerk avec le modèle `User` Prisma via `clerkId`.
7. Conserver temporairement le login local mock tant que la migration n’est pas complète, mais afficher clairement qu’il s’agit d’un mode démo.
8. Tester en local, en Vercel Preview puis en Production.

## Recommandations techniques

1. Ne pas bricoler un OAuth Google directement dans les fichiers HTML statiques.
2. Utiliser `@clerk/nextjs` comme source d’authentification officielle dès que les pages login/register sont migrées vers Next.js.
3. Garder le login local mock isolé tant que toutes les routes Academy ne sont pas prêtes à consommer une session Clerk.
4. Protéger les routes privées côté serveur avec middleware Clerk, pas seulement avec `localStorage`.
5. Créer une couche d’adaptation `getAcademyUser()` plus tard pour relier Clerk, Prisma et les permissions Academy.
6. Ne pas stocker de session réelle dans `localStorage` ; laisser Clerk gérer les cookies/session sécurisés.
7. Ne pas toucher au flow paiement tant que l’auth Clerk n’est pas stabilisée.

## Correction simple possible sans risque

Aucune correction fonctionnelle complète n’est sûre sans installer/configurer Clerk. La correction la plus sûre à court terme est documentaire : indiquer clairement que le bouton Google est une intégration préparée mais inactive tant que `window.Clerk` n’est pas chargé.

Une micro-amélioration UI future, sans refonte, pourrait consister à afficher un libellé du type **« Google bientôt disponible »** lorsque `window.Clerk` est absent. Cette modification n’est pas appliquée ici afin de ne pas changer l’interface validée.

## Prochaines actions recommandées

1. Installer `@clerk/nextjs` dès que l’accès npm est stable dans CI/Vercel.
2. Configurer `ClerkProvider` et `middleware.ts`.
3. Migrer uniquement `/academy/login` et `/academy/register` vers Next.js en conservant le design existant.
4. Activer Google dans Clerk Dashboard.
5. Configurer les variables Clerk dans Vercel.
6. Tester le flux Google OAuth en Preview.
7. Une fois OAuth validé, relier l’utilisateur Clerk à Prisma via `User.clerkId`.
