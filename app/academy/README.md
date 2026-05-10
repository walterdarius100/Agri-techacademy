# Future architecture Next.js — Académie

Ce dossier réserve l’emplacement cible d’une future migration Next.js App Router.

- `app/academy` : landing page publique de l’académie.
- `app/academy/courses` : catalogue et détails de cours.
- `app/academy/dashboard` : espace étudiant après authentification.
- `app/academy/admin` : administration interne des cours, inscriptions et contenus.

La route statique actuelle reste dans `academy/index.html` et est servie temporairement par `app/[[...path]]/route.ts` afin de garder le site existant intact pendant la migration progressive.
