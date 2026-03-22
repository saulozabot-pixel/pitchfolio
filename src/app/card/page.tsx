'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Download, Palette, QrCode, User, Mail, Phone, Briefcase,
  Check, Loader2, Lock, Sparkles, Camera, ScanLine, X,
} from 'lucide-react';

interface CardData {
  name: string; title: string; company: string;
  email: string; phone: string; username: string;
}

const THEMES = [
  { id: 'pitch',   label: 'PitchFólio',     bg: 'linear-gradient(135deg,#0f172a,#1e293b)',   accent:'linear-gradient(135deg,#06b6d4,#a855f7,#ec4899)', text:'#fff',     sub:'#94a3b8', border:'rgba(6,182,212,0.3)',    qrBg:'1e293b', qrColor:'06b6d4' },
  { id: 'minimal', label: 'Minimal Pro',     bg: '#ffffff',                                   accent:'linear-gradient(135deg,#0f172a,#334155)',           text:'#0f172a', sub:'#64748b', border:'#e2e8f0',                qrBg:'f8fafc', qrColor:'0f172a' },
  { id: 'ocean',   label: 'Ocean Blue',      bg: 'linear-gradient(135deg,#0369a1,#0e7490)',   accent:'linear-gradient(135deg,#38bdf8,#fff)',              text:'#fff',     sub:'#bae6fd', border:'rgba(186,230,253,0.3)',  qrBg:'0369a1', qrColor:'ffffff' },
  { id: 'rose',    label: 'Rose Dark',       bg: 'linear-gradient(135deg,#1c1c1e,#2d1b2e)',   accent:'linear-gradient(135deg,#f472b6,#c084fc)',           text:'#fff',     sub:'#e879f9', border:'rgba(244,114,182,0.3)',  qrBg:'2d1b2e', qrColor:'f472b6' },
  { id: 'gold',    label: 'Executive Gold',  bg: 'linear-gradient(135deg,#1a1200,#2d1f00)',   accent:'linear-gradient(135deg,#f59e0b,#fbbf24)',           text:'#fff',     sub:'#fcd34d', border:'rgba(245,158,11,0.3)',   qrBg:'2d1f00', qrColor:'f59e0b' },
  { id: 'forest',  label: 'Forest Green',    bg: 'linear-gradient(135deg,#052e16,#14532d)',   accent:'linear-gradient(135deg,#4ade80,#86efac)',           text:'#fff',     sub:'#bbf7d0', border:'rgba(74,222,128,0.3)',   qrBg:'052e16', qrColor:'4ade80' },
];

const SAMPLE: CardData = {
  name: 'João Paulo Silva', title: 'Diretor de Marketing', company: 'TechCorp',
  email: 'joao@techcorp.com.br', phone: '+55 11 99999-0000', username: 'joaopaulo',
};

