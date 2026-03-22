'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link2, ExternalLink, Mail, QrCode, BarChart2, Users, Eye, ArrowUpRight, Copy, CheckCircle, Sparkles, Loader2, XCircle, Zap, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function generateSuggestions(name: string): string[] {
  const base = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  if (!base) return [];
  const year = new Date().getFullYear();
  return [base, `${base}pro`, `${base}${year}`, `pitch${base}`, `${base}hq`, `${base}oficial`, `${base}cv`, `${base}io`]
    .filter((s, i, arr) => s.length >= 3 && arr.indexOf(s) === i).slice(0, 6);
}

type Status = 'idle' | 'checking' | 'available' | 'taken';
interface Suggestion { username: string; status: Status; }

const STATS = [
  { icon: Eye,       label: 'Visualizações',    value: '—', color: 'text-cyan-500',    bg: 'bg-cyan-50'    },
  { icon: Users,     label: 'Visitantes únicos', value: '—', color: 'text-violet-500',  bg: 'bg-violet-50'  },
  { icon: Share2,    label: 'Compartilhamentos', value: '—', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
  { icon: BarChart2, label: 'Taxa de clique',    value: '—', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function GrowthPage() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const portfolioUrl = activeUsername
    ? `pitchfolio-ai.vercel.app/u/${activeUsername}`
    : 'pitchfolio-ai.vercel.app/u/seu-nome';

  const fullUrl = `https://${portfolioUrl}`;

  // Busca username ativo do usuário
  useEffect(() => {
    if (!user) return;
    fetch('/api/profile/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.username) setActiveUsername(d.username); })
      .catch(() => {});
  }, [user]);

  // Gera QR code usando API gratuita
  useEffect(() => {
    if (!activeUsername) return;
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`);
  }, [activeUsername, fullUrl]);

  function copyLink() {
    navigator.clipboard.writeText(fullUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, '_blank');
  }

  function shareWhatsApp() {
    const msg = encodeURIComponent(`Confira meu portfólio profissional criado com IA: ${fullUrl}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  function shareEmail() {
    const subject = encodeURIComponent('Meu portfólio profissional — PitchFólio');
    const body = encodeURIComponent(`Olá,\n\nCompartilho meu portfólio profissional criado com IA:\n${fullUrl}\n\nCriado com PitchFólio.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function downloadQR() {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `pitchfolio-qrcode-${activeUsername}.png`;
    a.click();
  }

  const CHANNELS = [
    { label: 'LinkedIn', desc: 'Aumente sua visibilidade profissional.', icon: ExternalLink, color: 'bg-blue-600', action: shareLinkedIn },
    { label: 'WhatsApp', desc: 'Envie direto para recrutadores e contatos.', icon: Share2, color: 'bg-green-500', action: shareWhatsApp },
    { label: 'E-mail',   desc: 'Inclua no seu e-mail de candidatura.', icon: Mail, color: 'bg-slate-700', action: shareEmail },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 md:space-y-8">

      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-cyan-200">
            <img src="/pitchfolio-icon.png" alt="PitchFólio" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-outfit">Viral Growth</h1>
        </div>
        <p className="text-slate-400 ml-[52px] text-sm">Compartilhe seu portfólio e acompanhe quem está te vendo.</p>
      </motion.div>

      {/* Claim link */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <ClaimLink onClaimed={setActiveUsername} currentUsername={activeUsername} />
      </motion.div>

      {/* Link atual */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-cyan-500" /> Seu link público atual
        </p>
        <div className="flex items-center gap-3">
          <div className={`flex-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm font-mono truncate ${activeUsername ? 'border-cyan-200 text-cyan-700' : 'border-slate-200 text-slate-400'}`}>
            https://{portfolioUrl}
          </div>
          <button type="button" onClick={copyLink}
            className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${
              copied ? 'bg-green-50 border border-green-200 text-green-600' : 'pitch-gradient text-white shadow-md shadow-cyan-200 hover:opacity-90'
            }`}>
            {copied ? <><CheckCircle className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Estatísticas</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">Estatísticas disponíveis após publicar com link personalizado.</p>
      </motion.div>

      {/* Compartilhar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Compartilhar via</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHANNELS.map((c) => (
            <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-4`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-slate-900 text-sm mb-1">{c.label}</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.desc}</p>
              <button type="button" onClick={c.action}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                Compartilhar <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* QR Code */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-5 flex-wrap">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
          {qrUrl
            ? <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
            : <QrCode className="w-9 h-9 text-slate-300" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 mb-1">QR Code do seu portfólio</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            {qrUrl ? 'Pronto! Baixe e use no cartão de visita ou currículo.' : 'Disponível após ativar seu link personalizado.'}
          </p>
        </div>
        <button type="button" onClick={qrUrl ? downloadQR : undefined}
          disabled={!qrUrl}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 transition-all ${
            qrUrl ? 'pitch-gradient text-white shadow-md shadow-cyan-200 hover:opacity-90' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}>
          {qrUrl ? <><Download className="w-4 h-4" /> Baixar QR</> : <><QrCode className="w-4 h-4" /> Gerar QR</>}
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Componente: Claim Your Link ─────────────────────────── */
function ClaimLink({ onClaimed, currentUsername }: { onClaimed: (u: string) => void; currentUsername: string | null }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function checkUsername(username: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      return data.available === true;
    } catch { return false; }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = name.trim();
    if (!trimmed) { setSuggestions([]); return; }
    const list = generateSuggestions(trimmed);
    setSuggestions(list.map(u => ({ username: u, status: 'checking' })));
    debounceRef.current = setTimeout(async () => {
      for (const username of list) {
        const available = await checkUsername(username);
        setSuggestions(prev => prev.map(s => s.username === username ? { ...s, status: available ? 'available' : 'taken' } : s));
      }
    }, 400);
  }, [name]);

  async function handleActivate() {
    if (!selected) return;
    setActivating(true);
    setError('');
    try {
      const res = await fetch('/api/claim-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.upgrade) router.push('/pricing');
        else setError(data.error ?? 'Erro ao ativar');
        return;
      }
      onClaimed(selected);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setActivating(false);
    }
  }

  if (currentUsername) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
        <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <p className="font-black text-slate-900 text-sm">Link personalizado ativo!</p>
          <p className="text-sm text-slate-500 font-mono mt-0.5">pitchfolio-ai.vercel.app/u/<strong className="text-emerald-600">{currentUsername}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-fuchsia-100/60 rounded-full blur-3xl" />
      </div>
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <p className="font-black text-slate-900 text-base">Seu link com seu nome</p>
              <span className="px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-600 text-[10px] font-black border border-fuchsia-200 uppercase tracking-wide">R$7,99 único</span>
            </div>
            <p className="text-sm text-slate-400">Digite seu nome e veja sugestões disponíveis — igual ao Gmail.</p>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Ex: João Silva"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium placeholder:text-slate-400 outline-none focus:border-cyan-400 transition-colors" />
        </div>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Sugestões disponíveis</p>
              {suggestions.map((s) => (
                <motion.button key={s.username} type="button"
                  disabled={s.status === 'taken' || s.status === 'checking'}
                  onClick={() => setSelected(s.username)}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                    selected === s.username ? 'border-cyan-400 bg-cyan-50'
                    : s.status === 'available' ? 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/50 cursor-pointer'
                    : s.status === 'taken' ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                    : 'border-slate-100 bg-slate-50 cursor-wait'
                  }`}>
                  <div className="flex items-center gap-3">
                    <StatusIcon status={s.status} />
                    <span className="font-mono font-semibold text-slate-800 text-xs md:text-sm">
                      <span className="text-slate-400">...vercel.app/u/</span>{s.username}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${s.status === 'available' ? 'text-green-600' : s.status === 'taken' ? 'text-red-400' : 'text-slate-400'}`}>
                    {s.status === 'available' ? 'Disponível ✓' : s.status === 'taken' ? 'Ocupado' : 'Verificando...'}
                  </span>
                </motion.button>
              ))}

              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pt-3 space-y-2">
                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-sm text-slate-600 truncate">
                        <span className="font-bold text-slate-900">...vercel.app/u/{selected}</span>
                      </div>
                      <button type="button" onClick={handleActivate} disabled={activating}
                        className="px-5 py-3 rounded-xl pitch-gradient text-white font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-cyan-200 disabled:opacity-60 shrink-0">
                        {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {activating ? 'Ativando...' : 'Ativar link →'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status === 'checking')  return <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />;
  if (status === 'available') return <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
  if (status === 'taken')     return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
  return null;
}
