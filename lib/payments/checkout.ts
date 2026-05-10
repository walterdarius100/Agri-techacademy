import prisma from '../prisma';
import { getPaymentProvider, isProductionDeployment } from './config';
import { createProviderCheckout } from './providers';
import { getCurrentPaymentUserId } from './session';
import { getPublishedCourseBySlug } from './courses';

export async function createCheckoutSession({ courseSlug, successUrl, cancelUrl }: { courseSlug: string; successUrl: string; cancelUrl: string }) {
  const course = await getPublishedCourseBySlug(courseSlug);

  if (!course) {
    throw new Error('Formation introuvable ou non publiée.');
  }

  if (!process.env.DATABASE_URL && !isProductionDeployment()) {
    return {
      provider: 'dev-simulated' as const,
      providerReference: `preview_${course.slug}`,
      redirectUrl: successUrl,
    };
  }

  const userId = await getCurrentPaymentUserId();
  const reference = `agt_${crypto.randomUUID()}`;
  const provider = getPaymentProvider();

  const payment = await prisma.payment.create({
    data: {
      userId,
      courseId: course.id,
      amountCents: course.priceCents,
      currency: course.currency,
      status: 'PENDING',
      provider,
      reference,
    },
  });

  try {
    return await createProviderCheckout({
      course,
      userId,
      successUrl,
      cancelUrl,
      reference: payment.reference ?? reference,
    });
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });

    throw error;
  }
}
