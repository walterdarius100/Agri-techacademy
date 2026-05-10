import type { PaymentProvider } from './config';

export type PaymentCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  priceCents: number;
  currency: string;
};

export type CheckoutInput = {
  course: PaymentCourse;
  userId: string;
  successUrl: string;
  cancelUrl: string;
  reference: string;
};

export type CheckoutResult = {
  provider: PaymentProvider;
  providerReference: string;
  redirectUrl: string;
};

export type PaymentConfirmation = {
  provider: PaymentProvider;
  reference: string;
  providerReference?: string;
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  rawEvent?: unknown;
};
