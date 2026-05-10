import { sendMockEmail } from './providers/mock.js';
import { purchaseConfirmationTemplate } from './templates/purchase-confirmation.js';

export const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'mock';

export async function sendPurchaseConfirmationEmail(payload) {
  const message = purchaseConfirmationTemplate(payload);

  if (EMAIL_PROVIDER !== 'mock') {
    return {
      ok: false,
      provider: EMAIL_PROVIDER,
      reason: 'provider-not-configured',
      message
    };
  }

  return sendMockEmail(message);
}
