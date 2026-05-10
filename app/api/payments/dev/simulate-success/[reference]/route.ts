import { redirect } from 'next/navigation';
import { confirmPaymentAndEnroll } from '../../../../../../lib/payments/fulfillment';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type SimulateSuccessRouteProps = {
  params: Promise<{ reference: string }>;
};

export async function GET(_request: Request, { params }: SimulateSuccessRouteProps) {
  if (process.env.NODE_ENV === 'production') {
    redirect('/academy/payment/cancel');
  }

  const { reference } = await params;

  await confirmPaymentAndEnroll({
    provider: 'dev-simulated',
    reference,
    providerReference: reference,
    status: 'paid',
  });

  redirect('/academy/payment/success');
}
