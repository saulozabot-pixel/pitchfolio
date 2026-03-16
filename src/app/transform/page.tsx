'use client';

import { useChat } from 'ai/react';
import { Sparkles, Send, User, Briefcase, GraduationCap, Trophy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function TransformPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/transform',
  });

  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40">
          <Sparkles className="text-white w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black font-outfit text-white">CV Transformer <span className="text-purple-400">AI</span></h1>
        <p className="text-zinc-500 max-w-xl">
          Cole suas experiências atuais abaixo e veja nossa IA de Elite reconstruir seu perfil profissional com foco em alto impacto.
        </p>
      </div>

      {/* Chat Area */}
      <div className="space-y-6">
        {messages.length === 0 && !hasStarted && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PromptSuggestion 
              icon={User} 
              title="Perfil Profissional" 
              text="Aqui está meu resumo atual: [Cole seu texto]" 
              onClick={() => { handleInputChange({ target: { value: "Meu resumo profissional atual é: " } } as any); setHasStarted(true); }}
            />
            <PromptSuggestion 
              icon={Briefcase} 
              title="Experiência" 
              text="Transforme meus cargos anteriores nessas empresas: [Liste suas experiências]" 
              onClick={() => { handleInputChange({ target: { value: "Minhas experiências profissionais são: " } } as any); setHasStarted(true); }}
            />
          </div>
        )}

        <div className="space-y-4 pb-32">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={cn(
                "flex gap-4 p-6 rounded-[2rem] border animate-in fade-in slide-in-from-bottom-4 duration-500",
                m.role === 'user' ? "bg-white/5 border-white/10 ml-12" : "glass border-purple-500/20 mr-12"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                m.role === 'user' ? "bg-zinc-800" : "premium-gradient"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5 text-zinc-400" /> : <Sparkles className="w-5 h-5 text-white" />}
              </div>
              <div className="space-y-2 overflow-hidden">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {m.role === 'user' ? 'Você' : 'Elite CV Transformer'}
                </p>
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 p-6 rounded-[2rem] glass border-purple-500/20 mr-12 animate-pulse">
                <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 italic">Transformando...</p>
                    <div className="h-4 w-64 bg-white/5 rounded" />
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50">
        <form 
          onSubmit={handleSubmit}
          className="glass rounded-[2.5rem] p-2 flex items-center gap-2 border border-white/20 shadow-2xl shadow-black"
        >
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-white px-6 py-4 placeholder:text-zinc-600 font-medium"
            value={input}
            placeholder="Cole aqui seu histórico profissional..."
            onChange={handleInputChange}
          />
          <button 
            type="submit"
            disabled={isLoading || !input}
            className="w-14 h-14 rounded-[1.8rem] premium-gradient flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="text-white w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}

function PromptSuggestion({ icon: Icon, title, text, onClick }: { icon: any, title: string, text: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5 text-left hover:border-white/10 hover:bg-zinc-900/60 transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="text-purple-400 w-5 h-5" />
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed">{text}</p>
    </button>
  );
}
