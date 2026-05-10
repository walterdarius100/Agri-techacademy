const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courses = [
  {
    slug: 'cuniculture',
    title: 'Cuniculture',
    description: 'Bases pratiques pour lancer et gérer un élevage de lapins rentable.',
    level: 'Débutant',
    duration: '4 semaines',
    priceCents: 4900,
  },
  {
    slug: 'aviculture',
    title: 'Aviculture',
    description: 'Fondamentaux de production avicole, biosécurité et conduite d’élevage.',
    level: 'Débutant',
    duration: '6 semaines',
    priceCents: 5900,
  },
  {
    slug: 'apiculture',
    title: 'Apiculture',
    description: 'Initiation à la conduite de ruches et à la valorisation des produits apicoles.',
    level: 'Débutant',
    duration: '5 semaines',
    priceCents: 3900,
  },
];

async function main() {
  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        ...course,
        isPublished: true,
      },
      create: {
        ...course,
        isPublished: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
