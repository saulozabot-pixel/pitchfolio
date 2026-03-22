'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Download, RefreshCw, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/lib/useSettings';

const STYLES = [
  { id: 'professional', label: 'LinkedIn Pro', desc: 'Fundo limpo, iluminação de estúdio', color: 'from-blue-600 to-blue-800' },
  { id: 'executive', label: 'Executivo', desc: 'Terno formal, expressão confiante', color: 'from-slate-600 to-slate-900' },
  { id: 'creative', label: 'Criativo', desc: 'Moderno, bokeh colorido', color: 'from-purple-600 to-pink-600' },
  { id: 'casual', label: 'Casual Pro', desc: 'Amigável, luz natural', color: 'from-emerald-600 to-teal-700' },
];

export default function PhotoPage() {
  const { settings } = useSettings();
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [style, setStyle] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) { setError('Envie uma imagem (JPG, PNG, WEBP).'); return; }
    if (f.size > 10 * 1024 * 1024) { setError('Imagem muito grande. Máximo 10MB.'); return; }
    setFile(f);
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function generate() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('style', style);
      const res = await fetch('/api/photo', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar foto.');
      setResult(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `elite-cv-foto-${style}.jpg`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
              <Camera className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-black">Foto Profissional com IA</h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-xs font-bold border border-amber-400/30">PREMIUM</span>
          </div>
          <p className="text-gray-400 ml-11">Transforme qualquer selfie em uma foto profissional de LinkedIn em segundos.</p>
        </motion.div>

        {!settings.includePhoto && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Foto profissional está <strong>desativada</strong> nas suas configurações — ela não será incluída no currículo.{' '}
              <Link href="/settings" className="underline hover:text-yellow-300 transition-colors">Ativar nas configurações</Link>
            </span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Upload + Style */}
          <div className="space-y-4">

            {/* Upload */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div
                onClick={() => inputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={e => e.preventDefault()}
                className="relative border-2 border-dashed border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400/40 transition-colors group"
                style={{ minHeight: 280 }}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="preview" className="w-full object-cover rounded-2xl" style={{ maxHeight: 320 }} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <p className="text-white font-bold text-sm">Clique para trocar a foto</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-72 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-amber-400/10 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-300">Arraste sua foto aqui</p>
                      <p className="text-sm text-gray-500 mt-1">ou clique para selecionar</p>
                      <p className="text-xs text-gray-600 mt-2">JPG, PNG, WEBP — máx. 10MB</p>
                    </div>
                  </div>
                )}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            </motion.div>

            {/* Style picker */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-sm text-gray-400 font-semibold mb-3 uppercase tracking-wider">Estilo</p>
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${style === s.id ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${s.color} mb-2`} />
                    <p className="font-bold text-sm">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                    {style === s.id && <CheckCircle className="w-3.5 h-3.5 text-amber-400 mt-1" />}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Generate button */}
            <motion.button
              onClick={generate}
              disabled={!file || loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: !file || loading ? undefined : 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Gerando sua foto profissional...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Foto Profissional
                </>
              )}
            </motion.button>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-xl p-3">{error}</p>
            )}
          </div>

          {/* RIGHT: Result */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5" style={{ minHeight: 480 }}>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full gap-6 p-8" style={{ minHeight: 480 }}>
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
                      <Sparkles className="w-8 h-8 text-amber-400 absolute inset-0 m-auto" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">IA trabalhando...</p>
                      <p className="text-gray-400 text-sm mt-1">Isso leva cerca de 20-40 segundos</p>
                    </div>
                    <div className="w-full max-w-xs space-y-2">
                      {['Analisando rosto', 'Aplicando estilo profissional', 'Otimizando iluminação', 'Finalizando'].map((step, i) => (
                        <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4 }}
                          className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 space-y-4">
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={result} alt="Foto profissional gerada" className="w-full rounded-xl" />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-lg bg-green-500/90 text-white text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Gerada com IA
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={download}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Baixar foto
                      </button>
                      <button onClick={generate}
                        className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm flex items-center gap-2 transition-colors">
                        <RefreshCw className="w-4 h-4" /> Regerar
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Dica: use esta foto no seu currículo Elite CV ↑</p>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-4 p-8 text-center" style={{ minHeight: 480 }}>
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Camera className="w-10 h-10 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-400">Sua foto profissional aparece aqui</p>
                      <p className="text-sm text-gray-600 mt-1">Envie uma foto e clique em gerar</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
                      {['✅ Selfie vira headshot pro', '✅ 4 estilos disponíveis', '✅ Pronto para LinkedIn', '✅ Download em alta res'].map(tip => (
                        <div key={tip} className="text-xs text-gray-500 bg-white/5 rounded-lg p-2">{tip}</div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
