const MOCK_PAYMENT_DELAY = 650;

function wait(ms = MOCK_PAYMENT_DELAY) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function createReference(courseSlug) {
  const randomPart = window.crypto?.getRandomValues
    ? Array.from(window.crypto.getRandomValues(new Uint32Array(2))).map((value) => value.toString(36)).join('')
    : Math.random().toString(36).slice(2);

  return `mock_${courseSlug}_${Date.now()}_${randomPart}`;
}

export async function createMockPayment({ course, user }) {
  await wait();

  if (!course?.slug || !user?.id) {
    throw new Error('Session ou formation invalide pour démarrer le paiement mock.');
  }

  return {
    provider: 'mock',
    status: 'paid',
    reference: createReference(course.slug),
    amountCents: course.priceCents ?? 0,
    currency: course.currency ?? 'USD',
    paidAt: new Date().toISOString(),
    checkoutMode: 'mock-browser-confirmation'
  };
}
