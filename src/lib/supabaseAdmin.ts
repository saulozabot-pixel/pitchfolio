import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization — evita falha no build sem env vars
let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return _client;
}

// Alias para compatibilidade
export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
};

export type Plan = 'trial' | 'free_link' | 'premium' | 'ilimitado' | 'influencer' | 'blocked';
export type Status = 'active' | 'expired' | 'blocked' | 'pending';

export interface Subscription {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  plan: Plan;
  period: string | null;
  status: Status;
  expires_at: string | null;
  trial_started: string;
  works_used: number;
  works_limit: number;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

const TRIAL_DAYS = 7;
const WORKS_LIMITS: Record<Plan, number> = {
  trial:      5,
  free_link:  3,
  premium:    30,
  ilimitado:  999999,
  influencer: 999999,
  blocked:    0,
};

// Busca ou cria subscription do usuário
export async function getOrCreateSubscription(
  userId: string,
  email?: string,
  name?: string
): Promise<Subscription> {
  const { data: existing } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Verifica se trial expirou
    if (existing.plan === 'trial' && existing.expires_at) {
      const expired = new Date(existing.expires_at) < new Date();
      if (expired && existing.status === 'active') {
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('user_id', userId);
        return { ...existing, status: 'expired' };
      }
    }
    return existing;
  }

  // Novo usuário → trial de 7 dias
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TRIAL_DAYS);

  const { data: created, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      email: email ?? null,
      name: name ?? null,
      plan: 'trial',
      status: 'active',
      expires_at: expiresAt.toISOString(),
      works_limit: WORKS_LIMITS.trial,
    })
    .select('*')
    .single();

  if (error) throw error;
  return created;
}

// Verifica se usuário tem acesso ativo
export async function checkAccess(userId: string): Promise<{
  allowed: boolean;
  plan: Plan;
  reason?: string;
  expiresAt?: string;
}> {
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!data) return { allowed: false, plan: 'trial', reason: 'Usuário não encontrado' };

  if (data.status === 'blocked') {
    return { allowed: false, plan: 'blocked', reason: 'Acesso bloqueado pelo administrador' };
  }

  if (data.status === 'expired') {
    return { allowed: false, plan: data.plan, reason: 'Assinatura expirada', expiresAt: data.expires_at };
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    await supabaseAdmin.from('subscriptions').update({ status: 'expired' }).eq('user_id', userId);
    return { allowed: false, plan: data.plan, reason: 'Assinatura expirada', expiresAt: data.expires_at };
  }

  return { allowed: true, plan: data.plan, expiresAt: data.expires_at ?? undefined };
}

// Admin: listar todos os usuários com status
export async function listAllUsers(page = 0, limit = 50) {
  const { data, count } = await supabaseAdmin
    .from('subscriptions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  return { users: data ?? [], total: count ?? 0 };
}

// Admin: conceder acesso manual (influencer, brinde)
export async function grantAccess(
  userId: string,
  email: string,
  plan: Plan = 'influencer',
  durationDays?: number,
  reason?: string,
  note?: string
) {
  const expiresAt = durationDays
    ? new Date(Date.now() + durationDays * 86400000).toISOString()
    : null;

  // Salva override
  await supabaseAdmin.from('access_overrides').insert({
    user_id: userId, email, type: 'grant', plan, reason, expires_at: expiresAt, admin_note: note,
  });

  // Atualiza subscription
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId, email, plan, status: 'active',
      expires_at: expiresAt, works_limit: WORKS_LIMITS[plan],
      admin_note: note ?? reason,
    }, { onConflict: 'user_id' });

  if (error) throw error;
}

// Admin: bloquear acesso
export async function blockAccess(userId: string, reason?: string) {
  await supabaseAdmin.from('access_overrides').insert({
    user_id: userId, type: 'block', reason, admin_note: reason,
  });
  await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'blocked', admin_note: reason ?? 'Bloqueado pelo admin' })
    .eq('user_id', userId);
}

// Admin: desbloquear (restaura trial ou plano anterior)
export async function unblockAccess(userId: string) {
  await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'active', admin_note: null })
    .eq('user_id', userId);
}

// Ativar plano após pagamento PIX
export async function activatePlan(
  reference: string,
  plan: string,
  period: string,
  userId?: string
) {
  const planKey = plan as Plan;
  const periodMonths: Record<string, number> = {
    mensal: 1, semestral: 6, anual: 12, unico: 0,
  };
  const months = periodMonths[period] ?? 1;
  const expiresAt = months > 0
    ? new Date(Date.now() + months * 30 * 86400000).toISOString()
    : null;

  // Atualiza pagamento
  await supabaseAdmin
    .from('pix_payments')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('reference', reference);

  // Se tiver userId, ativa subscription
  if (userId) {
    await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId, plan: planKey, period, status: 'active',
        expires_at: expiresAt, works_limit: WORKS_LIMITS[planKey],
      }, { onConflict: 'user_id' });
  }
}

// Renovação: busca assinaturas que vencem em 3 dias
export async function getExpiringSubscriptions() {
  const in3days = new Date(Date.now() + 3 * 86400000).toISOString();
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .not('plan', 'in', '("trial","influencer")')
    .lt('expires_at', in3days)
    .gt('expires_at', new Date().toISOString());
  return data ?? [];
}
