'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Search, Crown, UserCheck, UserX, Gift, RefreshCw, MessageCircle, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const ADMIN_EMAIL = 'saulozabot@gmail.com';

interface UserRow {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  plan: string;
  status: string;
  expires_at: string | null;
  works_used: number;
  works_limit: number;
  admin_note: string | null;
  created_at: string;
}

const PLAN_COLORS: Record<string, string> = {
  trial:      'bg-slate-100 text-slate-600',
  free_link:  'bg-cyan-50 text-cyan-700',
  premium:    'bg-violet-50 text-violet-700',
  ilimitado:  'bg-fuchsia-50 text-fuchsia-700',
  influencer: 'bg-amber-50 text-amber-700',
  blocked:    'bg-red-50 text-red-700',
};

const STATUS_COLORS: Record<string, string> = {
  active:  'text-emerald-500',
  expired: 'text-orange-500',
  blocked: 'text-red-500',
  pending: 'text-slate-400',
};

export default function AdminPage() {
  const { user, isLoaded } = useUser();

  // Bloqueia acesso se não for o admin
  if (isLoaded && user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-2xl font-black text-slate-900">Acesso negado</p>
          <p className="text-sm text-slate-400">Área restrita ao administrador.</p>
        </div>
      </div>
    );
  }

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [grantModal, setGrantModal] = useState(false);
  const [grantPlan, setGrantPlan] = useState('influencer');
  const [grantDays, setGrantDays] = useState('30');
  const [grantReason, setGrantReason] = useState('influencer');
  const [grantNote, setGrantNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, premium: 0, blocked: 0 });

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);
    }
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.user_id.includes(search);
    const matchPlan = filterPlan === 'all' || u.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  async function handleGrant() {
    if (!selectedUser) return;
    setSaving(true);
    await fetch('/api/admin/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'grant',
        userId: selectedUser.user_id,
        email: selectedUser.email,
        plan: grantPlan,
        durationDays: grantDays ? parseInt(grantDays) : undefined,
        reason: grantReason,
        note: grantNote,
      }),
    });
    setSaving(false);
    setGrantModal(false);
    fetchUsers();
  }

  async function handleBlock(userId: string, reason: string) {
    setSaving(true);
    await fetch('/api/admin/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'block', userId, reason }),
    });
    setSaving(false);
    fetchUsers();
  }

  async function handleUnblock(userId: string) {
    setSaving(true);
    await fetch('/api/admin/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unblock', userId }),
    });
    setSaving(false);
    fetchUsers();
  }

  function formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }

  function isExpiringSoon(exp: string | null) {
    if (!exp) return false;
    return new Date(exp).getTime() - Date.now() < 3 * 86400000;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Painel Admin</h1>
          <p className="text-sm text-slate-400">Gerencie usuários, acessos e assinaturas</p>
        </div>
        <button type="button" onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: Users, color: 'text-slate-600' },
          { label: 'Ativos', value: stats.active, icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'Trial', value: stats.trial, icon: Gift, color: 'text-cyan-500' },
          { label: 'Premium+', value: stats.premium, icon: Crown, color: 'text-violet-500' },
          { label: 'Bloqueados', value: stats.blocked, icon: UserX, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Buscar por email ou nome..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-cyan-400"
          />
        </div>
        <select
          title="Filtrar por plano"
          value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 outline-none"
        >
          <option value="all">Todos os planos</option>
          <option value="trial">Trial</option>
          <option value="premium">Premium</option>
          <option value="ilimitado">Ilimitado</option>
          <option value="influencer">Influencer</option>
          <option value="blocked">Bloqueados</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Carregando usuários...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">Nenhum usuário encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Usuário</th>
                  <th className="px-4 py-3 text-left">Plano</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Expira</th>
                  <th className="px-4 py-3 text-left">Uso</th>
                  <th className="px-4 py-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 truncate max-w-[180px]">{u.name ?? '—'}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[180px]">{u.email ?? u.user_id.slice(0,16)+'...'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${PLAN_COLORS[u.plan] ?? 'bg-slate-100 text-slate-600'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-xs ${STATUS_COLORS[u.status] ?? 'text-slate-400'}`}>
                        {u.status}
                      </span>
                      {isExpiringSoon(u.expires_at) && u.status === 'active' && (
                        <span title="Vence em breve">
                          <AlertTriangle className="w-3 h-3 text-amber-400 inline ml-1" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(u.expires_at)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {u.works_limit === 999999 ? '∞' : `${u.works_used}/${u.works_limit}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* Liberar acesso */}
                        <button
                          type="button"
                          title="Liberar acesso"
                          onClick={() => { setSelectedUser(u); setGrantModal(true); }}
                          className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </button>

                        {/* Bloquear/Desbloquear */}
                        {u.status === 'blocked' ? (
                          <button
                            type="button" title="Desbloquear"
                            onClick={() => handleUnblock(u.user_id)}
                            className="w-7 h-7 rounded-lg bg-cyan-50 hover:bg-cyan-100 flex items-center justify-center"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
                          </button>
                        ) : (
                          <button
                            type="button" title="Bloquear"
                            onClick={() => {
                              const r = prompt('Motivo do bloqueio (ex: campanha encerrada):') ?? '';
                              if (r !== null) handleBlock(u.user_id, r);
                            }}
                            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                          >
                            <UserX className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        )}

                        {/* WhatsApp */}
                        {u.email && (
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`PitchFólio — ${u.name ?? u.email}`)}`}
                            target="_blank" rel="noopener noreferrer"
                            title="Enviar WhatsApp"
                            className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Liberar Acesso */}
      {grantModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-slate-900 text-lg">Liberar Acesso</h3>
            <div>
              <p className="text-xs text-slate-400 mb-1">Usuário</p>
              <p className="text-sm font-semibold text-slate-700">{selectedUser.name ?? selectedUser.email}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Plano</label>
                <select title="Plano a conceder" value={grantPlan} onChange={e => setGrantPlan(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-cyan-400">
                  <option value="influencer">Influencer (grátis)</option>
                  <option value="premium">Premium</option>
                  <option value="ilimitado">Ilimitado</option>
                  <option value="free_link">Link grátis</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Duração (dias) — vazio = sem limite</label>
                <input type="number" value={grantDays} onChange={e => setGrantDays(e.target.value)}
                  placeholder="Ex: 30, 90, 365"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Motivo</label>
                <select title="Motivo da concessão" value={grantReason} onChange={e => setGrantReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-cyan-400">
                  <option value="influencer">Influencer / Divulgação</option>
                  <option value="campanha">Campanha</option>
                  <option value="brinde">Brinde / Presente</option>
                  <option value="teste">Teste interno</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Nota interna</label>
                <input type="text" value={grantNote} onChange={e => setGrantNote(e.target.value)}
                  placeholder="Ex: @influencer123 — campanha Jan 2026"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-cyan-400" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setGrantModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">
                Cancelar
              </button>
              <button type="button" onClick={handleGrant} disabled={saving}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }}>
                {saving ? 'Salvando...' : 'Liberar Acesso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
