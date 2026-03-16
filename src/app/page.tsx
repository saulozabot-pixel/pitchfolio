import { Sparkles, FileText, Video, Share2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden p-12 rounded-[2.5rem] bg-zinc-900/40 border border-white/5">
        <div className="absolute top-0 right-0 p-8">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="text-purple-400 w-6 h-6" />
          </div>
        </div>
        
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            IA Powered Resume Transformer
          </div>
          <h2 className="text-5xl font-black font-outfit text-white leading-tight">
            Stop Sending Resumes. <br />
            <span className="text-transparent bg-clip-text premium-gradient">Start Sending Experiences.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Nossa IA transforma seus dados profissionais em uma Landing Page extraordinária, com vídeo, interatividade e design de elite.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button className="px-8 py-4 rounded-2xl premium-gradient text-white font-bold shadow-2xl shadow-purple-500/20 hover:scale-105 transition-transform">
              Transformar Agora
            </button>
            <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              Ver Templates <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={FileText}
          title="Conteúdo de Impacto"
          description="Nossa IA reescreve suas experiências focando em resultados extraordinários e keywords estratégicas."
        />
        <FeatureCard 
          icon={Video}
          title="Video Pitch"
          description="Grave sua apresentação diretamente na plataforma e destaque-se com sua personalidade."
        />
        <FeatureCard 
          icon={Share2}
          title="Domínio Próprio"
          description="Hospede seu currículo em seu-nome.elitecv.ai e transforme cada link enviado em marketing pessoal."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-purple-400 w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
