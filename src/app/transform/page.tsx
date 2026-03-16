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
      <div className="flex flex-col items-center text-center space-y-4 mb-12 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 premium-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/40 rotate-3">
          <Sparkles className="text-white w-10 h-10" />
        </div>
        <h1 className="text-5xl font-black font-outfit text-white tracking-tighter">Elite Creator <span className="text-purple-400">AI</span></h1>
        <p className="text-zinc-500 max-w-xl text-lg font-medium">
          Transforme qualquer dado bruto em um ativo <span className="text-white italic">Extraordinário</span>. 
          De currículos a capas de livros e convites épicos.
        </p>
      </div>

      {/* Chat Area */}
      <div className="space-y-8">
        {messages.length === 0 && !hasStarted && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <PromptSuggestion 
              icon={Briefcase} 
              title="Carreira" 
              text="Transforme meu CV básico em um perfil de Elite." 
              onClick={() => { handleInputChange({ target: { value: "Aqui estão meus dados profissionais para transformação em CV de Elite: " } } as any); setHasStarted(true); }}
            />
            <PromptSuggestion 
              icon={GraduationCap} 
              title="Acadêmico" 
              text="Eleve minha tese ou paper para o nível Masterpiece." 
              onClick={() => { handleInputChange({ target: { value: "Aqui está o resumo do meu trabalho acadêmico para transformação: " } } as any); setHasStarted(true); }}
            />
            <PromptSuggestion 
              icon={Trophy} 
              title="Publishing" 
              text="Crie uma capa épica e sinopse para meu livro." 
              onClick={() => { handleInputChange({ target: { value: "Tenho uma ideia de livro. Aqui estão os detalhes para a capa: " } } as any); setHasStarted(true); }}
            />
             <PromptSuggestion 
              icon={Sparkles} 
              title="Eventos" 
              text="Gere um convite extraordinário para meu evento." 
              onClick={() => { handleInputChange({ target: { value: "Vou realizar um evento. Aqui estão os detalhes para o convite: " } } as any); setHasStarted(true); }}
            />
          </div>
        )}

        <div className="space-y-6 pb-32">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={cn(
                "flex gap-6 p-8 rounded-[2.5rem] border backdrop-blur-md transition-all duration-500",
                m.role === 'user' ? "bg-white/5 border-white/10 ml-12" : "bg-purple-500/5 border-purple-500/20 mr-12 shadow-[0_0_50px_rgba(168,85,247,0.05)]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                m.role === 'user' ? "bg-zinc-800 text-zinc-400" : "premium-gradient text-white"
              )}>
                {m.role === 'user' ? <User className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <div className="space-y-3 overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  {m.role === 'user' ? 'Input do Criador' : 'Processamento Elite'}
                </p>
                <div className="text-zinc-200 leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none text-lg">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-6 p-8 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/20 mr-12 animate-pulse">
                <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Arquitetando o Extraordinário...</p>
                    <div className="h-4 w-64 bg-white/5 rounded-full" />
                    <div className="h-4 w-48 bg-white/5 rounded-full opacity-50" />
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
        <form 
          onSubmit={handleSubmit}
          className="glass rounded-[3rem] p-3 flex items-center gap-3 border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
        >
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-white px-8 py-5 placeholder:text-zinc-600 font-bold text-lg"
            value={input}
            placeholder="Cole aqui seus dados ou ideia bruta..."
            onChange={handleInputChange}
          />
          <button 
            type="submit"
            disabled={isLoading || !input}
            className="w-16 h-16 rounded-[2rem] premium-gradient flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-xl shadow-purple-500/20"
          >
            <Send className="text-white w-7 h-7" />
          </button>
        </form>
      </div>
    </div>
  );
}
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
