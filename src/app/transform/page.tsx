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
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-12 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 premium-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/40 rotate-3">
          <Sparkles className="text-white w-10 h-10" />
        </div>
        <h1 className="text-5xl font-black font-outfit text-white tracking-tighter">
          Elite Creator <span className="text-purple-400">AI</span>
        </h1>
        <p className="text-zinc-500 max-w-xl text-lg font-medium">
          Transforme qualquer dado bruto em um ativo <span className="text-white italic">Extraordinário</span>.
          De currículos a capas de livros e convites épicos.
        </p>
      </div>

      {/* Sugestões */}
      {messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <PromptSuggestion icon={Briefcase}     title="Carreira"   text="Transforme meu CV básico em um perfil de Elite."     onClick={() => setPrompt('Aqui estão meus dados profissionais para transformação em CV de Elite: ')} />
          <PromptSuggestion icon={GraduationCap} title="Acadêmico"  text="Eleve minha tese ou paper para o nível Masterpiece."  onClick={() => setPrompt('Aqui está o resumo do meu trabalho acadêmico: ')} />
          <PromptSuggestion icon={Trophy}        title="Publishing" text="Crie uma capa épica e sinopse para meu livro."        onClick={() => setPrompt('Tenho uma ideia de livro. Detalhes para a capa: ')} />
          <PromptSuggestion icon={Sparkles}      title="Eventos"    text="Gere um convite extraordinário para meu evento."      onClick={() => setPrompt('Vou realizar um evento. Detalhes para o convite: ')} />
        </div>
      )}

      {/* Mensagens */}
      <div className="space-y-6 pb-36">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex gap-6 p-8 rounded-[2.5rem] border backdrop-blur-md",
            m.role === 'user'
              ? "bg-white/5 border-white/10 ml-12"
              : "bg-purple-500/5 border-purple-500/20 mr-12"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
              m.role === 'user' ? "bg-zinc-800" : "premium-gradient"
            )}>
              {m.role === 'user' ? <User className="w-6 h-6 text-zinc-400" /> : <Sparkles className="w-6 h-6 text-white" />}
            </div>
            <div className="space-y-2 overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                {m.role === 'user' ? 'Input do Criador' : 'Processamento Elite'}
              </p>
              <div className="text-zinc-200 leading-relaxed whitespace-pre-wrap text-base">
                {m.text}
                {streaming && i === messages.length - 1 && m.role === 'assistant' && (
                  <span className="inline-block w-2 h-5 bg-purple-400 ml-1 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          </div>
        ))}

        {streaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-6 p-8 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/20 mr-12 animate-pulse">
            <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-3 pt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Arquitetando o Extraordinário...</p>
              <div className="h-4 w-64 bg-white/5 rounded-full" />
              <div className="h-4 w-48 bg-white/5 rounded-full opacity-50" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
        <div className="glass rounded-[3rem] p-3 flex items-center gap-3 border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
          {/* Upload oculto */}
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
            title="Anexar arquivo (TXT, DOC)"
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 ml-2"
          >
            <Paperclip className="w-5 h-5 text-zinc-400" />
          </button>
          <div className="flex-1 flex flex-col justify-center">
            {fileName && (
              <span className="text-xs text-purple-400 font-semibold px-2 pb-1 flex items-center gap-1">
                <Paperclip className="w-3 h-3" /> {fileName}
                <button type="button" onClick={() => setFileName(null)} className="ml-1 text-zinc-500 hover:text-white">✕</button>
              </span>
            )}
            <input
              className="bg-transparent border-none text-white px-2 py-5 placeholder:text-zinc-600 font-bold text-lg outline-none w-full"
              value={input}
              placeholder="Cole aqui seus dados ou ideia bruta..."
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
            />
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={streaming || !input.trim()}
            aria-label="Enviar mensagem"
            className="w-16 h-16 rounded-[2rem] premium-gradient flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-xl shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="text-white w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PromptSuggestion({ icon: Icon, title, text, onClick }: { icon: React.ElementType; title: string; text: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5 text-left hover:border-white/10 hover:bg-zinc-900/60 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="text-purple-400 w-5 h-5" />
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed">{text}</p>
    </button>
  );
}
