// Chamado após login do Clerk para criar/buscar subscription
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSubscription } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, name } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });

    const subscription = await getOrCreateSubscription(userId, email, name);
    return NextResponse.json({ subscription });
  } catch (e) {
    console.error('Auth sync error:', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
