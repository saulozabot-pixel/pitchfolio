'use client';

import { Sparkles, Send, User, Briefcase, GraduationCap, Trophy, Paperclip, Image as ImageIcon, X, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { saveDraft, type CVData } from '@/lib/pitchStore';

type PendingImage = { dataUrl: string; mimeType: string };
type Message = {
  role: 'user' | 'assistant';
  text: string;
  image?: PendingImage;
};

export default function TransformPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [applying, setApplying] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function applyToTemplate() {
    const lastAI = [...messages].reverse().find(m => m.role === 'assistant' && m.text.length > 50);
    if (!lastAI) return;
    setApplying(true);
    try {
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lastAI.text }),
      });
      const data: CVData = await res.json();
      saveDraft(data);
      router.push('/templates');
    } catch {
      setApplying(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPendingFile(file);
    setPendingImage(null);
    e.target.value = '';
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImage(file);
    e.target.value = '';
  }

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPendingImage({ dataUrl, mimeType: file.type });
      setPendingFile(null);
      setFileName(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // Colar imagem com Ctrl+V
  function handlePaste(e: React.ClipboardEvent) {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    if (!imageItem) return;
    const file = imageItem.getAsFile();
    if (file) { e.preventDefault(); loadImage(file); }
  }

  async function extractAndSubmit(file: File, extra: string) {
    let text = extra.trim();
    setStreaming(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/extract-pdf', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.text) {
        text = text ? `${text}\n\n${data.text}` : data.text;
      } else if (!text) {
        setStreaming(false);
        setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Não foi possível extrair o texto do arquivo. Tente copiar e colar o conteúdo diretamente.' }]);
        setFileName(null);
        setPendingFile(null);
        return;
      }
    } catch {
      if (!text) {
        setStreaming(false);
        setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Erro ao ler o arquivo. Tente copiar e colar o conteúdo diretamente.' }]);
        setFileName(null);
        setPendingFile(null);
        return;
      }
    }

    setStreaming(false);
    if (text) await doSubmit(text, null);
  }

  async function doSubmit(text: string, image: PendingImage | null) {
    setInput('');
    setPendingFile(null);
    setFileName(null);
    setPendingImage(null);

    const userMsg: Message = { role: 'user', text, ...(image ? { image } : {}) };
    const next = [...messages, userMsg];
    setMessages(next);
    setStreaming(true);
    setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

    try {
      const apiMessages = next.map(m => ({
        role: m.role,
        content: m.text,
        ...(m.image ? { image: m.image } : {}),
      }));

      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const reply = await res.text();
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', text: reply };
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', text: '⚠️ Erro ao processar. Tente novamente.' };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  async function submit() {
    if (streaming) return;
    if (pendingImage) {
      await doSubmit(input.trim(), pendingImage);
    } else if (pendingFile) {
      await extractAndSubmit(pendingFile, input);
    } else {
      const text = input.trim();
      if (!text) return;
      await doSubmit(text, null);
    }
  }

  function setPrompt(text: string) { setInput(text); }

  const canSend = !streaming && (!!input.trim() || !!pendingFile || !!pendingImage);

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6" onPaste={handlePaste}>
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-8 pt-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-cyan-200 relative">
          <img src="/pitchfolio-icon.png" alt="PitchFólio" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight">
          Pitch<span className="pitch-gradient-text">Fólio</span> Transformer
        </h1>
        <p className="text-slate-500 max-w-lg text-base">
          Cole seus dados, anexe um arquivo ou <span className="text-slate-800 font-semibold">cole uma imagem</span> — a IA transforma em algo extraordinário.
        </p>
      </div>

      {/* Sugestões */}
      {messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <PromptSuggestion icon={Briefcase}     title="Carreira"   text="CV básico → perfil PitchFólio."           onClick={() => setPrompt('Aqui estão meus dados profissionais para transformação: ')} />
          <PromptSuggestion icon={GraduationCap} title="Acadêmico"  text="Tese ou paper → nível Masterpiece."     onClick={() => setPrompt('Aqui está o resumo do meu trabalho acadêmico: ')} />
          <PromptSuggestion icon={Trophy}        title="Livro"      text="Capa épica e sinopse impactante."       onClick={() => setPrompt('Tenho uma ideia de livro. Detalhes para a capa: ')} />
          <PromptSuggestion icon={Sparkles}      title="Evento"     text="Convite extraordinário para seu evento." onClick={() => setPrompt('Vou realizar um evento. Detalhes para o convite: ')} />
        </div>
      )}

      {/* Mensagens */}
      <div className="space-y-4 pb-36">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex gap-4 p-6 rounded-2xl border",
            m.role === 'user'
              ? "bg-white border-slate-200 ml-8"
              : "bg-cyan-50/60 border-cyan-100 mr-8"
          )}>
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              m.role === 'user' ? "bg-slate-100" : "pitch-gradient"
            )}>
              {m.role === 'user'
                ? <User className="w-4 h-4 text-slate-500" />
                : <Sparkles className="w-4 h-4 text-white" />}
            </div>
            <div className="space-y-2 overflow-hidden flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">
                {m.role === 'user' ? 'Você' : 'PitchFólio AI'}
              </p>
              {m.image && (
                <img src={m.image.dataUrl} alt="imagem enviada" className="max-h-48 rounded-xl border border-slate-200 object-contain" />
              )}
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                {m.text}
                {streaming && i === messages.length - 1 && m.role === 'assistant' && (
                  <span className="inline-block w-1.5 h-4 bg-cyan-400 ml-1 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Botão Aplicar ao Template — aparece após IA responder */}
        {!streaming && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1].text.length > 50 && (
          <div className="flex justify-center pt-2 pb-4">
            <button
              type="button"
              onClick={applyToTemplate}
              disabled={applying}
              className="flex items-center gap-2 px-6 py-3 rounded-xl pitch-gradient text-white font-bold text-sm shadow-lg shadow-cyan-200 hover:opacity-90 hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {applying ? 'Preparando template…' : 'Aplicar ao Template'}
            </button>
          </div>
        )}

        {streaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-4 p-6 rounded-2xl bg-cyan-50/60 border border-cyan-100 mr-8 animate-pulse">
            <div className="w-9 h-9 rounded-xl pitch-gradient flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="space-y-2 pt-1 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Processando...</p>
              <div className="h-3 w-56 bg-slate-200 rounded-full" />
              <div className="h-3 w-40 bg-slate-100 rounded-full opacity-50" />
            </div>
          </div>
        )}
      </div>

      {/* Input fixo */}
      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+0.5rem)] md:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40">
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xl shadow-slate-200/60">
          {/* Preview de imagem colada */}
          {pendingImage && (
            <div className="relative inline-block mb-2 ml-1">
              <img src={pendingImage.dataUrl} alt="preview" className="h-20 rounded-xl border border-slate-200 object-contain" />
              <button
                type="button"
                onClick={() => setPendingImage(null)}
                title="Remover imagem"
                className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 text-white rounded-full flex items-center justify-center hover:bg-slate-900"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Inputs ocultos */}
            <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.doc,.docx" className="hidden" aria-label="Upload de arquivo" onChange={handleFile} />
            <input ref={imgRef} type="file" accept="image/*" className="hidden" aria-label="Upload de imagem" onChange={handleImageFile} />

            {/* Botão PDF/doc */}
            <button type="button" onClick={() => fileRef.current?.click()} title="Anexar PDF ou DOCX" className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0">
              <Paperclip className="w-4 h-4 text-slate-500" />
            </button>

            {/* Botão imagem */}
            <button type="button" onClick={() => imgRef.current?.click()} title="Anexar imagem (ou Ctrl+V para colar)" className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0">
              <ImageIcon className="w-4 h-4 text-slate-500" />
            </button>

            <div className="flex-1 flex flex-col justify-center">
              {fileName && (
                <span className="text-xs text-cyan-600 font-semibold px-1 pb-1 flex items-center gap-1">
                  <Paperclip className="w-3 h-3" /> {fileName}
                  <button type="button" title="Remover arquivo" onClick={() => { setFileName(null); setPendingFile(null); }} className="ml-1 text-slate-400 hover:text-slate-700"><X className="w-3 h-3" /></button>
                </span>
              )}
              {pendingImage && !fileName && (
                <span className="text-xs text-fuchsia-600 font-semibold px-1 pb-1 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Imagem pronta para enviar
                </span>
              )}
              <input
                className="bg-transparent border-none text-slate-800 px-1 py-3 placeholder:text-slate-400 font-medium text-sm outline-none w-full"
                value={input}
                placeholder={pendingImage ? 'Adicione uma nota (opcional) e envie…' : 'Cole aqui seus dados ou ideia bruta… (Ctrl+V para imagem)'}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
              />
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              aria-label="Enviar mensagem"
              className="w-12 h-12 rounded-xl pitch-gradient flex items-center justify-center transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-md shadow-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptSuggestion({ icon: Icon, title, text, onClick }: { icon: React.ElementType; title: string; text: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="p-5 rounded-2xl bg-white border border-slate-200 text-left hover:border-cyan-300 hover:shadow-md hover:shadow-cyan-100 transition-all group">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Icon className="text-cyan-500 w-4 h-4" />
      </div>
      <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed">{text}</p>
    </button>
  );
}
