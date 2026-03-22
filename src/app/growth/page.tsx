'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link2, Linkedin, Mail, QrCode, BarChart2, Users, Eye, ArrowUpRight, Copy, CheckCircle, Sparkles, Loader2, XCircle, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* ─── Gerador de sugestões (estilo Gmail) ─────────────────── */
function generateSuggestions(name: string): string[] {
  const base = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  if (!base) return [];
  const year = new Date().getFullYear();
  return [
    base,
    `${base}pro`,
    `${base}${year}`,
    `pitch${base}`,
    `${base}hq`,
    `${base}oficial`,
    `${base}cv`,
    `${base}io`,
  ].filter((s, i, arr) => s.length >= 3 && arr.indexOf(s) === i).slice(0, 6);
}

type Status = 'idle' | 'checking' | 'available' | 'taken';

interface Suggestion {
  username: string;
  status: Status;
}

/* ─── Stats ───────────────────────────────────────────────── */
const STATS = [
  { icon: Eye,      label: 'Visualizações',     value: '—', color: 'text-cyan-500',    bg: 'bg-cyan-50'    },
  { icon: Users,    label: 'Visitantes únicos',  value: '—', color: 'text-violet-500',  bg: 'bg-violet-50'  },
  { icon: Share2,   label: 'Compartilhamentos',  value: '—', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
  { icon: BarChart2,label: 'Taxa de clique',     value: '—', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const CHANNELS = [
  { label: 'LinkedIn', desc: 'Aumente sua visibilidade profissional.', icon: Linkedin, color: 'bg-blue-600' },
  { label: 'WhatsApp', desc: 'Envie direto para recrutadores e contatos.', icon: Share2, color: 'bg-green-500' },
  { label: 'E-mail',   desc: 'Inclua no seu e-mail de candidatura.', icon: Mail, color: 'bg-slate-700' },
];

/* ════════════════════════════════════════════════════════════ */
export default function GrowthPage() {
  const [copied, setCopied] = useState(false);
  const portfolioUrl = 'pitchfolio-ai.vercel.app/u/seu-nome';

  function copyLink() {
    navigator.clipboard.writeText(`https://${portfolioUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl pitch-gradient flex items-center justify-center shadow-md shadow-cyan-200">
            <Share2 className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-outfit">Viral Growth</h1>
        </div>
        <p className="text-slate-400 ml-[52px] text-sm">Compartilhe seu portfólio e acompanhe quem está te vendo.</p>
      </motion.div>

      {/* Claim your link — destaque principal */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <ClaimLink />
      </motion.div>

      {/* Link atual */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-cyan-500" /> Seu link público atual
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 font-mono truncate">
            https://{portfolioUrl}
          </div>
          <button type="button" onClick={copyLink}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${
              copied ? 'bg-green-50 border border-green-200 text-green-600' : 'pitch-gradient text-white shadow-md shadow-cyan-200 hover:opacity-90'
            }`}>
            {copied ? <><CheckCircle className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Estatísticas</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">Estatísticas disponíveis após a publicação do portfólio.</p>
      </motion.div>

      {/* Canais */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Compartilhar via</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHANNELS.map((c) => (
            <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-4`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-slate-900 text-sm mb-1">{c.label}</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.desc}</p>
              <button type="button" className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                Compartilhar <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* QR Code */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <QrCode className="w-9 h-9 text-slate-400" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900 mb-1">QR Code do seu portfólio</p>
          <p className="text-sm text-slate-400 leading-relaxed">Coloque no cartão de visita, currículo impresso ou apresentações.</p>
        </div>
        <button type="button" className="px-5 py-2.5 rounded-xl pitch-gradient text-white font-bold text-sm hover:opacity-90 transition-all shadow-md shadow-cyan-200 shrink-0">
          Gerar QR
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Componente: Claim Your Link ─────────────────────────── */
function ClaimLink() {
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function checkUsername(username: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      return data.available === true;
    } catch {
      return false;
    }
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
        setSuggestions(prev =>
          prev.map(s => s.username === username
            ? { ...s, status: available ? 'available' : 'taken' }
            : s
          )
        );
      }
    }, 400);
  }, [name]);

  return (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* Gradiente de fundo sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-fuchsia-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <p className="font-black text-slate-900 text-base">Seu link com seu nome</p>
              <span className="px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-600 text-[10px] font-black border border-fuchsia-200 uppercase tracking-wide">+R$5/mês</span>
            </div>
            <p className="text-sm text-slate-400">Digite seu nome e veja sugestões disponíveis — igual ao Gmail.</p>
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-5">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: João Silva"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium placeholder:text-slate-400 outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Sugestões */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Sugestões disponíveis</p>
              {suggestions.map((s) => (
                <motion.button
                  key={s.username}
                  type="button"
                  disabled={s.status === 'taken' || s.status === 'checking'}
                  onClick={() => setSelected(s.username)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                    selected === s.username
                      ? 'border-cyan-400 bg-cyan-50'
                      : s.status === 'available'
                      ? 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/50 cursor-pointer'
                      : s.status === 'taken'
                      ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                      : 'border-slate-100 bg-slate-50 cursor-wait'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon status={s.status} />
                    <span className="font-mono font-semibold text-slate-800">
                      <span className="text-slate-400">https://</span>{s.username}<span className="text-slate-400">.vercel.app</span>
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${
                    s.status === 'available' ? 'text-green-600' :
                    s.status === 'taken'     ? 'text-red-400' :
                    'text-slate-400'
                  }`}>
                    {s.status === 'available' ? 'Disponível ✓' :
                     s.status === 'taken'     ? 'Ocupado' :
                     'Verificando...'}
                  </span>
                </motion.button>
              ))}

              {/* CTA */}
              <AnimatePresence>
                {selected && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="pt-3 flex items-center gap-3">
                    <div className="flex-1 text-sm text-slate-600">
                      Selecionado: <span className="font-bold text-slate-900">{selected}.vercel.app</span>
                    </div>
                    <button type="button" className="px-6 py-3 rounded-xl pitch-gradient text-white font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-cyan-200">
                      <Zap className="w-4 h-4" /> Ativar por R$5/mês
                    </button>
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