export default function CardPage() {
  const { user } = useUser();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<'gallery' | 'editor'>('gallery');
  const [theme, setTheme] = useState(THEMES[0]);
  const [data, setData] = useState<CardData>({ name:'', title:'', company:'', email:'', phone:'', username:'' });
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [creatingPix, setCreatingPix] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  useEffect(() => {
    if (!user) return;
    setData(prev => ({
      ...prev,
      name: user.fullName ?? user.firstName ?? '',
      email: user.emailAddresses?.[0]?.emailAddress ?? '',
    }));
    fetch('/api/profile/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.username) setData(prev => ({ ...prev, username: d.username })); })
      .catch(() => {});
    try {
      const draft = localStorage.getItem('pitchfolio_draft');
      if (draft) {
        const p = JSON.parse(draft);
        if (p.title) setData(prev => ({ ...prev, title: p.title }));
        if (p.company) setData(prev => ({ ...prev, company: p.company }));
        if (p.phone) setData(prev => ({ ...prev, phone: p.phone }));
      }
      if (localStorage.getItem('pitchfolio_card_paid') === '1') {
        setView('editor');
      }
    } catch {}
  }, [user]);

  const portfolioUrl = data.username
    ? `https://pitchfolio-ai.vercel.app/u/${data.username}`
    : 'https://pitchfolio-ai.vercel.app';

  function qrSrc(t: typeof THEMES[0], d: CardData) {
    const url = d.username
      ? `https://pitchfolio-ai.vercel.app/u/${d.username}`
      : 'https://pitchfolio-ai.vercel.app';
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=${t.qrColor}&bgcolor=${t.qrBg}&data=${encodeURIComponent(url)}`;
  }

  async function download() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `pitchfolio-card-${data.name.replace(/\s+/g,'-').toLowerCase() || 'cartao'}.png`;
      a.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  }

  async function buyCard() {
    setCreatingPix(true);
    try {
      const res = await fetch('/api/pix/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'card', period: 'unico' }),
      });
      const d = await res.json();
      if (d.reference) router.push(`/pricing/checkout/card?ref=${d.reference}&value=4990`);
    } catch { setCreatingPix(false); }
  }

  async function handleScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanError('');
    setScanning(true);
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      const res = await fetch('/api/card/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      });
      const extracted = await res.json();
      if (!res.ok) { setScanError(extracted.error ?? 'Erro ao escanear'); return; }
      setData(prev => ({
        name:    extracted.name    || prev.name,
        title:   extracted.title   || prev.title,
        company: extracted.company || prev.company,
        email:   extracted.email   || prev.email,
        phone:   extracted.phone   || prev.phone,
        username: prev.username,
      }));
    } catch { setScanError('Erro de conexão. Tente novamente.'); }
    finally { setScanning(false); if (fileRef.current) fileRef.current.value = ''; }
  }

  /* ─── GALLERY VIEW ──────────────────────────────────────── */
  if (view === 'gallery') {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl pitch-gradient flex items-center justify-center shadow-md shadow-cyan-200">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-outfit">Cartão Digital</h1>
          </div>
          <p className="text-slate-400 ml-[52px] text-sm">
            Cartão de visitas digital com QR code em PNG de alta resolução — 6 modelos exclusivos.
          </p>
        </motion.div>

        {/* Showcase dos modelos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEMES.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <MiniCard theme={t} data={SAMPLE} />
              <p className="text-xs font-bold text-center text-slate-500 mt-2">{t.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-center text-white shadow-xl">
          <div className="w-12 h-12 pitch-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-cyan-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black mb-2">6 modelos + QR personalizado</h2>
          <p className="text-slate-400 text-sm mb-1">Inclui scanner de cartão físico com IA</p>
          <p className="text-slate-400 text-sm mb-5">Tire foto do seu cartão atual e transforme em digital</p>

          <div className="flex flex-wrap justify-center gap-3 mb-5">
            {['6 temas exclusivos', 'PNG 3x alta resolução', 'QR code por tema', 'Scanner de cartão físico', 'Gerações ilimitadas', 'Pagamento único'].map(f => (
              <span key={f} className="flex items-center gap-1.5 text-xs bg-white/10 rounded-full px-3 py-1">
                <Check className="w-3 h-3 text-cyan-400" />{f}
              </span>
            ))}
          </div>

          <div className="mb-4">
            <span className="text-4xl font-black">R$49,90</span>
            <span className="text-slate-400 text-sm ml-2">pagamento único</span>
          </div>

          <button type="button" onClick={() => setShowPaywall(true)}
            className="px-8 py-4 rounded-2xl pitch-gradient text-white font-black text-base shadow-lg shadow-cyan-500/30 hover:opacity-90 transition-all">
            Desbloquear Agora →
          </button>
        </motion.div>

        {/* Paywall modal */}
        <PaywallModal show={showPaywall} onClose={() => setShowPaywall(false)} onBuy={buyCard} loading={creatingPix} />
      </div>
    );
  }

  /* ─── EDITOR VIEW ───────────────────────────────────────── */
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl pitch-gradient flex items-center justify-center shadow-md shadow-cyan-200">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-outfit">Cartão Digital</h1>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black uppercase tracking-wide">Premium</span>
        </div>
        <p className="text-slate-400 ml-[52px] text-sm">Personalize, escanear cartão físico ou baixe em PNG.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Preview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex flex-col items-center gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider self-start">Preview</p>

          {/* Card para captura — inline styles necessários para html-to-image */}
          <div ref={cardRef} style={{
            width:'100%', maxWidth:380, background:theme.bg, border:`1px solid ${theme.border}`,
            borderRadius:24, overflow:'hidden', aspectRatio:'1.75/1', position:'relative',
            padding:28, display:'flex', flexDirection:'column', justifyContent:'space-between',
            fontFamily:'system-ui,-apple-system,sans-serif', boxShadow:'0 24px 48px rgba(0,0,0,0.2)',
          }}>
            <div style={{ position:'absolute',top:-60,right:-60,width:200,height:200,borderRadius:'50%',background:theme.accent,opacity:0.08 }} />
            <div style={{ position:'absolute',bottom:-40,left:-40,width:130,height:130,borderRadius:'50%',background:theme.accent,opacity:0.06 }} />
            <div style={{ position:'relative',zIndex:1 }}>
              <div style={{ display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:999,background:'rgba(255,255,255,0.08)',border:`1px solid ${theme.border}`,marginBottom:10 }}>
                <span style={{ fontSize:9,fontWeight:800,letterSpacing:1,textTransform:'uppercase',background:theme.accent,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>PitchFólio</span>
              </div>
              <div style={{ fontSize:22,fontWeight:900,color:theme.text,lineHeight:1.1,marginBottom:4 }}>{data.name||'Seu Nome'}</div>
              <div style={{ fontSize:12,color:theme.sub,fontWeight:600 }}>{data.title||'Cargo / Especialidade'}{data.company?` · ${data.company}`:''}</div>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',position:'relative',zIndex:1 }}>
              <div style={{ display:'flex',flexDirection:'column',gap:5 }}>
                {data.email&&<div style={{ display:'flex',alignItems:'center',gap:6,fontSize:10,color:theme.sub }}><span style={{opacity:0.7}}>✉</span>{data.email}</div>}
                {data.phone&&<div style={{ display:'flex',alignItems:'center',gap:6,fontSize:10,color:theme.sub }}><span style={{opacity:0.7}}>✆</span>{data.phone}</div>}
                {data.username&&<div style={{ display:'flex',alignItems:'center',gap:6,fontSize:10,color:theme.sub }}><span style={{opacity:0.7}}>⬡</span>pitchfolio-ai.vercel.app/u/{data.username}</div>}
              </div>
              <div style={{ width:64,height:64,borderRadius:12,overflow:'hidden',background:`#${theme.qrBg}`,padding:4,flexShrink:0 }}>
                <img src={qrSrc(theme, data)} alt="QR" width={56} height={56} style={{ width:'100%',height:'100%',objectFit:'contain',display:'block' }} />
              </div>
            </div>
          </div>

          <button type="button" onClick={download} disabled={downloading}
            className={`w-full max-w-sm py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${downloaded?'bg-green-500 text-white shadow-green-200':'pitch-gradient text-white shadow-cyan-200 hover:opacity-90'} disabled:opacity-60`}>
            {downloading?<><Loader2 className="w-4 h-4 animate-spin"/>Gerando...</>
             :downloaded?<><Check className="w-4 h-4"/>Baixado!</>
             :<><Download className="w-4 h-4"/>Baixar PNG (alta resolução)</>}
          </button>
        </motion.div>

        {/* Painel */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="space-y-4">

          {/* Scanner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ScanLine className="w-3.5 h-3.5" /> Escanear cartão físico com IA
            </p>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Tire uma foto do seu cartão de visitas físico e a IA extrai automaticamente todas as informações.
            </p>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" aria-label="Selecionar foto do cartão" title="Selecionar foto do cartão" onChange={handleScan} />
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={scanning}
                className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-60">
                {scanning?<><Loader2 className="w-4 h-4 animate-spin"/>Escaneando...</>:<><Camera className="w-4 h-4"/>Tirar foto</>}
              </button>
              <button type="button" onClick={() => { if (fileRef.current) { fileRef.current.removeAttribute('capture'); fileRef.current.click(); setTimeout(()=>fileRef.current?.setAttribute('capture','environment'),500); } }} disabled={scanning}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-60">
                <ScanLine className="w-4 h-4"/>Galeria
              </button>
            </div>
            {scanError && <p className="text-xs text-red-500 font-medium mt-2">{scanError}</p>}
            {scanning && <p className="text-xs text-cyan-600 font-medium mt-2 text-center">IA extraindo informações do cartão...</p>}
          </div>

          {/* Temas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" /> Tema
            </p>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(t => (
                <button key={t.id} type="button" onClick={() => setTheme(t)}
                  className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all ${theme.id===t.id?'border-cyan-400 scale-105 shadow-md':'border-transparent hover:border-slate-300'}`}
                  style={{ background: t.bg }}>
                  {theme.id===t.id&&<div className="absolute inset-0 flex items-center justify-center"><Check className="w-4 h-4 text-white drop-shadow-md" /></div>}
                  <span className="sr-only">{t.label}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {THEMES.map(t => <span key={t.id} className={`text-center text-[10px] font-semibold ${theme.id===t.id?'text-cyan-600':'text-slate-400'}`}>{t.label}</span>)}
            </div>
          </div>

          {/* Campos */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><User className="w-3.5 h-3.5"/>Dados do cartão</p>
            <Field icon={User}     placeholder="Nome completo"          value={data.name}    onChange={v=>setData(p=>({...p,name:v}))} />
            <Field icon={Briefcase} placeholder="Cargo / Especialidade" value={data.title}   onChange={v=>setData(p=>({...p,title:v}))} />
            <Field icon={Briefcase} placeholder="Empresa (opcional)"    value={data.company} onChange={v=>setData(p=>({...p,company:v}))} />
            <Field icon={Mail}     placeholder="E-mail"                 value={data.email}   onChange={v=>setData(p=>({...p,email:v}))} />
            <Field icon={Phone}    placeholder="Telefone (opcional)"    value={data.phone}   onChange={v=>setData(p=>({...p,phone:v}))} />
          </div>

          {/* QR info */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 flex items-start gap-3">
            <QrCode className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 text-sm">QR Code → portfólio</p>
              <p className="text-xs text-slate-500 mt-0.5 break-all">{portfolioUrl}</p>
              {!data.username && <a href="/growth" className="text-xs text-cyan-600 font-semibold underline mt-1 block">Ativar link personalizado →</a>}
            </div>
          </div>
        </motion.div>
      </div>

      <PaywallModal show={showPaywall} onClose={() => setShowPaywall(false)} onBuy={buyCard} loading={creatingPix} />
    </div>
  );
}

/* ─── Mini card para galeria ────────────────────────────────── */
function MiniCard({ theme, data }: { theme: typeof THEMES[0]; data: CardData }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&color=${theme.qrColor}&bgcolor=${theme.qrBg}&data=https://pitchfolio-ai.vercel.app`;
  return (
    <div style={{
      background:theme.bg, border:`1px solid ${theme.border}`, borderRadius:16,
      padding:16, aspectRatio:'1.75/1', position:'relative', overflow:'hidden',
      display:'flex', flexDirection:'column', justifyContent:'space-between',
      fontFamily:'system-ui,sans-serif', boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
    }}>
      <div style={{ position:'absolute',top:-40,right:-40,width:120,height:120,borderRadius:'50%',background:theme.accent,opacity:0.1 }} />
      <div style={{ position:'relative',zIndex:1 }}>
        <div style={{ fontSize:11,fontWeight:900,color:theme.text,marginBottom:2 }}>{data.name}</div>
        <div style={{ fontSize:9,color:theme.sub }}>{data.title} · {data.company}</div>
      </div>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',position:'relative',zIndex:1 }}>
        <div style={{ display:'flex',flexDirection:'column',gap:3 }}>
          <div style={{ fontSize:8,color:theme.sub }}>{data.email}</div>
          <div style={{ fontSize:8,color:theme.sub }}>{data.phone}</div>
        </div>
        <div style={{ width:36,height:36,borderRadius:8,overflow:'hidden',background:`#${theme.qrBg}`,padding:2 }}>
          <img src={qr} alt="QR" style={{ width:'100%',height:'100%',display:'block' }} />
        </div>
      </div>
      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors rounded-2xl">
        <Lock className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
      </div>
    </div>
  );
}

/* ─── Paywall Modal ─────────────────────────────────────────── */
function PaywallModal({ show, onClose, onBuy, loading }: { show: boolean; onClose: ()=>void; onBuy: ()=>void; loading: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          onClick={onClose}>
          <motion.div initial={{y:60,opacity:0}} animate={{y:0,opacity:1}} exit={{y:60,opacity:0}}
            onClick={e=>e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 pitch-gradient rounded-2xl flex items-center justify-center shadow-md shadow-cyan-200">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <button type="button" onClick={onClose} aria-label="Fechar"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-1">Cartão Digital Premium</h2>
            <p className="text-sm text-slate-400 mb-4">6 modelos + scanner de cartão físico com IA</p>
            <div className="space-y-2 mb-5">
              {['6 temas exclusivos','PNG 3x alta resolução','QR code personalizado por tema','Scanner de cartão físico com IA','Gerações ilimitadas','Pagamento único — sem mensalidade'].map(f=>(
                <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0"/>{f}
                </div>
              ))}
            </div>
            <div className="text-center mb-4">
              <span className="text-3xl font-black text-slate-900">R$49,90</span>
              <span className="text-slate-400 text-sm ml-1">pagamento único</span>
            </div>
            <button type="button" onClick={onBuy} disabled={loading}
              className="w-full py-3.5 rounded-2xl pitch-gradient text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-cyan-200 hover:opacity-90 disabled:opacity-60">
              {loading?<><Loader2 className="w-4 h-4 animate-spin"/>Gerando PIX...</>:'Pagar com PIX →'}
            </button>
            <button type="button" onClick={onClose} className="w-full py-2 mt-2 text-sm text-slate-400 hover:text-slate-600 transition-colors">
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon: Icon, placeholder, value, onChange }: { icon: React.ElementType; placeholder: string; value: string; onChange: (v:string)=>void }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-cyan-400 transition-colors">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none font-medium" />
    </div>
  );
}
