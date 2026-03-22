'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, GraduationCap, Book, PartyPopper, Sparkles, Crown, Palette } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'executive',
    label: 'Executive',
    desc: 'Currículo executivo premium — ideal para liderança e C-level',
    tip: 'Use este template para se posicionar como liderança. Mostra autoridade, trajetória e resultados de forma elegante.',
    icon: Crown,
    color: 'from-slate-600 to-slate-900',
    accent: 'border-slate-500/30 hover:border-slate-400/50',
    tag: 'Carreira',
  },
  {
    id: 'harmony',
    label: 'Harmony',
    desc: 'Design equilibrado e moderno — versátil para qualquer área',
    tip: 'Ideal para quem quer um currículo profissional sem excessos. Funciona bem em qualquer setor — tech, saúde, finanças.',
    icon: Briefcase,
    color: 'from-violet-600 to-purple-800',
    accent: 'border-violet-500/30 hover:border-violet-400/50',
    tag: 'Carreira',
  },
  {
    id: 'pioneer',
    label: 'Pioneer',
    desc: 'Arrojado e criativo — perfeito para startups e inovação',
    tip: 'Mostre que você é diferente. Perfeito para founders, devs e profissionais de inovação que querem sair da mesmice.',
    icon: Sparkles,
    color: 'from-orange-500 to-rose-600',
    accent: 'border-orange-500/30 hover:border-orange-400/50',
    tag: 'Carreira',
  },
  {
    id: 'spectrum',
    label: 'Spectrum',
    desc: 'Colorido e expressivo — destaque para áreas criativas',
    tip: 'Use o Pitch-AI para personalizar as cores do jeito que quiser. Ideal para designers, artistas e criadores de conteúdo.',
    icon: Palette,
    color: 'from-pink-500 to-violet-600',
    accent: 'border-pink-500/30 hover:border-pink-400/50',
    tag: 'Carreira',
  },
  {
    id: 'academic',
    label: 'Academic',
    desc: 'Autoridade acadêmica — teses, papers e pesquisas',
    tip: 'Use este template para trabalhos acadêmicos, apresentações de pesquisa ou portfólios científicos.',
    icon: GraduationCap,
    color: 'from-blue-600 to-indigo-800',
    accent: 'border-blue-500/30 hover:border-blue-400/50',
    tag: 'Acadêmico',
  },
  {
    id: 'publishing',
    label: 'Publishing',
    desc: 'Capa de livro épica — autores e editoras',
    tip: 'Aqui você mostra seu livro ou negócio editorial. Ideal para autores que querem uma presença digital impactante.',
    icon: Book,
    color: 'from-amber-500 to-orange-700',
    accent: 'border-amber-500/30 hover:border-amber-400/50',
    tag: 'Livro',
  },
  {
    id: 'events',
    label: 'Events',
    desc: 'Convite extraordinário — eventos premium e corporativos',
    tip: 'Crie convites digitais elegantes para seu evento. Compartilhe o link e surpreenda os convidados antes mesmo do dia.',
    icon: PartyPopper,
    color: 'from-emerald-500 to-teal-700',
    accent: 'border-emerald-500/30 hover:border-emerald-400/50',
    tag: 'Evento',
  },
];


export default function TemplatesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Templates</h1>
        </div>
        <p className="text-zinc-500 ml-[52px] text-sm">Escolha o template ideal e visualize como seu conteúdo vai ficar.</p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TEMPLATES.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={`/templates/${t.id}`}
              className={`group flex flex-col rounded-2xl border bg-zinc-900/50 overflow-hidden transition-all duration-300 ${t.accent}`}
            >
              {/* Preview colorido */}
              <div className={`h-28 bg-gradient-to-br ${t.color} flex items-center justify-center relative`}>
                <t.icon className="w-10 h-10 text-white/80" />
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-white/70 font-semibold">
                  {t.tag}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white text-sm">{t.label}</p>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{t.desc}</p>
                <p className="text-xs text-zinc-600 italic leading-relaxed border-t border-white/5 pt-2 mt-1">{t.tip}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/5 bg-white/3 p-6 flex items-center justify-between"
      >
        <div>
          <p className="font-bold text-white">Não encontrou o que busca?</p>
          <p className="text-sm text-zinc-500 mt-0.5">Use o Transformer e a IA cria o conteúdo no estilo que você quiser.</p>
        </div>
        <Link href="/transform"
          className="px-5 py-2.5 rounded-xl premium-gradient text-white font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all shrink-0">
          <Sparkles className="w-4 h-4" /> Transformar agora
        </Link>
      </motion.div>
    </div>
  );
}
