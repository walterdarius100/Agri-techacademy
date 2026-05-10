import { getMonCashConfig, getPaypalConfig, getPaymentProvider, getStripeConfig, isProductionDeployment } from './config';
import type { CheckoutInput, CheckoutResult, PaymentConfirmation } from './types';
import { buildAbsoluteUrl } from './urls';

export async function createProviderCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const provider = getPaymentProvider();

  switch (provider) {
    case 'paypal':
      return createPaypalCheckout(input);
    case 'moncash':
      return createMonCashCheckout(input);
    case 'stripe':
      return createStripeCheckout(input);
    case 'dev-simulated':
      return createDevCheckout(input);
    default:
      throw new Error('Fournisseur de paiement non supporté.');
  }
}

export async function parseProviderWebhook(request: Request): Promise<PaymentConfirmation> {
  const provider = getPaymentProvider();

  switch (provider) {
    case 'paypal':
      return parsePaypalWebhook(request);
    case 'moncash':
      return parseMonCashWebhook(request);
    case 'stripe':
      return parseStripeWebhook(request);
    case 'dev-simulated':
      return parseDevWebhook(request);
    default:
      throw new Error('Fournisseur de paiement non supporté.');
  }
}

async function createPaypalCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const config = getPaypalConfig();

  const authResponse = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!authResponse.ok) {
    throw new Error('Impossible de créer un jeton PayPal.');
  }

  const token = (await authResponse.json()) as { access_token: string };
  const orderResponse = await fetch(`${config.baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: input.reference,
          custom_id: input.reference,
          amount: {
            currency_code: input.course.currency,
            value: (input.course.priceCents / 100).toFixed(2),
          },
          description: input.course.title,
        },
      ],
      application_context: {
        return_url: input.successUrl,
        cancel_url: input.cancelUrl,
      },
    }),
    cache: 'no-store',
  });

  if (!orderResponse.ok) {
    throw new Error('Impossible de créer une commande PayPal.');
  }

  const order = (await orderResponse.json()) as { id: string; links?: Array<{ rel: string; href: string }> };
  const approveLink = order.links?.find((link) => link.rel === 'approve')?.href;

  if (!approveLink) {
    throw new Error('PayPal n’a pas retourné de lien d’approbation.');
  }

  return {
    provider: 'paypal',
    providerReference: order.id,
    redirectUrl: approveLink,
  };
}

async function createMonCashCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  getMonCashConfig();

  return {
    provider: 'moncash',
    providerReference: input.reference,
    redirectUrl: `${input.cancelUrl}?reason=moncash-not-connected&reference=${encodeURIComponent(input.reference)}`,
  };
}

async function createStripeCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  getStripeConfig();

  return {
    provider: 'stripe',
    providerReference: input.reference,
    redirectUrl: `${input.cancelUrl}?reason=stripe-not-connected&reference=${encodeURIComponent(input.reference)}`,
  };
}

async function createDevCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  if (isProductionDeployment()) {
    throw new Error('Le paiement simulé est interdit en production.');
  }

  return {
    provider: 'dev-simulated',
    providerReference: input.reference,
    redirectUrl: buildAbsoluteUrl(`/api/payments/dev/simulate-success/${input.reference}`),
  };
}

async function parsePaypalWebhook(request: Request): Promise<PaymentConfirmation> {
  const event = await request.json();
  const resource = event.resource ?? {};

  return {
    provider: 'paypal',
    reference: resource.purchase_units?.[0]?.reference_id ?? resource.custom_id ?? resource.invoice_id,
    providerReference: resource.id,
    status: event.event_type?.includes('COMPLETED') ? 'paid' : 'pending',
    rawEvent: event,
  };
}

async function parseMonCashWebhook(request: Request): Promise<PaymentConfirmation> {
  const event = await request.json();

  return {
    provider: 'moncash',
    reference: event.reference ?? event.orderId ?? event.transactionId,
    providerReference: event.transactionId,
    status: event.status === 'SUCCESS' || event.status === 'COMPLETED' ? 'paid' : 'pending',
    rawEvent: event,
  };
}

async function parseStripeWebhook(request: Request): Promise<PaymentConfirmation> {
  const event = await request.json();
  const data = event.data?.object ?? {};

  return {
    provider: 'stripe',
    reference: data.metadata?.paymentReference ?? data.client_reference_id,
    providerReference: data.id,
    status: event.type === 'checkout.session.completed' || data.payment_status === 'paid' ? 'paid' : 'pending',
    rawEvent: event,
  };
}

async function parseDevWebhook(request: Request): Promise<PaymentConfirmation> {
  if (isProductionDeployment()) {
    throw new Error('Le webhook simulé est interdit en production.');
  }

  const event = await request.json();

  return {
    provider: 'dev-simulated',
    reference: event.reference,
    providerReference: event.reference,
    status: 'paid',
    rawEvent: event,
  };
}
