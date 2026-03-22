import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const RESERVED = ['admin','api','app','pitchfolio','suporte','contato','login',
  'dashboard','templates','transform','growth','photo','media','settings','pricing','u'];

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')?.toLowerCase().trim();

  if (!username || !/^[a-z0-9-]{3,30}$/.test(username)) {
    return NextResponse.json({ available: false, error: 'Nome inválido (3-30 caracteres, só letras/números/hífen)' });
  }

  if (RESERVED.includes(username)) {
    return NextResponse.json({ available: false, username, reason: 'reservado' });
  }

  // Checa no Supabase se já está em uso
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  return NextResponse.json({ available: !data, username });
}
