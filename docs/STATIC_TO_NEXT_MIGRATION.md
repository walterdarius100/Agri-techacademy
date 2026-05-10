# Migration progressive vers Next.js

Cette branche est désormais détectable comme application Next.js par Vercel, mais le design validé reste majoritairement servi depuis les fichiers statiques existants.

## Décision d’architecture immédiate

Oui, la branche doit être une application Next.js minimale maintenant, car Vercel attend `next`, `react`, `react-dom`, un script `next build` et une configuration App Router détectable.

Pour éviter une dérive visuelle, la migration UI n’est pas faite dans ce changement. Le `app/page.tsx` sert la page d’accueil statique et le route handler `app/[...path]/route.ts` sert les autres fichiers statiques actuels depuis le repo afin de préserver l’existant pendant que les pages sont migrées une par une.

## Fichiers statiques à migrer progressivement

Pages publiques principales :
- `index.html`
- `script.js`
- `styles.css`
- `assets/images/*`

Academy validée :
- `academy/index.html`
- `academy/academy.css`
- `academy/academy.js`
- `academy/courses/index.html`
- `academy/courses/*/index.html`
- `academy/login/index.html`
- `academy/register/index.html`
- `academy/dashboard/index.html`
- `academy/my-courses/index.html`
- `academy/my-courses/*/index.html`

Modules de données et composants statiques utilisés par ces pages :
- `components/academy/*.js`
- `data/*.js`
- `lib/html.js`
- `lib/academy-auth.js`
- `lib/academy-payments.js`

## Règles de migration

1. Migrer une route à la fois vers `app/.../page.tsx`.
2. Ne pas redessiner la navbar, le footer, le hero ou les cartes sans demande explicite.
3. Conserver les routes relatives pendant la phase statique.
4. Brancher Clerk, PostgreSQL/Prisma et les paiements réels seulement après stabilisation de la base Next.js.
5. Ne pas déclencher d’appel backend pendant `next build`.
