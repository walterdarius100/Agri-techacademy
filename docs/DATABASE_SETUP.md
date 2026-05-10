# Configuration PostgreSQL + Prisma — Agri-Tech Academy

Ce guide prépare la fondation base de données de l’Academy avec Prisma et PostgreSQL. Ne committez jamais une vraie chaîne `DATABASE_URL` dans Git.

## 1. Créer une base PostgreSQL

Vous pouvez utiliser PostgreSQL en local, un service managé ou une intégration Vercel.

### Option locale rapide

1. Installez PostgreSQL sur votre machine.
2. Créez une base dédiée, par exemple :

```bash
createdb agritech_academy
```

3. Vérifiez que votre utilisateur PostgreSQL dispose des droits de lecture/écriture sur cette base.

### Option service managé

Vous pouvez aussi créer une base via Supabase, Neon, Railway, Render, Vercel Postgres ou un autre fournisseur PostgreSQL. Copiez ensuite l’URL de connexion fournie par le service.

## 2. Ajouter `DATABASE_URL`

Créez un fichier `.env.local` à la racine du projet, puis ajoutez votre vraie URL PostgreSQL :

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/agritech_academy?schema=public"
```

Remplacez `USER`, `PASSWORD`, `HOST` et le nom de base par vos valeurs réelles. Le fichier `.env.example` doit rester un modèle sans secret.

## 3. Installer les dépendances

Après un clone frais du projet, installez les dépendances Node.js :

```bash
npm install
```

## 4. Générer Prisma Client

Après l’installation ou après chaque modification de `prisma/schema.prisma`, lancez :

```bash
npm run prisma:generate
```

Cette commande génère Prisma Client à partir du schéma courant.

## 5. Lancer une migration

En développement, créez et appliquez une migration avec :

```bash
npm run prisma:migrate -- --name init_academy_database
```

Cette commande lit `DATABASE_URL`, crée une migration dans `prisma/migrations/`, puis synchronise la base PostgreSQL.

## 6. Lancer le seed optionnel

Un seed optionnel crée les trois premiers cours de l’Academy :

- `cuniculture` ;
- `aviculture` ;
- `apiculture`.

Après avoir appliqué les migrations, lancez :

```bash
npm run prisma:seed
```

Le seed utilise des `upsert`, donc il peut être relancé sans dupliquer ces cours.

## 7. Ajouter `DATABASE_URL` dans Vercel

1. Ouvrez le projet dans Vercel.
2. Allez dans **Settings > Environment Variables**.
3. Ajoutez `DATABASE_URL` avec la vraie URL PostgreSQL de production ou de preview.
4. Sélectionnez les environnements nécessaires : **Production**, **Preview** et éventuellement **Development**.
5. Enregistrez, puis redéployez l’application pour que la variable soit disponible.

> Sécurité : ne préfixez jamais `DATABASE_URL` par `NEXT_PUBLIC_`, car cette variable doit rester côté serveur.

## 8. Notes d’intégration progressive

- Les pages frontend existantes restent déconnectées de la base pour l’instant.
- Les modèles Prisma préparent les cours, modules, leçons, ressources, inscriptions, progressions et paiements.
- Aucun paiement réel n’est configuré à cette étape.
- L’authentification Clerk pourra être reliée progressivement via le champ `User.clerkId`.
