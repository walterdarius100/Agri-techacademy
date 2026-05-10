import { enrollCurrentUserInCourse, getCurrentUser } from './academy-auth.js';
import { getCourseBySlug } from '../data/courses.js';

const PAYMENT_HISTORY_KEY = 'agritech.academy.payments.v1';
const EMAIL_OUTBOX_KEY = 'agritech.academy.emailOutbox.v1';
const MOCK_PAYMENT_DELAY = 650;

function wait(ms = MOCK_PAYMENT_DELAY) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readCollection(key) {
  return safeJsonParse(window.localStorage.getItem(key), []);
}

function writeCollection(key, items) {
  window.localStorage.setItem(key, JSON.stringify(items));
}

function createPaymentReference(courseSlug) {
  return `ATA-${courseSlug.toUpperCase()}-${Date.now()}`;
}

export function getPaymentHistory(user = getCurrentUser()) {
  const email = user?.email;
  const payments = readCollection(PAYMENT_HISTORY_KEY);

  if (!email) return [];
  return payments.filter((payment) => payment.userEmail === email);
}

export function getEmailOutbox(user = getCurrentUser()) {
  const email = user?.email;
  const emails = readCollection(EMAIL_OUTBOX_KEY);

  if (!email) return [];
  return emails.filter((item) => item.to === email);
}

export async function createMockPayment({ courseSlug, provider = 'mock' }) {
  const user = getCurrentUser();
  const course = getCourseBySlug(courseSlug);

  if (!user) {
    throw new Error('Connectez-vous pour finaliser l’inscription à cette formation.');
  }

  if (!course) {
    throw new Error('Formation introuvable. Retournez au catalogue pour sélectionner un cours valide.');
  }

  await wait();

  const paidAt = new Date().toISOString();
  const payment = {
    id: createPaymentReference(course.slug),
    courseSlug: course.slug,
    courseTitle: course.title,
    amountLabel: course.price,
    provider,
    status: 'paid',
    userEmail: user.email,
    userName: user.name,
    paidAt
  };

  writeCollection(PAYMENT_HISTORY_KEY, [payment, ...readCollection(PAYMENT_HISTORY_KEY)]);
  enrollCurrentUserInCourse(course.slug, { billingStatus: 'mock-paid', accessStatus: 'active' });
  queueConfirmationEmail({ payment, course, user });

  return payment;
}

export function cancelMockPayment({ courseSlug }) {
  const user = getCurrentUser();
  const course = getCourseBySlug(courseSlug);
  const canceledAt = new Date().toISOString();
  const payment = {
    id: createPaymentReference(courseSlug || 'CANCEL'),
    courseSlug: courseSlug || 'unknown',
    courseTitle: course?.title || 'Formation non sélectionnée',
    amountLabel: course?.price || 'Paiement non finalisé',
    provider: 'mock',
    status: 'canceled',
    userEmail: user?.email || 'visiteur',
    userName: user?.name || 'Visiteur',
    paidAt: null,
    canceledAt
  };

  writeCollection(PAYMENT_HISTORY_KEY, [payment, ...readCollection(PAYMENT_HISTORY_KEY)]);
  return payment;
}

function queueConfirmationEmail({ payment, course, user }) {
  const email = {
    id: `email_${payment.id}`,
    to: user.email,
    subject: `Confirmation Agri-Tech Academy · ${course.title}`,
    status: 'mock-queued',
    createdAt: payment.paidAt,
    preview: `Bonjour ${user.name}, votre accès à ${course.title} est activé. Référence paiement : ${payment.id}.`
  };

  writeCollection(EMAIL_OUTBOX_KEY, [email, ...readCollection(EMAIL_OUTBOX_KEY)]);
  return email;
}
