const EMAIL_LOG_KEY = 'agritech.academy.emailLog.v1';

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getEmailLog() {
  return safeJsonParse(window.localStorage.getItem(EMAIL_LOG_KEY), []);
}

export function renderPurchaseConfirmationEmail({ user, course, payment }) {
  return {
    subject: `Confirmation d’achat · ${course.title}`,
    text: [
      `Bonjour ${user.name || user.email},`,
      `Votre paiement ${payment.reference} pour ${course.title} est confirmé.`,
      'Votre accès est maintenant disponible dans Mes formations.',
      'Merci de faire confiance à Agri-Tech Academy.'
    ].join('\n')
  };
}

export async function sendPurchaseConfirmationEmail({ user, course, payment }) {
  const message = renderPurchaseConfirmationEmail({ user, course, payment });
  const entry = {
    id: `email_${Date.now()}`,
    provider: 'mock',
    to: user.email,
    courseSlug: course.slug,
    paymentReference: payment.reference,
    ...message,
    createdAt: new Date().toISOString()
  };

  window.localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify([entry, ...getEmailLog()].slice(0, 20)));
  console.info('[Academy email mock]', entry);
  return entry;
}
