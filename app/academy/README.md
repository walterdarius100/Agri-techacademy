# Architecture Next.js — Académie

La branche contient maintenant une base Next.js minimale détectable par Vercel.

Le design Academy validé reste servi depuis les fichiers statiques `academy/**` pendant la migration progressive. Le route handler `app/[[...path]]/route.ts` expose ces fichiers sans les redessiner.

Cibles futures de migration App Router :

- `app/academy/page.tsx` : landing page publique de l’académie.
- `app/academy/courses/page.tsx` : catalogue des formations.
- `app/academy/courses/[courseSlug]/page.tsx` : détail de cours.
- `app/academy/login/page.tsx` et `app/academy/register/page.tsx` : auth Clerk.
- `app/academy/dashboard/page.tsx` : espace étudiant après authentification.
- `app/academy/my-courses/page.tsx` : formations accessibles.
- `app/academy/admin/page.tsx` : administration interne.

Tant qu’une route n’est pas migrée, ne pas modifier son design statique validé sans demande explicite.
