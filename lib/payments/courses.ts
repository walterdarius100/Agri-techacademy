import prisma from '../prisma';

export async function getPublishedCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      priceCents: true,
      currency: true,
    },
  });
}
