'use client';

import { motion } from 'framer-motion';
import { Book, Sparkles, Star, Feather, Share2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookCoverData } from '@/lib/types/publishing';

interface PublishingTemplateProps {
  data: BookCoverData;
}

export function PublishingTemplate({ data }: PublishingTemplateProps) {
  const themeStyles = {
    '--base': data.theme.baseColor,
    '--accent': data.theme.accentColor,
  } as React.CSSProperties;

  return (
    <div style={themeStyles} className="min-h-screen bg-black text-white font-outfit overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] bg-[var(--accent)]/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[60%] bg-[var(--base)]/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row items-center gap-20">
        {/* Book Cover 3D Representation (CSS Only) */}
        <motion.div 
          initial={{ rotateY: -30, opacity: 0 }}
          animate={{ rotateY: -10, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full max-w-md aspect-[2/3] group perspective-1000"
        >
          <div className="h-full rounded-r-3xl bg-[var(--base)] border-y-4 border-r-4 border-white/10 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-between p-12 relative">
             {/* Spine Effect */}
             <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/40 border-r border-white/5" />
             
             {/* Text Elements */}
             <div className="text-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{data.genre}</p>
                <h2 className="text-5xl font-black font-outfit italic leading-[0.8] tracking-tighter">
                  {data.title}
                </h2>
                {data.subtitle && <p className="text-xs font-light text-white/60 tracking-widest">{data.subtitle}</p>}
             </div>

             <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-2xl">
                <Sparkles className="text-black w-6 h-6" />
             </div>

             <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest">{data.author}</p>
                <div className="w-10 h-0.5 bg-[var(--accent)] mx-auto mt-4" />
             </div>
          </div>
        </motion.div>

        {/* Sales/Info Content */}
        <div className="flex-1 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-widest">
              <Feather className="w-3 h-3 text-[var(--accent)]" />
              Elite Publishing Vertical
            </div>
            <h1 className="text-7xl font-black leading-none tracking-tighter">
              Transform Your <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, white 0%, var(--accent) 100%)` }}>
                Epic Concept.
              </span>
            </h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed italic border-l-4 border-[var(--accent)]/30 pl-8">
              "{data.synopsis}"
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.features.map(feat => (
              <div key={feat} className="p-6 rounded-2xl glass border-white/5 flex items-center gap-4 group hover:border-[var(--accent)]/20 transition-all">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 fill-current" />
                 </div>
                 <span className="font-bold text-sm tracking-tight">{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-wrap gap-4">
             <button className="px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm text-black bg-white transition-transform hover:scale-105" style={{ backgroundColor: 'var(--accent)' }}>
                Publish Edition
             </button>
             <button className="px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm text-white glass border-white/10 hover:bg-white/5 transition-all flex items-center gap-3">
                <Share2 className="w-4 h-4" /> Go Viral
             </button>
          </div>
        </div>
      </main>

      {/* Publishing Footer */}
      <footer className="py-20 text-center relative z-10 border-t border-white/5">
         <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.6em]">
            The Bestseller Logic &bull; Elite Creator AI &bull; 2026
         </p>
      </footer>
    </div>
  );
}
