import prisma from '../prisma';

const DEV_USER_EMAIL = 'dev-student@agritech.local';

export async function getCurrentPaymentUserId() {
  const clerkUserId = process.env.PAYMENT_TEST_CLERK_USER_ID;

  if (clerkUserId) {
    const user = await prisma.user.findUnique({ where: { clerkId: clerkUserId }, select: { id: true } });
    if (user) return user.id;
  }

  if (process.env.NODE_ENV !== 'production') {
    const user = await prisma.user.upsert({
      where: { email: DEV_USER_EMAIL },
      update: {},
      create: {
        clerkId: 'dev_clerk_payment_user',
        email: DEV_USER_EMAIL,
        firstName: 'Dev',
        lastName: 'Student',
      },
      select: { id: true },
    });

    return user.id;
  }

  throw new Error('Utilisateur non authentifié. Connectez Clerk avant d’activer le paiement en production.');
}
