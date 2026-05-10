import { sendPurchaseConfirmationEmail } from '../email/index.js';

const PAYMENTS_STORAGE_KEY = 'agritech.academy.payments.v1';

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getStoredPayments() {
  return safeJsonParse(window.localStorage.getItem(PAYMENTS_STORAGE_KEY), []);
}

function setStoredPayments(payments) {
  window.localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
}

export function getPaymentsForUser(userId) {
  if (!userId) return [];
  return getStoredPayments().filter((payment) => payment.userId === userId);
}

export function getPaymentByReference(reference, userId) {
  if (!reference) return null;
  return getStoredPayments().find((payment) => payment.reference === reference && (!userId || payment.userId === userId)) ?? null;
}

export function hasPaidForCourse(userId, courseSlug) {
  return getPaymentsForUser(userId).some((payment) => payment.courseSlug === courseSlug && payment.status === 'paid');
}

export async function confirmCoursePayment({ user, course, providerPayment, updateUserEnrollment }) {
  const payment = {
    id: providerPayment.reference,
    userId: user.id,
    userEmail: user.email,
    courseSlug: course.slug,
    courseTitle: course.title,
    amountCents: providerPayment.amountCents,
    currency: providerPayment.currency,
    provider: providerPayment.provider,
    reference: providerPayment.reference,
    status: providerPayment.status,
    paidAt: providerPayment.paidAt,
    createdAt: new Date().toISOString()
  };

  const existing = getPaymentByReference(payment.reference);
  if (!existing) {
    setStoredPayments([payment, ...getStoredPayments()]);
  }

  const updatedUser = updateUserEnrollment(course.slug);
  await sendPurchaseConfirmationEmail({ user: updatedUser ?? user, course, payment });
  return { payment, user: updatedUser ?? user };
}
