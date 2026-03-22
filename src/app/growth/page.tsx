'use client';

import { motion } from 'framer-motion';
import { Share2, Link2, Linkedin, Mail, QrCode, BarChart2, Users, Eye, ArrowUpRight, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const STATS = [
  { icon: Eye,   label: 'Visualizações',    value: '—',  color: 'text-cyan-500',    bg: 'bg-cyan-50'    },
  { icon: Users, label: 'Visitantes únicos', value: '—', color: 'text-violet-500',  bg: 'bg-violet-50'  },
  { icon: Share2,label: 'Compartilhamentos', value: '—', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
  { icon: BarChart2, label: 'Taxa de clique', value: '—', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const CHANNELS = [
  {
    label: 'LinkedIn',
    desc: 'Compartilhe no perfil e aumente sua visibilidade profissional.',
    icon: Linkedin,
    color: 'bg-blue-600',
    action: 'Compartilhar no LinkedIn',
  },
  {
    label: 'WhatsApp',
    desc: 'Envie seu portfólio direto para recrutadores e contatos.',
    icon: Share2,
    color: 'bg-green-500',
    action: 'Enviar pelo WhatsApp',
  },
  {
    label: 'E-mail',
    desc: 'Inclua o link no seu e-mail de candidatura profissional.',
    icon: Mail,
    color: 'bg-slate-700',
    action: 'Copiar para e-mail',
  },
];

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

      {/* Link do portfólio */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-cyan-500" /> Seu link público
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 font-mono truncate">
            https://{portfolioUrl}
          </div>
          <button onClick={copyLink}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${
              copied
                ? 'bg-green-50 border border-green-200 text-green-600'
                : 'pitch-gradient text-white shadow-md shadow-cyan-200 hover:opacity-90'
            }`}>
            {copied ? <><CheckCircle className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar link</>}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Publique seu portfólio para ativar o link personalizado. Disponível no plano <span className="text-cyan-600 font-semibold">Premium</span>.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
        <p className="text-xs text-slate-400 mt-3 text-center">As estatísticas ficam disponíveis após a publicação do portfólio.</p>
      </motion.div>

      {/* Canais de compartilhamento */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Compartilhar via</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHANNELS.map((c) => (
            <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-4`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-slate-900 text-sm mb-1">{c.label}</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.desc}</p>
              <button className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                {c.action} <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* QR Code placeholder */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <QrCode className="w-9 h-9 text-slate-400" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900 mb-1">QR Code do seu portfólio</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Coloque no seu cartão de visita, currículo impresso ou apresentações. Gerado automaticamente após a publicação.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-xl pitch-gradient text-white font-bold text-sm hover:opacity-90 transition-all shadow-md shadow-cyan-200 shrink-0">
          Gerar QR
        </button>
      </motion.div>
    </div>
  );
}
