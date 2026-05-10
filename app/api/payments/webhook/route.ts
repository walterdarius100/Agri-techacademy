import { NextResponse } from 'next/server';
import { confirmPaymentAndEnroll } from '../../../../lib/payments/fulfillment';
import { parseProviderWebhook } from '../../../../lib/payments/providers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const confirmation = await parseProviderWebhook(request);
    const payment = await confirmPaymentAndEnroll(confirmation);

    return NextResponse.json({
      received: true,
      paymentId: payment.id,
      status: payment.status,
    });
  } catch (error) {
    console.error('[payments:webhook]', error);

    return NextResponse.json(
      {
        received: false,
        error: error instanceof Error ? error.message : 'Erreur webhook inconnue.',
      },
      { status: 400 },
    );
  }
}
