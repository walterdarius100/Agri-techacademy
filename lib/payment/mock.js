import { getCourseBySlug } from '../../data/courses.js';

export const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER || 'mock';

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('fr-HT', { style: 'currency', currency }).format(amount);
}

export function getCheckoutCourse(courseSlug) {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  return {
    ...course,
    amount: course.priceAmount ?? 49,
    currency: course.priceCurrency ?? 'USD',
    benefits: course.checkoutBenefits ?? [
      'Accès au parcours complet dès validation du paiement mock.',
      'Modules structurés pour avancer étape par étape.',
      'Ressources pratiques préparées pour le terrain.',
      'Accès repris depuis Mes formations et le dashboard.'
    ]
  };
}

export function createMockPaymentReference(courseSlug) {
  const compactDate = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `MOCK-${courseSlug.toUpperCase()}-${compactDate}`;
}

export function buildMockSuccessParams(course) {
  const params = new URLSearchParams({
    course: course.slug,
    ref: createMockPaymentReference(course.slug),
    amount: String(course.amount),
    currency: course.currency,
    provider: PAYMENT_PROVIDER
  });

  return `/academy/payment/success/?${params.toString()}`;
}
