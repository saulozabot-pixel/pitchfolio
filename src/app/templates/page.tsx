'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, GraduationCap, Book, PartyPopper, Sparkles, Crown, Palette, CheckCircle, Heart, Lock, Zap, Wand2, LayoutTemplate } from 'lucide-react';
import { useEffect, useState } from 'react';
import { hasDraft } from '@/lib/pitchStore';

const TEMPLATES = [
  {
    id: 'rose',
    label: 'Rose & Grey',
    desc: 'Elegância em cinza chumbo e rosa seco — sofisticado e feminino',
    tip: 'Ideal para vendas, moda, saúde e atendimento ao cliente.',
    icon: Heart,
    gradient: 'from-[#C4958A] to-[#4F4F4F]',
    badge: 'bg-rose-50 text-rose-700',
    tag: 'Carreira',
    free: true,
  },
  {
    id: 'executive',
    label: 'Executive',
    desc: 'Currículo executivo premium — ideal para liderança e C-level',
    tip: 'Autoridade, trajetória e resultados. Para quem quer se posicionar no topo.',
    icon: Crown,
    gradient: 'from-slate-700 to-slate-900',
    badge: 'bg-slate-100 text-slate-700',
    tag: 'Carreira',
    free: true,
  },
  {
    id: 'harmony',
    label: 'Harmony',
    desc: 'Design equilibrado e moderno — versátil para qualquer área',
    tip: 'Profissional sem excessos. Funciona bem em tech, saúde e finanças.',
    icon: Briefcase,
    gradient: 'from-violet-500 to-purple-700',
    badge: 'bg-violet-50 text-violet-700',
    tag: 'Carreira',
    free: true,
  },
  {
    id: 'bluewhite',
    label: 'Blue & White',
    desc: 'Corporativo, limpo e sólido — ideal para finanças, direito e tech',
    tip: 'Transmite autoridade e profissionalismo. Perfeito para quem quer impactar recrutadores.',
    icon: LayoutTemplate,
    gradient: 'from-blue-600 to-blue-900',
    badge: 'bg-blue-50 text-blue-700',
    tag: 'Carreira',
    free: true,
  },
  {
    id: 'pioneer',
    label: 'Pioneer',
    desc: 'Arrojado e criativo — perfeito para startups e inovação',
    tip: 'Perfeito para founders, devs e profissionais que querem sair da mesmice.',
    icon: Sparkles,
    gradient: 'from-orange-500 to-rose-600',
    badge: 'bg-orange-50 text-orange-700',
    tag: 'Carreira',
    free: false,
  },
  {
    id: 'spectrum',
    label: 'Spectrum',
    desc: 'Colorido e expressivo — destaque para áreas criativas',
    tip: 'Ideal para designers, artistas e criadores.',
    icon: Palette,
    gradient: 'from-pink-500 to-violet-600',
    badge: 'bg-pink-50 text-pink-700',
    tag: 'Criativo',
    free: false,
  },
  {
    id: 'academic',
    label: 'Academic',
    desc: 'Autoridade acadêmica — teses, papers e pesquisas',
    tip: 'Para trabalhos acadêmicos, apresentações de pesquisa ou portfólios científicos.',
    icon: GraduationCap,
    gradient: 'from-blue-600 to-indigo-700',
    badge: 'bg-blue-50 text-blue-700',
    tag: 'Acadêmico',
    free: false,
  },
  {
    id: 'publishing',
    label: 'Publishing',
    desc: 'Capa de livro épica — autores e editoras',
    tip: 'Ideal para autores que querem uma presença digital impactante.',
    icon: Book,
    gradient: 'from-amber-500 to-orange-700',
    badge: 'bg-amber-50 text-amber-700',
    tag: 'Livro',
    free: false,
  },
  {
    id: 'events',
    label: 'Events',
    desc: 'Convite extraordinário — eventos premium e corporativos',
    tip: 'Crie convites digitais elegantes. Compartilhe o link e surpreenda os convidados.',
    icon: PartyPopper,
    gradient: 'from-emerald-500 to-teal-700',
    badge: 'bg-emerald-50 text-emerald-700',
    tag: 'Evento',
    free: false,
  },
  {
    id: 'custom',
    label: 'Custom Builder',
    desc: 'Personalize cores, fontes e estilo — template 100% seu',
    tip: 'Escolha suas cores, tipografia e deixe o portfólio com a sua cara.',
    icon: Wand2,
    gradient: 'from-fuchsia-500 to-pink-600',
    badge: 'bg-fuchsia-50 text-fuchsia-700',
    tag: 'Personalizado',
    free: false,
  },
];

