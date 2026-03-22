import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('username, display_name, is_public')
    .eq('user_id', clerkUser.id)
    .single();

  if (!data) return NextResponse.json({ username: null });

  return NextResponse.json({
    username: data.username,
    displayName: data.display_name,
    isPublic: data.is_public,
    url: data.username ? `https://pitchfolio-ai.vercel.app/u/${data.username}` : null,
  });
}
