'use client';

import { motion } from 'framer-motion';
import { Sparkles, Terminal, Rocket, Users, ShieldCheck, Github, Linkedin, Mail, Cpu, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PioneerTemplateProps {
  data: {
    fullName: string;
    role: string;
    tagline: string;
    about: string;
    email: string;
    linkedin?: string;
    github?: string;
    techStack: { category: string; skills: string[] }[];
    projects: { name: string; description: string; tech: string[]; link?: string }[];
    leadership: { title: string; points: string[] }[];
  }
}

export function PioneerTemplate({ data }: PioneerTemplateProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-inter selection:bg-emerald-500/30">
      {/* Dynamic Navigation / Header */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <span className="font-outfit font-black tracking-widest text-white uppercase text-sm">The Pioneer</span>
        </div>
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
          <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
          <a href="#tech" className="hover:text-emerald-400 transition-colors">Stack</a>
          <a href="#projects" className="hover:text-emerald-400 transition-colors">Projects</a>
          <a href="#leadership" className="hover:text-emerald-400 transition-colors">Leadership</a>
        </div>
      </nav>

      {/* Hero: Authority & Impact */}
      <section className="relative pt-40 pb-32 px-8 md:px-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[80%] bg-emerald-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] bg-indigo-900/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-[0.3em]">
              <Rocket className="w-3 h-3" />
              Technical Leadership // 2026
            </div>
            <h1 className="text-7xl font-black font-outfit text-white leading-[0.9] tracking-tighter">
              {data.fullName}
            </h1>
            <p className="text-3xl font-light text-slate-400 tracking-tight italic">
              "{data.tagline}"
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              {data.github && <SocialLink icon={Github} label="GitHub" href={data.github} />}
              {data.linkedin && <SocialLink icon={Linkedin} label="LinkedIn" href={data.linkedin} />}
              <SocialLink icon={Mail} label="Contact" href={`mailto:${data.email}`} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm aspect-square glass rounded-[3rem] border-white/10 p-2 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
               <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                  <Terminal className="w-12 h-12" />
               </div>
               <p className="text-xs uppercase font-black tracking-widest text-slate-500">Video Presentation Slot</p>
               <button className="px-6 py-2 rounded-xl bg-emerald-500 text-[#020617] font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                  Play Pitch
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-8 md:px-24 py-32 space-y-40">
        {/* About / Philosophy */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 flex items-center">
             <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter text-emerald-400">The Matrix <br />Of Mission</h2>
          </div>
          <div className="md:col-span-8 bg-slate-900/40 p-12 rounded-[2.5rem] border border-white/5 leading-relaxed text-xl font-light text-slate-400">
             {data.about}
          </div>
        </section>

        {/* Tech Stack Grid */}
        <section id="tech" className="space-y-12">
           <SectionLabel icon={Terminal} title="Technical Stack" />
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {data.techStack.map((stack, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all group">
                   <h4 className="text-emerald-400 font-bold mb-4 uppercase text-xs tracking-widest">{stack.category}</h4>
                   <div className="flex flex-wrap gap-2">
                      {stack.skills.map(s => (
                        <span key={s} className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300 border border-slate-700">{s}</span>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Projects / Contributions */}
        <section id="projects" className="space-y-16">
          <SectionLabel icon={Github} title="Core Contributions" />
          <div className="space-y-8">
            {data.projects.map((proj, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ x: 10 }}
                className="p-10 rounded-[2.5rem] glass border-white/5 flex flex-col md:flex-row gap-8 items-center group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                   <Globe className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                   <h4 className="text-2xl font-bold text-white tracking-tight">{proj.name}</h4>
                   <p className="text-slate-500 text-sm leading-relaxed">{proj.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {proj.tech.map(t => (
                    <span key={t} className="px-3 py-1 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/10">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leadership Pillar */}
        <section id="leadership" className="space-y-12">
           <SectionLabel icon={Users} title="Leadership Philosophy" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {data.leadership.map((item, idx) => (
                <div key={idx} className="space-y-6">
                   <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                      <ShieldCheck className="text-emerald-500 w-6 h-6" />
                      {item.title}
                   </h4>
                   <ul className="space-y-4">
                      {item.points.map((p, i) => (
                        <li key={i} className="text-slate-400 text-sm leading-relaxed pl-4 border-l-2 border-slate-800 hover:border-emerald-500/40 transition-colors">
                           {p}
                        </li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Extraordinary Footer */}
      <footer className="py-32 text-center bg-black/40 border-t border-white/5">
         <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-emerald-500 w-5 h-5" />
            <span className="text-xs font-bold tracking-[0.5em] uppercase text-white">Elite CV Engine</span>
         </div>
         <p className="text-slate-600 text-[10px] uppercase font-black">
            Technical Leadership Edition &bull; High-Density Achievement Framework
         </p>
      </footer>
    </div>
  );
}

function SocialLink({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <a href={href} target="_blank" className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
      <Icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
      <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</span>
    </a>
  );
}

function SectionLabel({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-4">
       <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
          <Icon className="w-5 h-5" />
       </div>
       <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">{title}</h3>
    </div>
  );
}
