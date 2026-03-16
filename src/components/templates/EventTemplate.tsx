'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Sparkles, Send, GlassWater, Music, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventData } from '@/lib/types/events';

interface EventTemplateProps {
  data: EventData;
}

export function EventTemplate({ data }: EventTemplateProps) {
  const isSerif = data.theme.fontFamily === 'serif';

  return (
    <div className={cn(
      "min-h-screen bg-[#050505] text-white selection:bg-gold-500/30",
      isSerif ? "font-serif" : "font-outfit"
    )}>
      {/* Immersive Cinematic Opening */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Abstract Light Leaks */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <motion.div 
             animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
             transition={{ duration: 8, repeat: Infinity }}
             className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] bg-[var(--primary)]/10 rounded-full blur-[120px]" 
             style={{ '--primary': data.theme.primaryColor } as any}
           />
           <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 space-y-8 px-6"
        >
          <div className="flex justify-center items-center gap-4 mb-8">
             <div className="w-12 h-[1px] bg-white/20" />
             <Sparkles className="text-[var(--primary)] w-6 h-6" style={{ color: data.theme.primaryColor }} />
             <div className="w-12 h-[1px] bg-white/20" />
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-white drop-shadow-2xl">
            {data.title}
          </h1>
          
          <p className="text-2xl md:text-3xl font-light tracking-[0.2em] text-white/60">
            {data.type} &bull; {data.date}
          </p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-12"
          >
             <button className="group relative px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10">Confirmar Presença</span>
                <div className="absolute inset-0 bg-[var(--primary)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ backgroundColor: data.theme.primaryColor }} />
             </button>
          </motion.div>
        </motion.div>

        {/* Scroll Call */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">Experience More</p>
           <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-32 space-y-48 relative z-10">
        {/* The Essence */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-5xl font-black italic tracking-tighter">O Conceito</h2>
              <p className="text-2xl font-light leading-relaxed text-zinc-400">
                {data.description}
              </p>
           </div>
           <div className="glass p-12 rounded-[4rem] border-white/5 space-y-8">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-[var(--primary)]" style={{ color: data.theme.primaryColor }}>
                    <Calendar className="w-8 h-8" />
                 </div>
                 <div>
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Data & Hora</p>
                    <p className="text-2xl font-bold">{data.date} &bull; {data.time}</p>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-[var(--primary)]" style={{ color: data.theme.primaryColor }}>
                    <MapPin className="w-8 h-8" />
                 </div>
                 <div>
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Localização</p>
                    <p className="text-2xl font-bold">{data.location.name}</p>
                    <p className="text-sm text-zinc-400">{data.location.address}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Highlights / Schedule */}
        <section className="space-y-16">
           <div className="text-center space-y-4">
              <h2 className="text-6xl font-black tracking-tighter uppercase italic">A Experiência</h2>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs">Momentos extraordinários aguardam</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HighlightCard icon={GlassWater} title="Welcome Drinks" color={data.theme.primaryColor} />
              <HighlightCard icon={Music} title="Live Art Performance" color={data.theme.secondaryColor} />
              <HighlightCard icon={Gift} title="Exclusive Gifts" color={data.theme.primaryColor} />
           </div>
        </section>

        {/* Action Center */}
        <section className="p-20 glass rounded-[5rem] border-white/5 text-center space-y-12">
            <h2 className="text-6xl font-black tracking-tighter italic">Sua vaga no extraordinário</h2>
            <div className="max-w-md mx-auto space-y-8">
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">RSVP obrigatório até {data.rsvpDeadline}</p>
               <div className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    placeholder="Nome Completo" 
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-center font-bold text-xl focus:border-[var(--primary)] outline-none transition-colors" 
                    style={{ '--primary': data.theme.primaryColor } as any}
                  />
                  <button className="w-full p-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform">
                     Solicitar Acesso
                  </button>
               </div>
            </div>
        </section>
      </main>

      {/* Invitation Footer */}
      <footer className="py-32 border-t border-white/5 text-center">
         <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: data.theme.primaryColor }} />
            <span className="font-outfit font-black uppercase tracking-[0.6em] text-xs">Elite Experience Engine</span>
         </div>
         <p className="text-zinc-700 text-[10px] font-black uppercase">
            Designed for the extraordinary &bull; Powered by Elite Creator AI
         </p>
      </footer>
    </div>
  );
}

function HighlightCard({ icon: Icon, title, color }: { icon: any, title: string, color: string }) {
  return (
    <div className="p-12 glass rounded-[3rem] border-white/5 text-center group hover:border-white/20 transition-all space-y-6">
       <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform" style={{ color: color }}>
          <Icon className="w-10 h-10" />
       </div>
       <h4 className="text-xl font-black uppercase tracking-widest leading-tight">{title}</h4>
    </div>
  );
}
