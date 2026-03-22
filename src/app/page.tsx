import Link from 'next/link';
import { FileText, Video, Share2, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-10">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-slate-200 shadow-sm p-6 md:p-14">
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-fuchsia-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-600 text-xs font-bold uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            IA Powered — Portfólio ao Vivo
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-outfit text-slate-900 leading-[1.1] tracking-tight">
            Pare de mandar<br />
            <span className="pitch-gradient-text">currículo</span><br className="md:hidden" />
            <span className="text-slate-400 text-base md:text-xl font-medium md:ml-2 tracking-normal">em pdf, word ou impresso...</span>
          </h1>

          <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
            O PitchFólio transforma seus dados profissionais em uma experiência digital extraordinária — com vídeo, IA e design de impacto.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/transform"
              className="px-7 py-3.5 rounded-xl pitch-gradient text-white font-bold shadow-lg shadow-cyan-200 hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              Transformar Agora
            </Link>
            <Link
              href="/templates"
              className="px-7 py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 transition-all duration-200 flex items-center gap-2"
            >
              Ver Templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FeatureCard
          icon={FileText}
          iconColor="text-cyan-500"
          iconBg="bg-cyan-50"
          title="Conteúdo de Impacto"
          description="Nossa IA reescreve suas experiências com verbos de ação, métricas e keywords que recrutadores procuram."
        />
        <FeatureCard
          icon={Video}
          iconColor="text-violet-500"
          iconBg="bg-violet-50"
          title="Video Pitch"
          description="Grave sua apresentação diretamente na plataforma. Mostre sua personalidade antes de qualquer entrevista."
        />
        <FeatureCard
          icon={Share2}
          iconColor="text-fuchsia-500"
          iconBg="bg-fuchsia-50"
          title="Link Único ao Vivo"
          description="Compartilhe seu portfólio com um link personalizado. Cada clique é uma impressão que conta."
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '3×', label: 'mais respostas de recrutadores' },
          { value: '2 min', label: 'para gerar seu portfólio' },
          { value: '100%', label: 'personalizável com IA' },
          { value: 'Zero', label: 'código necessário' },
        ].map((s) => (
          <div key={s.label} className="card-base p-5 text-center">
            <p className="text-3xl font-black font-outfit pitch-gradient-text mb-1">{s.value}</p>
            <p className="text-xs text-slate-500 leading-snug font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon, iconColor, iconBg, title, description
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card-base p-7 group">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`${iconColor} w-5 h-5`} />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
