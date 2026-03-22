'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Upload, Mic, MicOff, Camera, CameraOff, Play, Square,
  RefreshCw, CheckCircle, Download, Trash2, AlertCircle, Settings2,
  ChevronDown, Film, Clock, FileVideo,
} from 'lucide-react';

/* ─── Constantes ─────────────────────────────────────────── */
const MAX_UPLOAD_MB = 200;
const MAX_RECORD_SECONDS = 120; // 2 min
const RESOLUTIONS = [
  { id: '1080p', label: '1080p HD', width: 1920, height: 1080 },
  { id: '720p',  label: '720p',     width: 1280, height: 720  },
  { id: '480p',  label: '480p',     width: 854,  height: 480  },
];
const TIPS = [
  '💡 Fale sobre sua maior conquista profissional',
  '💡 Mencione seu diferencial e o que você busca',
  '💡 Mantenha entre 60 e 90 segundos',
  '💡 Olhe direto para a câmera, não para a tela',
  '💡 Fundo neutro e boa iluminação fazem diferença',
];

type Mode = 'choose' | 'record' | 'upload';
type RecordState = 'idle' | 'countdown' | 'recording' | 'stopped';

/* ─── Helpers ─────────────────────────────────────────────── */
function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}
function fmtBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ═══════════════════════════════════════════════════════════ */
export default function MediaPage() {
  const [mode, setMode] = useState<Mode>('choose');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black">Video Pitch</h1>
            <span className="px-2 py-0.5 rounded-full bg-violet-400/20 text-violet-400 text-xs font-bold border border-violet-400/30">PREMIUM</span>
          </div>
          <p className="text-gray-400 ml-11">
            Grave ou envie seu vídeo de apresentação profissional — ele aparece direto no seu currículo Elite.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === 'choose' && <ChooseMode key="choose" onSelect={setMode} />}
          {mode === 'record'  && <RecordMode key="record"  onBack={() => setMode('choose')} />}
          {mode === 'upload'  && <UploadMode key="upload"  onBack={() => setMode('choose')} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Tela: escolha de modo ───────────────────────────────── */
function ChooseMode({ onSelect }: { onSelect: (m: Mode) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* Gravar */}
      <button
        onClick={() => onSelect('record')}
        className="group p-8 rounded-2xl border border-white/10 bg-white/3 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all text-left"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/20">
          <Camera className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Gravar agora</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-4">
          Use sua câmera e microfone para gravar um vídeo pitch direto pelo navegador. Ajuste resolução, tempo e visualize antes de salvar.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Até 2 min', 'Câmera ao vivo', 'Preview antes de salvar'].map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">{t}</span>
          ))}
        </div>
      </button>

      {/* Upload */}
      <button
        onClick={() => onSelect('upload')}
        className="group p-8 rounded-2xl border border-white/10 bg-white/3 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-left"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-amber-400/20">
          <Upload className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Fazer upload</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-4">
          Já tem um vídeo pronto? Envie aqui. Aceitamos os principais formatos, com conversão automática para o formato ideal do currículo.
        </p>
        <div className="flex flex-wrap gap-2">
          {['MP4, MOV, WebM', 'Máx. 200 MB', 'HD recomendado'].map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">{t}</span>
          ))}
        </div>
      </button>
    </motion.div>
  );
}

