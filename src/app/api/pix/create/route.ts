import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const PUSHINPAY_TOKEN = process.env.PUSHINPAY_TOKEN!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://pitchfolio-ai.vercel.app';

const PLAN_VALUES: Record<string, Record<string, number>> = {
  link:      { unico: 799 },
  premium:   { mensal: 2990, semestral: 17940, anual: 23880 },
  ilimitado: { mensal: 5990, semestral: 35940, anual: 47880 },
};

export async function POST(req: NextRequest) {
  try {
    const { plan, period } = await req.json();

    // Pega usuário autenticado via Clerk
    const clerkUser = await currentUser();
    const userId = clerkUser?.id ?? null;
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;

    const planPrices = PLAN_VALUES[plan];
    if (!planPrices) return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });

    const periodKey = period ?? 'unico';
    const value = planPrices[periodKey];
    if (!value) return NextResponse.json({ error: 'Período inválido' }, { status: 400 });

    // Referência única para identificar o pagamento
    const ref = `PF-${plan.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Salva pagamento pendente no Supabase antes de chamar PushinPay
    await supabaseAdmin.from('pix_payments').insert({
      user_id: userId,
      email: userEmail,
      reference: ref,
      plan,
      period: periodKey,
      value_cents: value,
      status: 'pending',
    });

    const resp = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PUSHINPAY_TOKEN}`,
      },
      body: JSON.stringify({
        value,
        webhook_url: `${APP_URL}/api/pix/webhook`,
        external_reference: ref,
        split_rules: [],
        payer: userEmail ? { email: userEmail } : undefined,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('PushinPay error:', err);
      return NextResponse.json({ error: 'Erro ao gerar PIX' }, { status: 500 });
    }

    const data = await resp.json();

    // Salva pushinpay_id recebido
    await supabaseAdmin.from('pix_payments')
      .update({ pushinpay_id: data.id })
      .eq('reference', ref);

    return NextResponse.json({
      id: data.id,
      qrCode: data.qr_code,
      qrCodeImage: data.qr_code_image,
      reference: ref,
      value,
      plan,
      period: periodKey,
      status: data.status,
    });
  } catch (e) {
    console.error('PIX create error:', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
