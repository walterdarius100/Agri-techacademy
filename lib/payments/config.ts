export type PaymentProvider = 'paypal' | 'moncash' | 'stripe' | 'dev-simulated';

const SUPPORTED_PROVIDERS = new Set<PaymentProvider>(['paypal', 'moncash', 'stripe', 'dev-simulated']);

export function isProductionDeployment() {
  return process.env.VERCEL_ENV === 'production' || (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV);
}

export function getPaymentProvider(): PaymentProvider {
  const configuredProvider = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();

  if (!configuredProvider && !isProductionDeployment()) {
    return 'dev-simulated';
  }

  if (configuredProvider && SUPPORTED_PROVIDERS.has(configuredProvider as PaymentProvider)) {
    return configuredProvider as PaymentProvider;
  }

  throw new Error('PAYMENT_PROVIDER doit être défini avec paypal, moncash, stripe ou dev-simulated.');
}

export function assertServerOnlyPaymentConfig() {
  if (typeof window !== 'undefined') {
    throw new Error('La configuration paiement ne doit jamais être chargée côté client.');
  }
}

export function getPaypalConfig() {
  assertServerOnlyPaymentConfig();
  return {
    clientId: requiredEnv('PAYPAL_CLIENT_ID'),
    clientSecret: requiredEnv('PAYPAL_CLIENT_SECRET'),
    webhookId: process.env.PAYPAL_WEBHOOK_ID,
    baseUrl: isProductionDeployment() ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com',
  };
}

export function getMonCashConfig() {
  assertServerOnlyPaymentConfig();
  return {
    clientId: requiredEnv('MONCASH_CLIENT_ID'),
    clientSecret: requiredEnv('MONCASH_CLIENT_SECRET'),
    mode: process.env.MONCASH_MODE === 'live' ? 'live' : 'sandbox',
  };
}

export function getStripeConfig() {
  assertServerOnlyPaymentConfig();
  return {
    secretKey: requiredEnv('STRIPE_SECRET_KEY'),
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  };
}

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable d’environnement manquante: ${name}`);
  }

  return value;
}