/* ─── Tela: gravar ────────────────────────────────────────── */
function RecordMode({ onBack }: { onBack: () => void }) {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const previewRef    = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef     = useRef<Blob[]>([]);
  const streamRef     = useRef<MediaStream | null>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [countdown,   setCountdown]   = useState(3);
  const [elapsed,     setElapsed]     = useState(0);
  const [blobUrl,     setBlobUrl]     = useState<string | null>(null);
  const [camOn,       setCamOn]       = useState(true);
  const [micOn,       setMicOn]       = useState(true);
  const [resolution,  setResolution]  = useState(RESOLUTIONS[1]); // 720p default
  const [showConfig,  setShowConfig]  = useState(false);
  const [tipIdx,      setTipIdx]      = useState(0);
  const [permError,   setPermError]   = useState<string | null>(null);

  /* Ciclo de dicas */
  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(id);
  }, []);

  /* Inicia câmera */
  const startCamera = useCallback(async () => {
    setPermError(null);
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: camOn ? { width: resolution.width, height: resolution.height } : false,
        audio: micOn,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setPermError('Permita acesso à câmera e microfone nas configurações do navegador.');
    }
  }, [camOn, micOn, resolution]);

  useEffect(() => { startCamera(); return () => streamRef.current?.getTracks().forEach(t => t.stop()); }, [startCamera]);

  /* Countdown → Record */
  function startCountdown() {
    setBlobUrl(null);
    setElapsed(0);
    setCountdown(3);
    setRecordState('countdown');
    let c = 3;
    const id = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) { clearInterval(id); beginRecording(); }
    }, 1000);
  }

  function beginRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp9' });
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url  = URL.createObjectURL(blob);
      setBlobUrl(url);
      if (previewRef.current) { previewRef.current.src = url; previewRef.current.load(); }
    };
    mr.start(500);
    mediaRecorder.current = mr;
    setRecordState('recording');
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev + 1 >= MAX_RECORD_SECONDS) { stopRecording(); return prev + 1; }
        return prev + 1;
      });
    }, 1000);
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorder.current?.stop();
    setRecordState('stopped');
  }

  function discard() {
    setBlobUrl(null);
    setElapsed(0);
    setRecordState('idle');
  }

  function downloadVideo() {
    if (!blobUrl) return;
    const a  = document.createElement('a');
    a.href   = blobUrl;
    a.download = 'elite-cv-video-pitch.webm';
    a.click();
  }

  const progress = Math.min((elapsed / MAX_RECORD_SECONDS) * 100, 100);

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">

      {/* Voltar */}
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1">
        ← Voltar
      </button>

      {permError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {permError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Câmera ao vivo — col 3 */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

            {/* Countdown overlay */}
            <AnimatePresence>
              {recordState === 'countdown' && (
                <motion.div
                  key="cd"
                  initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60"
                >
                  <span className="text-8xl font-black text-white drop-shadow-2xl">{countdown || '●'}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* REC badge */}
            {recordState === 'recording' && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                REC {fmtTime(elapsed)}
              </div>
            )}

            {/* Progress bar */}
            {recordState === 'recording' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setCamOn(v => !v); }}
              className={`p-3 rounded-xl border transition-all ${camOn ? 'border-white/10 bg-white/5 text-white' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}
            >
              {camOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => { setMicOn(v => !v); }}
              className={`p-3 rounded-xl border transition-all ${micOn ? 'border-white/10 bg-white/5 text-white' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}
            >
              {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <div className="flex-1" />

            {recordState === 'idle' && (
              <button type="button" onClick={startCountdown}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all">
                <Play className="w-4 h-4" /> Gravar
              </button>
            )}
            {recordState === 'recording' && (
              <button type="button" onClick={stopRecording}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 transition-colors">
                <Square className="w-4 h-4" /> Parar
              </button>
            )}
            {recordState === 'stopped' && (
              <>
                <button type="button" onClick={discard}
                  className="px-4 py-3 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-sm flex items-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" /> Descartar
                </button>
                <button type="button" onClick={startCountdown}
                  className="px-4 py-3 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-sm flex items-center gap-2 transition-colors">
                  <RefreshCw className="w-4 h-4" /> Regravar
                </button>
                <button type="button" onClick={downloadVideo}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all">
                  <Download className="w-4 h-4" /> Salvar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Painel lateral — col 2 */}
        <div className="lg:col-span-2 space-y-4">

          {/* Configurações */}
          <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
            <button type="button"
              onClick={() => setShowConfig(v => !v)}
              className="w-full flex items-center justify-between p-4 text-sm font-bold text-white hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-2"><Settings2 className="w-4 h-4 text-violet-400" /> Configurações</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showConfig ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showConfig && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-white/8 p-4 space-y-3"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Resolução</p>
                  {RESOLUTIONS.map(r => (
                    <button key={r.id} type="button"
                      onClick={() => { setResolution(r); startCamera(); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${resolution.id === r.id ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300' : 'bg-white/5 border border-transparent text-gray-400 hover:border-white/15'}`}
                    >
                      <span className="font-semibold">{r.label}</span>
                      <span className="text-xs opacity-60">{r.width}×{r.height}</span>
                      {resolution.id === r.id && <CheckCircle className="w-3.5 h-3.5 ml-2 text-violet-400" />}
                    </button>
                  ))}
                  <div className="pt-1 flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5" /> Máx. {fmtTime(MAX_RECORD_SECONDS)} de gravação
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dicas */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Dica do pitch</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIdx}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="text-sm text-gray-300 leading-relaxed"
              >
                {TIPS[tipIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Preview */}
          {blobUrl && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-green-500/20 bg-green-500/5 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-green-500/10">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold text-green-400">Gravação concluída</span>
              </div>
              <video ref={previewRef} controls playsInline className="w-full rounded-b-2xl" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tela: upload ────────────────────────────────────────── */
function UploadMode({ onBack }: { onBack: () => void }) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [file,    setFile]    = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const ACCEPTED = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'];

  function handleFile(f: File) {
    setError(null);
    if (!ACCEPTED.includes(f.type) && !f.name.match(/\.(mp4|mov|webm|mkv)$/i)) {
      setError('Formato não suportado. Use MP4, MOV, WebM ou MKV.');
      return;
    }
    if (f.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo ${MAX_UPLOAD_MB} MB.`);
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function discard() {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">

      <button onClick={onBack} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1">
        ← Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Drop zone — col 3 */}
        <div className="lg:col-span-3 space-y-4">
          {!preview ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-4 py-16 ${dragging ? 'border-amber-400/60 bg-amber-400/5' : 'border-white/10 hover:border-amber-400/30 hover:bg-white/3'}`}
            >
              <div className={`p-5 rounded-2xl transition-colors ${dragging ? 'bg-amber-400/15' : 'bg-white/5'}`}>
                <FileVideo className={`w-10 h-10 transition-colors ${dragging ? 'text-amber-400' : 'text-gray-500'}`} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-300">Arraste seu vídeo aqui</p>
                <p className="text-sm text-gray-500 mt-1">ou clique para selecionar</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm,.mkv"
                className="hidden"
                aria-label="Selecionar vídeo"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
              <div className="rounded-2xl overflow-hidden bg-black aspect-video">
                <video src={preview} controls playsInline className="w-full h-full object-contain" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={discard}
                  className="flex-1 py-3 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" /> Remover
                </button>
                <button type="button"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                  <CheckCircle className="w-4 h-4" /> Usar este vídeo
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Info lateral — col 2 */}
        <div className="lg:col-span-2 space-y-4">

          {/* Requisitos */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" /> Requisitos do vídeo
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                ['Formatos', 'MP4, MOV, WebM, MKV'],
                ['Tamanho máximo', `${MAX_UPLOAD_MB} MB`],
                ['Resolução mínima', '480p (854×480)'],
                ['Resolução recomendada', '720p ou 1080p'],
                ['Proporção', '16:9 (paisagem)'],
                ['Duração sugerida', '30 s – 2 min'],
                ['Codec recomendado', 'H.264 / AAC'],
              ].map(([label, value]) => (
                <li key={label} className="flex justify-between gap-2">
                  <span className="text-gray-600">{label}</span>
                  <span className="text-right font-medium text-gray-300">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Info do arquivo */}
          {file && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 space-y-2">
              <p className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Arquivo aceito
              </p>
              {[
                ['Nome', file.name.length > 28 ? file.name.slice(0, 25) + '...' : file.name],
                ['Tamanho', fmtBytes(file.size)],
                ['Tipo', file.type || 'video'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className="text-gray-300 font-medium">{v}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
