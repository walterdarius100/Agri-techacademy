'use server';

import { redirect } from 'next/navigation';
import { buildAbsoluteUrl } from '../../../../lib/payments/urls';
import { createCheckoutSession } from '../../../../lib/payments/checkout';

export async function startCoursePayment(courseSlug: string) {
  const result = await createCheckoutSession({
    courseSlug,
    successUrl: buildAbsoluteUrl('/academy/payment/success'),
    cancelUrl: buildAbsoluteUrl('/academy/payment/cancel'),
  });

  redirect(result.redirectUrl);
}
