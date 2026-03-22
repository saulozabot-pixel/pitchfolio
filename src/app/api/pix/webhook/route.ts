import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { supabaseAdmin, activatePlan } from '@/lib/supabaseAdmin';

const PUSHINPAY_TOKEN = process.env.PUSHINPAY_TOKEN!;

function validateSignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac('sha256', PUSHINPAY_TOKEN)
    .update(body)
    .digest('hex');
  return signature === expected;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-pushinpay-signature');

    // Valida assinatura — rejeita webhooks não autorizados
    if (!validateSignature(rawBody, signature)) {
      console.warn('Webhook com assinatura inválida rejeitado');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    console.log('PushinPay webhook:', JSON.stringify(payload));

    const { status, external_reference, id } = payload;

    if (status === 'paid' && external_reference) {
      // Busca o pagamento para pegar userId e plano
      const { data: payment } = await supabaseAdmin
        .from('pix_payments')
        .select('*')
        .eq('reference', external_reference)
        .single();

      // Extrai plan/period da referência: PF-PREMIUM-MENSAL-timestamp-code
      const parts = external_reference.split('-');
      const plan = payment?.plan ?? parts[1]?.toLowerCase() ?? 'premium';
      const period = payment?.period ?? parts[2]?.toLowerCase() ?? 'mensal';

      // Planos avulsos (card, link) não alteram subscription — apenas marcam pagamento
      if (plan !== 'card') {
        await activatePlan(external_reference, plan, period, payment?.user_id);
      } else {
        // Cartão digital: marca pix_payment como pago
        await supabaseAdmin
          .from('pix_payments')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('reference', external_reference);
      }

      // Salva webhook raw
      await supabaseAdmin
        .from('pix_payments')
        .update({ webhook_raw: payload, pushinpay_id: id })
        .eq('reference', external_reference);

      console.log(`✅ PIX PAGO — ref: ${external_reference} | plano: ${plan} | período: ${period}`);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Webhook error:', e);
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}

// Polling: verifica se pagamento foi confirmado
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  if (!ref) return NextResponse.json({ paid: false });

  const { data } = await supabaseAdmin
    .from('pix_payments')
    .select('status, plan, period, paid_at')
    .eq('reference', ref)
    .single();

  return NextResponse.json({
    paid: data?.status === 'paid',
    details: data ?? null,
  });
}
