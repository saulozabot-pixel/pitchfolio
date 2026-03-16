'use client';

import { motion } from 'framer-motion';
import { Sparkles, Palette, Zap, Heart, Camera, Music, Instagram, Twitter, Mail, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpectrumTemplateProps {
  data: {
    name: string;
    identities: string[];
    bio: string;
    colors: { primary: string; secondary: string; accent: string };
    manifesto: string;
    works: { title: string; category: string; image?: string; link?: string }[];
    socials: { platform: string; url: string; icon: any }[];
  }
}

export function SpectrumTemplate({ data }: SpectrumTemplateProps) {
  // Dynamic style for the palette
  const themeStyle = {
    '--primary': data.colors.primary,
    '--secondary': data.colors.secondary,
    '--accent': data.colors.accent,
  } as React.CSSProperties;

  return (
    <div style={themeStyle} className="min-h-screen bg-black text-white font-outfit selection:bg-[var(--accent)] selection:text-black">
      {/* Immersive Header */}
      <header className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-[var(--primary)]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] bg-[var(--secondary)]" 
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center space-y-6 px-4"
        >
          <div className="flex justify-center gap-3">
            {data.identities.map((id, i) => (
              <span key={i} className="px-4 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em]">
                {id}
              </span>
            ))}
          </div>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter leading-none mb-4 italic">
            {data.name}
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-[var(--accent)] tracking-tight">
            Creative Pulse & Identity Expression
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
            <Zap className="w-6 h-6 text-white" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-32 space-y-48">
        {/* Bio Section: Bold & Identity-affirming */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black italic border-b-8 border-[var(--primary)] inline-block">The Story</h2>
              <p className="text-3xl font-medium leading-tight text-zinc-300">
                {data.bio}
              </p>
            </div>
            <div className="glass aspect-square rounded-[4rem] p-12 border-white/10 flex flex-col justify-center text-center space-y-6">
                <Heart className="w-16 h-16 text-[var(--secondary)] mx-auto animate-pulse" />
                <h3 className="text-4xl font-black uppercase tracking-widest text-[var(--accent)]">Manifesto</h3>
                <p className="text-zinc-400 italic">"{data.manifesto}"</p>
            </div>
        </section>

        {/* Portfolio / Categories: Visual & Fluid */}
        <section className="space-y-16">
          <div className="flex justify-between items-end">
            <h2 className="text-5xl font-black italic">Curated Space</h2>
            <Palette className="w-10 h-10 text-[var(--primary)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {data.works.map((work, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -20 }}
                className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-zinc-900 border border-white/5"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex flex-col justify-end p-10 z-20 space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">{work.category}</p>
                   <h4 className="text-3xl font-bold italic">{work.title}</h4>
                   <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-[var(--primary)]" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Connection Section */}
        <section className="py-24 glass rounded-[5rem] border-white/5 text-center space-y-12">
           <h2 className="text-6xl font-black italic">Connect Universes</h2>
           <div className="flex flex-wrap justify-center gap-12">
              {data.socials.map((social, i) => (
                <a key={i} href={social.url} className="group flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:border-transparent transition-all duration-500">
                     <social.icon className="w-8 h-8 text-zinc-400 group-hover:text-black transition-colors" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-600 group-hover:text-white">{social.platform}</span>
                </a>
              ))}
           </div>
        </section>
      </main>

      {/* Extraordinary Footer */}
      <footer className="py-20 border-t border-white/5 px-8 flex flex-col md:flex-row justify-between items-center gap-8">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary)] flex items-center justify-center rotate-12 shadow-2xl">
                <Sparkles className="text-black w-6 h-6" />
            </div>
            <span className="font-outfit font-black uppercase tracking-[0.5em] text-sm">Elite Creator AI</span>
         </div>
         <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest text-center md:text-right">
            Expression Without Limits &bull; Spectrum Edition 2026 <br />
            Proudly Diverse, Digitally Extraordinary
         </p>
      </footer>
    </div>
  );
}
