'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, Trophy, Mail, Phone, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HarmonyTemplateProps {
  data: {
    fullName: string;
    role: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    skills: { name: string; description: string }[];
    experience: { company: string; position: string; period: string; summary: string; bullets: string[] }[];
    education: { institution: string; degree: string; period: string }[];
  }
}

export function HarmonyTemplate({ data }: HarmonyTemplateProps) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-inter selection:bg-blue-100">
      {/* Inclusive Header: High contrast, clear typography */}
      <header className="bg-white border-b-4 border-blue-600 px-8 py-16 md:px-24">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
            <Sparkles className="w-3 h-3" />
            Harmony Accessible Profile
          </div>
          <h1 className="text-6xl font-black text-zinc-950 tracking-tight mb-4">
            {data.fullName}
          </h1>
          <p className="text-3xl text-blue-600 font-bold">
            {data.role}
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-zinc-600">
             <div className="flex items-center gap-2 font-medium">
                <Mail className="w-5 h-5 text-blue-500" /> {data.email}
             </div>
             <div className="flex items-center gap-2 font-medium">
                <Phone className="w-5 h-5 text-blue-500" /> {data.phone}
             </div>
             <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-5 h-5 text-blue-500" /> {data.location}
             </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-20">
          {/* Executive Summary: Large text, easy to scan */}
          <section aria-labelledby="summary-title" className="space-y-6">
            <h2 id="summary-title" className="text-2xl font-black flex items-center gap-3 text-zinc-950">
              <User className="text-blue-600 w-6 h-6" /> 
              Sobre Mim
            </h2>
            <div className="bg-white p-8 rounded-3xl border-2 border-zinc-100 shadow-sm leading-relaxed text-xl text-zinc-700">
              {data.description}
            </div>
          </section>

          {/* Experience: Structured with clear separation */}
          <section aria-labelledby="experience-title" className="space-y-10">
            <h2 id="experience-title" className="text-2xl font-black flex items-center gap-3 text-zinc-950">
              <Briefcase className="text-blue-600 w-6 h-6" /> 
              Experiência Profissional
            </h2>
            <div className="space-y-12">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border-2 border-zinc-100 hover:border-blue-200 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-2">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900">{exp.position}</h3>
                      <p className="text-blue-600 font-bold">{exp.company}</p>
                    </div>
                    <span className="inline-block bg-zinc-100 text-zinc-600 font-bold px-4 py-2 rounded-xl text-sm">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-zinc-600 mb-6 font-medium italic">{exp.summary}</p>
                  <ul className="grid grid-cols-1 gap-4">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-700">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Area: Modular and clear */}
        <div className="space-y-12">
          {/* Technical Skills: Visual and descriptive */}
          <section aria-labelledby="skills-title" className="space-y-8">
            <h2 id="skills-title" className="text-2xl font-black flex items-center gap-3 text-zinc-950">
              <Trophy className="text-blue-600 w-6 h-6" /> 
              Competências
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {data.skills.map((skill) => (
                <div key={skill.name} className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-200">
                  <h4 className="font-black text-lg mb-1">{skill.name}</h4>
                  <p className="text-blue-100 text-sm font-medium leading-snug">{skill.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section aria-labelledby="education-title" className="space-y-6">
            <h2 id="education-title" className="text-xl font-black flex items-center gap-3 text-zinc-950">
              <GraduationCap className="text-blue-600 w-5 h-5" /> 
              Formação
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="p-6 rounded-3xl border-2 border-zinc-100 bg-white">
                  <p className="font-black text-zinc-900 leading-tight mb-1">{edu.degree}</p>
                  <p className="text-zinc-500 text-sm font-bold">{edu.institution}</p>
                  <p className="text-blue-600 text-xs font-black mt-2">{edu.period}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Accessibility Note */}
          <div className="p-6 rounded-3xl bg-green-50 border-2 border-green-100 text-center">
            <p className="text-green-800 text-sm font-bold">
              Este currículo foi otimizado para acessibilidade e inclusão.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t-2 border-zinc-100 py-12 text-center">
         <div className="flex items-center justify-center mb-3 opacity-40">
            <Image src="/pitchfolio-logo.png" alt="PitchFólio" width={110} height={26} />
         </div>
         <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
            Inclusão Sem Limites &bull; 2026
         </p>
      </footer>
    </div>
  );
}
