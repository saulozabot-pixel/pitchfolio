import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { listAllUsers } from '@/lib/supabaseAdmin';

const ADMIN_EMAIL = 'saulozabot@gmail.com';

export async function GET() {
  const user = await currentUser();
  if (user?.emailAddresses?.[0]?.emailAddress !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
  try {
    const { users, total } = await listAllUsers();

    const stats = {
      total,
      active:  users.filter(u => u.status === 'active').length,
      trial:   users.filter(u => u.plan === 'trial').length,
      premium: users.filter(u => ['premium','ilimitado','influencer'].includes(u.plan)).length,
      blocked: users.filter(u => u.status === 'blocked').length,
    };

    return NextResponse.json({ users, stats });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}
