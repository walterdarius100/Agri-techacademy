'use client';

import { useEffect } from 'react';

const ENROLLMENTS_KEY = 'agritech.academy.enrollments.v1';
const PAYMENTS_KEY = 'agritech.academy.payments.v1';

function readJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function SuccessRecorder({ payment }) {
  useEffect(() => {
    const enrollments = readJson(ENROLLMENTS_KEY, []);
    const existingEnrollment = enrollments.some((item) => item.courseSlug === payment.courseSlug);

    if (!existingEnrollment) {
      window.localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify([
        ...enrollments,
        {
          courseSlug: payment.courseSlug,
          status: 'active',
          source: 'mock-payment',
          reference: payment.reference,
          enrolledAt: payment.date
        }
      ]));
    }

    const payments = readJson(PAYMENTS_KEY, []);
    const existingPayment = payments.some((item) => item.reference === payment.reference);

    if (!existingPayment) {
      window.localStorage.setItem(PAYMENTS_KEY, JSON.stringify([payment, ...payments]));
    }
  }, [payment]);

  return null;
}
