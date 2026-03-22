import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { grantAccess, blockAccess, unblockAccess } from '@/lib/supabaseAdmin';
import type { Plan } from '@/lib/supabaseAdmin';

const ADMIN_EMAIL = 'saulozabot@gmail.com';

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (user?.emailAddresses?.[0]?.emailAddress !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { action, userId, email, plan, durationDays, reason, note } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId e action são obrigatórios' }, { status: 400 });
    }

    switch (action) {
      case 'grant':
        await grantAccess(userId, email ?? '', plan as Plan, durationDays, reason, note);
        break;
      case 'block':
        await blockAccess(userId, reason);
        break;
      case 'unblock':
        await unblockAccess(userId);
        break;
      default:
        return NextResponse.json({ error: 'Action inválida' }, { status: 400 });
    }

    return NextResponse.json({ success: true, action, userId });
  } catch (e) {
    console.error('Admin access error:', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
