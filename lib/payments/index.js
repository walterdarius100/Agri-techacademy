import { createMockPayment } from './mock-provider.js';

export const PAYMENT_PROVIDER = 'mock';

export function getPaymentProviderName() {
  return PAYMENT_PROVIDER;
}

export async function startPayment({ course, user }) {
  // The static Academy uses the mock provider by default. Future Next.js API routes
  // can switch here based on PAYMENT_PROVIDER without exposing provider secrets.
  return createMockPayment({ course, user });
}

export function formatMoney(amountCents = 0, currency = 'USD') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: amountCents % 100 === 0 ? 0 : 2
  }).format(amountCents / 100);
}
