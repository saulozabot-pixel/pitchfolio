'use client';

import { Sparkles, Send, User, Briefcase, GraduationCap, Trophy, Paperclip } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'assistant'; text: string };

export default function TransformPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPendingFile(file);
    e.target.value = '';
  }

  async function extractAndSubmit(file: File, extra: string) {
    let text = extra.trim();
    setStreaming(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/extract-pdf', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.text) text = text ? text + '\n\n' + data.text : data.text;
    } catch {
      // se falhar extração, usa só o texto digitado
    }

    setStreaming(false);
    if (text) await doSubmit(text);
  }

  async function doSubmit(text: string) {
    setInput('');
    setPendingFile(null);
    setFileName(null);
    const next: Message[] = [...messages, { role: 'user', text }];
    setMessages(next);
    setStreaming(true);
    setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.text })) }),
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
    if (pendingFile) {
      await extractAndSubmit(pendingFile, input);
    } else {
      const text = input.trim();
      if (!text) return;
      await doSubmit(text);
    }
  }

  function setPrompt(text: string) { setInput(text); }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-8 pt-4">
        <div className="w-16 h-16 pitch-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-200">
          <Sparkles className="text-white w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight">
          Pitch<span className="pitch-gradient-text">Fólio</span> Transformer
        </h1>
        <p className="text-slate-500 max-w-lg text-base">
          Cole seus dados ou anexe um arquivo — a IA transforma em algo <span className="text-slate-800 font-semibold">extraordinário</span>.
        </p>
      </div>

      {/* Sugestões */}
      {messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <PromptSuggestion icon={Briefcase}     title="Carreira"   text="CV básico → perfil de Elite."           onClick={() => setPrompt('Aqui estão meus dados profissionais para transformação em CV de Elite: ')} />
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
            <div className="space-y-1 overflow-hidden flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">
                {m.role === 'user' ? 'Você' : 'PitchFólio AI'}
              </p>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                {m.text}
                {streaming && i === messages.length - 1 && m.role === 'assistant' && (
                  <span className="inline-block w-1.5 h-4 bg-cyan-400 ml-1 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          </div>
        ))}

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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50">
        <div className="bg-white rounded-2xl p-2.5 flex items-center gap-2 border border-slate-200 shadow-xl shadow-slate-200/60">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.pdf,.doc,.docx"
            className="hidden"
            aria-label="Upload de arquivo"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            title="Anexar arquivo (PDF, DOCX, TXT)"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
          >
            <Paperclip className="w-4 h-4 text-slate-500" />
          </button>
          <div className="flex-1 flex flex-col justify-center">
            {fileName && (
              <span className="text-xs text-cyan-600 font-semibold px-1 pb-1 flex items-center gap-1">
                <Paperclip className="w-3 h-3" /> {fileName}
                <button type="button" onClick={() => { setFileName(null); setPendingFile(null); }} className="ml-1 text-slate-400 hover:text-slate-700">✕</button>
              </span>
            )}
            <input
              className="bg-transparent border-none text-slate-800 px-1 py-3 placeholder:text-slate-400 font-medium text-sm outline-none w-full"
              value={input}
              placeholder="Cole aqui seus dados ou ideia bruta..."
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
            />
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={streaming || (!input.trim() && !pendingFile)}
            aria-label="Enviar mensagem"
            className="w-12 h-12 rounded-xl pitch-gradient flex items-center justify-center transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-md shadow-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="text-white w-5 h-5" />
          </button>
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
