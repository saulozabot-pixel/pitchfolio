import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { username } = await req.json();
  if (!username || !/^[a-z0-9-]{3,30}$/.test(username)) {
    return NextResponse.json({ error: 'Username inválido' }, { status: 400 });
  }

  // Verifica se já existe
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (existing) return NextResponse.json({ error: 'Username já está em uso' }, { status: 409 });

  // Verifica se o usuário tem plano free_link ou superior
  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', clerkUser.id)
    .single();

  const allowedPlans = ['free_link', 'premium', 'ilimitado', 'influencer'];
  if (!sub || !allowedPlans.includes(sub.plan) || sub.status !== 'active') {
    return NextResponse.json({ error: 'Plano não permite link personalizado', upgrade: true }, { status: 403 });
  }

  // Cria ou atualiza profile
  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert({
      user_id: clerkUser.id,
      username,
      display_name: clerkUser.fullName ?? clerkUser.firstName ?? username,
      is_public: true,
    }, { onConflict: 'user_id' });

  if (error) return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });

  return NextResponse.json({ success: true, username, url: `https://pitchfolio-ai.vercel.app/u/${username}` });
}
