'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Star, Award } from 'lucide-react';

interface BlueWhiteTemplateProps {
  data: {
    fullName: string;
    role: string;
    description: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    skills: { name: string; level: number }[];
    experience: { company: string; position: string; period: string; achievements: string[] }[];
    education: { institution: string; degree: string; period: string }[];
  };
}

export function BlueWhiteTemplate({ data }: BlueWhiteTemplateProps) {
  const firstName = data.fullName.split(' ')[0];
  const lastName = data.fullName.split(' ').slice(1).join(' ');

  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      {/* ── HEADER: Navy gradient banner ── */}
      <header
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #162d4a 60%, #0f2038 100%)' }}
      >
        {/* Subtle geometric accent */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
        />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #93c5fd 0%, transparent 70%)', transform: 'translate(-30%, 40%)' }}
        />

        <div className="relative z-10 px-12 pt-14 pb-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Role badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              <span className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.25em]">
                {data.role}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-outfit leading-none tracking-tight mb-1">
              <span className="block text-5xl md:text-6xl font-black text-white">{firstName}</span>
              <span className="block text-5xl md:text-6xl font-light text-blue-300 mt-1">{lastName}</span>
            </h1>

            {/* Divider accent */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-0.5 w-12 rounded-full bg-blue-500" />
              <div className="h-0.5 w-4 rounded-full bg-blue-400/50" />
              <div className="h-0.5 w-2 rounded-full bg-blue-400/25" />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── BODY: Two-column layout ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr]">

        {/* ─── LEFT COLUMN (white) ─── */}
        <main className="px-10 py-12 space-y-12 border-r border-slate-100">

          {/* Professional Summary */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <SectionTitle title="Perfil Profissional" />
            <p className="text-slate-600 leading-relaxed text-[15px] border-l-4 border-blue-500/30 pl-5 italic">
              {data.description}
            </p>
          </motion.section>

          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <SectionTitle title="Experiência Profissional" icon={<Briefcase className="w-4 h-4" />} />
            <div className="space-y-8">
              {data.experience.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-8"
                >
                  {/* Timeline dot & line */}
                  <div className="absolute left-0 top-1.5 flex flex-col items-center">
                    <span
                      className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white z-10"
                      style={{ boxShadow: '0 0 0 3px rgba(37,99,235,0.12)' }}
                    />
                    {idx < data.experience.length - 1 && (
                      <div className="mt-1 w-px flex-1 min-h-[4rem] bg-slate-200" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                    <div>
                      <h3 className="font-outfit font-bold text-slate-900 text-base leading-tight">
                        {exp.position}
                      </h3>
                      <p className="text-[#2563EB] font-semibold text-sm">{exp.company}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full self-start">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-1.5 mt-2">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-5"
          >
            <SectionTitle title="Formação Acadêmica" icon={<GraduationCap className="w-4 h-4" />} />
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)' }}
                  >
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-outfit font-bold text-slate-900 text-sm leading-tight">{edu.degree}</p>
                    <p className="text-slate-500 text-[12px] font-medium mt-0.5">{edu.institution}</p>
                    <p className="text-[#2563EB] text-[11px] font-bold tracking-wide mt-1">{edu.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </main>

        {/* ─── RIGHT COLUMN (navy sidebar) ─── */}
        <aside
          className="px-7 py-12 space-y-10"
          style={{ background: 'linear-gradient(180deg, #1E3A5F 0%, #162d4a 100%)' }}
        >
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-5"
          >
            <h3 className="font-outfit text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">
              Contato
            </h3>
            <div className="space-y-3">
              {data.email && (
                <SidebarContactItem icon={<Mail className="w-3.5 h-3.5" />} value={data.email} />
              )}
              {data.phone && (
                <SidebarContactItem icon={<Phone className="w-3.5 h-3.5" />} value={data.phone} />
              )}
              {data.location && (
                <SidebarContactItem icon={<MapPin className="w-3.5 h-3.5" />} value={data.location} />
              )}
              {data.website && (
                <SidebarContactItem icon={<Globe className="w-3.5 h-3.5" />} value={data.website} />
              )}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="space-y-5"
          >
            <h3 className="font-outfit text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] flex items-center gap-2">
              <Star className="w-3 h-3" />
              Competências
            </h3>
            <div className="space-y-4">
              {data.skills.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-[12px] font-medium leading-snug">{skill.name}</span>
                    <span className="text-blue-300 text-[10px] font-bold font-mono">{skill.level}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #2563EB, #60a5fa)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Certifications placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="space-y-5"
          >
            <h3 className="font-outfit text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] flex items-center gap-2">
              <Award className="w-3 h-3" />
              Certificações
            </h3>
            <div className="space-y-2">
              {[
                'Profissional Certificado',
                'Especialização Avançada',
                'Credencial Reconhecida',
              ].map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(96,165,250,0.2)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-blue-100 text-[11px] font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center">
        <div className="flex items-center justify-center opacity-40">
          <Image src="/pitchfolio-logo.png" alt="PitchFólio" width={110} height={26} />
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ──

function SectionTitle({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-100">
      {icon && (
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)' }}
        >
          {icon}
        </div>
      )}
      <h2 className="font-outfit font-black text-slate-900 text-base uppercase tracking-wider">{title}</h2>
    </div>
  );
}

function SidebarContactItem({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-start gap-2.5 group">
      <div className="mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-blue-300"
        style={{ background: 'rgba(37,99,235,0.2)' }}
      >
        {icon}
      </div>
      <span className="text-blue-100 text-[12px] font-medium leading-snug break-all">{value}</span>
    </div>
  );
}
