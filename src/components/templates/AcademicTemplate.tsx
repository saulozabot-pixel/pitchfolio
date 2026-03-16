'use client';

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Users, Bookmark, FileText, Search, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AcademicWork } from '@/lib/types/academic';

interface AcademicTemplateProps {
  data: AcademicWork;
}

export function AcademicTemplate({ data }: AcademicTemplateProps) {
  return (
    <div className="min-h-screen bg-[#fcfcf9] text-zinc-900 font-serif selection:bg-indigo-100 selection:text-indigo-900">
      {/* Structural Header (Cover Page Style) */}
      <header className="h-screen flex flex-col items-center justify-center text-center px-12 space-y-12 border-b-8 border-zinc-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="w-16 h-1 bg-zinc-900 mx-auto" />
          <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">{data.institution}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{data.department}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl space-y-4"
        >
          <h1 className="text-7xl font-black tracking-tight text-zinc-950 leading-tight">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-3xl font-light text-zinc-500 italic tracking-wide">
              {data.subtitle}
            </p>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <p className="text-xl font-bold text-zinc-900">{data.author}</p>
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Tese de Doutorado &bull; {data.year}</p>
        </motion.div>

        <div className="absolute bottom-12 flex flex-col items-center gap-2 text-zinc-400">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sumário Executivo</p>
          <div className="w-1 h-12 bg-zinc-200" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-12 py-32 space-y-40">
        {/* Abstract / Resumo */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 space-y-6">
             <div className="flex items-center gap-3 text-indigo-600">
               <Sparkles className="w-6 h-6" />
               <h2 className="text-xs font-black uppercase tracking-[0.3em]">Abstract</h2>
             </div>
             <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Orientador: {data.advisor}</p>
          </div>
          <div className="md:col-span-8 p-12 bg-white border border-zinc-100 shadow-xl rounded-[2rem] leading-relaxed text-2xl font-light text-zinc-700 italic">
            "{data.abstract}"
          </div>
        </section>

        {/* Chapters / Methodology */}
        <section className="space-y-16">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl">
            <BookOpen className="w-4 h-4" />
            Estrutura da Investigação
          </div>

          <div className="space-y-32">
            {data.chapters.map((chapter, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group grid grid-cols-1 md:grid-cols-12 gap-12"
              >
                <div className="md:col-span-1 text-8xl font-black text-zinc-100 group-hover:text-indigo-50 transition-colors">
                  0{idx + 1}
                </div>
                <div className="md:col-span-11 space-y-8 pt-4">
                  <h3 className="text-4xl font-black tracking-tight text-zinc-900 border-b-4 border-zinc-900 pb-4 inline-block">{chapter.title}</h3>
                  <div className="prose prose-zinc prose-xl text-zinc-600 max-w-none leading-loose">
                    {chapter.content}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {chapter.keywords.map(kw => (
                      <span key={kw} className="px-4 py-2 bg-zinc-50 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-zinc-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* References */}
        <section className="p-16 bg-zinc-50 rounded-[3rem] border border-zinc-100 space-y-12">
           <h2 className="text-3xl font-black tracking-tight flex items-center gap-4 text-zinc-900">
             <Bookmark className="text-indigo-600 w-8 h-8" />
             Bibliografia de Referência
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.references.map((ref, i) => (
                <div key={i} className="text-sm text-zinc-500 font-medium pl-6 border-l-2 border-zinc-200 hover:border-indigo-400 transition-colors">
                  {ref}
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Premium Academic Footer */}
      <footer className="py-32 text-center border-t border-zinc-100">
         <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-45">
            <GraduationCap className="text-white w-6 h-6 -rotate-45" />
         </div>
         <p className="text-zinc-400 font-black uppercase tracking-[0.5em] text-[10px] mb-2">
            Elite Creator AI &bull; Academic Division
         </p>
         <p className="text-zinc-300 text-[9px] uppercase tracking-widest font-bold">
            Extraordinary Knowledge Presentation &bull; 2026
         </p>
      </footer>
    </div>
  );
}
