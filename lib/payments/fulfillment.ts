import prisma from '../prisma';
import type { PaymentConfirmation } from './types';

export async function confirmPaymentAndEnroll(confirmation: PaymentConfirmation) {
  if (!confirmation.reference) {
    throw new Error('Référence paiement absente du webhook.');
  }

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { reference: confirmation.reference },
      include: { course: true },
    });

    if (!payment) {
      throw new Error(`Paiement introuvable pour la référence ${confirmation.reference}.`);
    }

    if (confirmation.status !== 'paid') {
      return tx.payment.update({
        where: { id: payment.id },
        data: {
          status: confirmation.status === 'failed' ? 'FAILED' : 'PENDING',
          provider: confirmation.provider,
        },
      });
    }

    const paidPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        provider: confirmation.provider,
        paidAt: new Date(),
      },
    });

    await tx.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: payment.userId,
          courseId: payment.courseId,
        },
      },
      update: {
        status: 'ACTIVE',
        endedAt: null,
      },
      create: {
        userId: payment.userId,
        courseId: payment.courseId,
        status: 'ACTIVE',
      },
    });

    return paidPayment;
  });
}
