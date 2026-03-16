'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, Trophy, Mail, Phone, MapPin, Globe, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExecutiveTemplateProps {
  data: {
    fullName: string;
    role: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    skills: { name: string; level: number }[];
    experience: { company: string; position: string; period: string; achievements: string[] }[];
    education: { institution: string; degree: string; period: string }[];
  }
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter selection:bg-amber-500/30 selection:text-amber-200">
      {/* Premium Header */}
      <header className="relative h-[60vh] flex items-end p-12 overflow-hidden border-b border-white/5">
        {/* Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-amber-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-zinc-800/20 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-[0.3em] mb-6">
            <Sparkles className="w-3 h-3" />
            Executive Profile 2026
          </div>
          <h1 className="text-8xl font-black font-outfit leading-none mb-4 tracking-tighter">
            {data.fullName.split(' ')[0]} <br />
            <span className="text-transparent bg-clip-text gold-gradient">
              {data.fullName.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className="text-2xl text-zinc-400 font-light tracking-wide max-w-2xl leading-relaxed">
            {data.role}
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-12 py-24 grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left Column: Interactive Bio & Experience */}
        <div className="lg:col-span-8 space-y-24">
          {/* Professional Summary */}
          <section className="space-y-8">
            <SectionHeader icon={User} title="Professional Profile" />
            <p className="text-xl text-zinc-300 leading-relaxed font-light italic border-l-4 border-amber-500/30 pl-8">
              "{data.description}"
            </p>
          </section>

          {/* Experience */}
          <section className="space-y-12">
            <SectionHeader icon={Briefcase} title="Experience" />
            <div className="space-y-16">
              {data.experience.map((exp, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-12 border-l border-white/10"
                >
                  <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full gold-gradient shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{exp.position}</h3>
                      <p className="text-amber-500 font-semibold text-sm uppercase tracking-widest">{exp.company}</p>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono bg-white/5 px-4 py-2 rounded-full border border-white/5">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="text-zinc-400 flex gap-3 text-sm leading-relaxed">
                        <span className="text-amber-500/50 mt-1.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Media Pitch & Sidebar Info */}
        <div className="lg:col-span-4 space-y-16">
          {/* Video Pitch Slot */}
          <section className="space-y-6">
            <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500 text-center">Neural Presentation</h4>
            <div className="aspect-[9/16] rounded-[2.5rem] overflow-hidden glass border-white/10 relative group cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-zinc-900 group-hover:scale-105 transition-transform duration-700 opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center shadow-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Play className="text-black w-8 h-8 fill-current ml-1" />
                </div>
                <p className="text-white font-bold text-lg">Watch Video Pitch</p>
                <p className="text-zinc-500 text-xs mt-2">60 Seconds Professional Overview</p>
              </div>
            </div>
          </section>

          {/* Contact & Skills */}
          <div className="glass rounded-[2.5rem] p-8 space-y-12 border-white/5 shadow-2xl">
            {/* Contact */}
            <div className="space-y-6">
              <ContactItem icon={Mail} label="Email" value={data.email} />
              <ContactItem icon={Phone} label="Phone" value={data.phone} />
              <ContactItem icon={MapPin} label="Location" value={data.location} />
            </div>

            {/* Skills */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Core Competencies</h4>
              <div className="space-y-4">
                {data.skills.map(skill => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{skill.name}</span>
                      <span className="text-amber-500/70 font-mono italic">{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full gold-gradient shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Extraordinary Footer */}
      <footer className="py-20 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-3 mb-4 opacity-30">
          <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase">Elite CV AI</span>
        </div>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest">
          Transformed by Professional Intelligence &bull; 2026
        </p>
      </footer>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Icon className="text-amber-500 w-6 h-6" />
      </div>
      <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter text-white">{title}</h2>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
        <Icon className="text-zinc-500 group-hover:text-amber-500 w-5 h-5 transition-colors" />
      </div>
      <div className="space-y-0.5 overflow-hidden">
        <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">{label}</p>
        <p className="text-sm text-zinc-300 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