export default function TemplatesPage() {
  const [draft, setDraft] = useState(false);
  useEffect(() => { setDraft(hasDraft()); }, []);

  const freeTemplates = TEMPLATES.filter(t => t.free);
  const premiumTemplates = TEMPLATES.filter(t => !t.free);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl pitch-gradient flex items-center justify-center shadow-md shadow-cyan-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-outfit">Templates</h1>
        </div>
        <p className="text-slate-500 ml-[52px] text-sm">Escolha o template ideal e veja como seu conteúdo vai ficar.</p>
      </motion.div>

      {/* Banner de conteúdo pronto */}
      {draft && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-cyan-50 border border-cyan-200 shadow-sm">
          <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-cyan-900">Conteúdo do Transformer pronto</p>
            <p className="text-xs text-cyan-700">Escolha um template abaixo — seus dados serão aplicados automaticamente.</p>
          </div>
        </motion.div>
      )}

      {/* Templates gratuitos */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Incluídos no plano gratuito</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeTemplates.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link
                href={`/templates/${t.id}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-250"
              >
                <div className={`h-28 bg-gradient-to-br ${t.gradient} flex items-center justify-center relative`}>
                  <t.icon className="w-9 h-9 text-white/80" />
                  <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${t.badge}`}>{t.tag}</span>
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20 text-white backdrop-blur-sm">Grátis</span>
                </div>
                <div className="p-4 flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 text-sm">{t.label}</p>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                  <p className="text-xs text-slate-400 italic leading-relaxed border-t border-slate-100 pt-2 mt-1">{t.tip}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Templates premium */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Premium — desbloqueie todos os templates</p>
          <span className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-600 bg-fuchsia-50 border border-fuchsia-200 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3" /> A partir de R$19/mês
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {premiumTemplates.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
              <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden relative">
                {/* Overlay de lock */}
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs font-bold text-slate-700">Premium</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Desbloqueie com o plano premium</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full px-4">
                    <Link href={`/templates/${t.id}`}
                      className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold text-center transition-colors">
                      Ver demonstração
                    </Link>
                    <button type="button" className="w-full py-1.5 rounded-lg pitch-gradient text-white text-[11px] font-bold text-center hover:opacity-90 transition-all">
                      Upgrade →
                    </button>
                  </div>
                </div>

                {/* Card (atrás do overlay) */}
                <div className={`h-28 bg-gradient-to-br ${t.gradient} flex items-center justify-center relative opacity-50`}>
                  <t.icon className="w-9 h-9 text-white/80" />
                  <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${t.badge}`}>{t.tag}</span>
                </div>
                <div className="p-4 flex flex-col gap-1.5 flex-1 opacity-40">
                  <p className="font-bold text-slate-900 text-sm">{t.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA upgrade */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="rounded-2xl border border-fuchsia-100 bg-gradient-to-r from-fuchsia-50 to-cyan-50 p-6 flex items-center justify-between shadow-sm">
        <div>
          <p className="font-bold text-slate-900">Acesse todos os {TEMPLATES.length} templates</p>
          <p className="text-sm text-slate-500 mt-0.5">Pioneer, Spectrum, Academic, Publishing, Events, Custom Builder + todos os futuros templates.</p>
        </div>
        <button type="button" className="px-5 py-2.5 rounded-xl pitch-gradient text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shrink-0 shadow-md shadow-cyan-200">
          <Zap className="w-4 h-4" /> Assinar Premium
        </button>
      </motion.div>
    </div>
  );
}
