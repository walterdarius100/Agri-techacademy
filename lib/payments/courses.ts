import prisma from '../prisma';
import { courses as staticCourses } from '../../data/courses.js';

function getStaticCourseBySlug(slug: string) {
  const course = staticCourses.find((item) => item.slug === slug);

  if (!course) {
    return null;
  }

  return {
    id: `static-${course.slug}`,
    slug: course.slug,
    title: course.title,
    description: course.description,
    priceCents: getStaticPriceCents(course.slug),
    currency: 'USD',
  };
}

export async function getPublishedCourseBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    return getStaticCourseBySlug(slug);
  }

  try {
    return await prisma.course.findFirst({
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
  } catch (error) {
    if (process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV !== 'production') {
      console.warn('[payments:courses] Falling back to static course data because Prisma is unavailable.', error);
      return getStaticCourseBySlug(slug);
    }

    throw error;
  }
}

function getStaticPriceCents(slug: string) {
  const prices: Record<string, number> = {
    cuniculture: 4900,
    aviculture: 5900,
    apiculture: 3900,
  };

  return prices[slug] ?? 0;
}
