'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Star } from 'lucide-react';

interface CustomTemplateProps {
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
  theme: {
    accentColor: string;   // hex e.g. "#7C3AED"
    bgColor: string;       // hex e.g. "#FFFFFF"
    fontStyle: 'modern' | 'classic' | 'bold';
  };
}

function getFontClass(fontStyle: 'modern' | 'classic' | 'bold'): string {
  switch (fontStyle) {
    case 'classic': return '';   // handled via inline style
    case 'bold': return 'font-outfit';
    default: return 'font-inter';
  }
}

function getFontInlineStyle(fontStyle: 'modern' | 'classic' | 'bold'): React.CSSProperties {
  if (fontStyle === 'classic') return { fontFamily: 'Georgia, "Times New Roman", serif' };
  return {};
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0,0,0';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

export function CustomTemplate({ data, theme }: CustomTemplateProps) {
  const { accentColor, bgColor, fontStyle } = theme;
  const rgb = hexToRgb(accentColor);
  const fontClass = getFontClass(fontStyle);
  const fontInline = getFontInlineStyle(fontStyle);
  const isBold = fontStyle === 'bold';
  const firstName = data.fullName.split(' ')[0];
  const lastName = data.fullName.split(' ').slice(1).join(' ');

  return (
    <div
      className={`min-h-screen selection:bg-opacity-20 ${fontClass}`}
      style={{ backgroundColor: bgColor, color: '#1e293b', ...fontInline }}
    >
      {/* ── HEADER ── */}
      <header
        className="relative overflow-hidden px-10 py-12"
        style={{ backgroundColor: accentColor }}
      >
        {/* Geometric decoration */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)`,
            transform: 'translate(-30%, 40%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 max-w-4xl"
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            {data.role}
          </p>
          <h1
            className={`leading-none tracking-tight ${isBold ? 'font-black' : 'font-bold'}`}
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#fff' }}
          >
            {firstName}{' '}
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{lastName}</span>
          </h1>
          {/* Accent underline */}
          <div
            className="mt-5 h-0.5 w-16 rounded-full"
            style={{ background: 'rgba(255,255,255,0.4)' }}
          />
        </motion.div>
      </header>

      {/* ── BODY: two-column ── */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[70%_30%]">

        {/* ─── LEFT (70%): Experience + Education ─── */}
        <main className="px-8 py-10 space-y-12 border-r" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>

          {/* Professional Summary */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-3"
          >
            <CustomSectionTitle title="Sobre" accentColor={accentColor} />
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: '#475569', borderLeft: `3px solid rgba(${rgb},0.3)`, paddingLeft: '1rem' }}
            >
              {data.description}
            </p>
          </motion.section>

          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="space-y-6"
          >
            <CustomSectionTitle title="Experiência" accentColor={accentColor} icon={<Briefcase className="w-3.5 h-3.5" />} />
            <div className="space-y-7">
              {data.experience.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.09 }}
                  className="relative pl-6"
                  style={{ borderLeft: `2px solid rgba(${rgb},0.2)` }}
                >
                  {/* Timeline dot */}
                  <span
                    className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white"
                    style={{ borderColor: accentColor }}
                  />

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                    <div>
                      <h3
                        className={`text-[14px] leading-tight ${isBold ? 'font-black' : 'font-bold'}`}
                        style={{ color: '#0f172a' }}
                      >
                        {exp.position}
                      </h3>
                      <p className="text-[12px] font-semibold" style={{ color: accentColor }}>
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full self-start"
                      style={{
                        color: '#64748b',
                        background: `rgba(${rgb},0.08)`,
                        border: `1px solid rgba(${rgb},0.15)`,
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-slate-500 leading-relaxed">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: accentColor, opacity: 0.6 }}
                        />
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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="space-y-5"
          >
            <CustomSectionTitle title="Formação" accentColor={accentColor} icon={<GraduationCap className="w-3.5 h-3.5" />} />
            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: `rgba(${rgb},0.04)`,
                    border: `1px solid rgba(${rgb},0.1)`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className={`text-[13px] leading-tight ${isBold ? 'font-black' : 'font-bold'} text-slate-900`}>
                      {edu.degree}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{edu.institution}</p>
                    <p className="text-[11px] font-bold mt-1" style={{ color: accentColor }}>{edu.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </main>

        {/* ─── RIGHT (30%): Contact + Skills ─── */}
        <aside
          className="px-6 py-10 space-y-9"
          style={{ background: `rgba(${rgb},0.04)` }}
        >
          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4"
          >
            <h3
              className="text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: accentColor }}
            >
              Contato
            </h3>
            <div className="space-y-2.5">
              {data.email && (
                <CustomContactItem icon={<Mail className="w-3 h-3" />} value={data.email} accentColor={accentColor} rgb={rgb} />
              )}
              {data.phone && (
                <CustomContactItem icon={<Phone className="w-3 h-3" />} value={data.phone} accentColor={accentColor} rgb={rgb} />
              )}
              {data.location && (
                <CustomContactItem icon={<MapPin className="w-3 h-3" />} value={data.location} accentColor={accentColor} rgb={rgb} />
              )}
              {data.website && (
                <CustomContactItem icon={<Globe className="w-3 h-3" />} value={data.website} accentColor={accentColor} rgb={rgb} />
              )}
            </div>
          </motion.div>

          <div style={{ height: '1px', background: `rgba(${rgb},0.15)` }} />

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="space-y-4"
          >
            <h3
              className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5"
              style={{ color: accentColor }}
            >
              <Star className="w-3 h-3" />
              Competências
            </h3>
            <div className="space-y-3.5">
              {data.skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-slate-700 leading-snug">{skill.name}</span>
                    <span className="text-[10px] font-bold font-mono" style={{ color: accentColor }}>
                      {skill.level}%
                    </span>
                  </div>
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: `rgba(${rgb},0.12)` }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 text-center border-t"
        style={{ backgroundColor: bgColor, borderColor: 'rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-center opacity-40">
          <Image src="/pitchfolio-logo.png" alt="PitchFólio" width={110} height={26} />
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ──

function CustomSectionTitle({
  title,
  accentColor,
  icon,
}: {
  title: string;
  accentColor: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-2.5 pb-2"
      style={{ borderBottom: `2px solid rgba(${hexToRgb(accentColor)},0.15)` }}
    >
      {icon && (
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          {icon}
        </div>
      )}
      <h2 className="font-bold text-[13px] uppercase tracking-widest text-slate-900">{title}</h2>
    </div>
  );
}

function CustomContactItem({
  icon,
  value,
  accentColor,
  rgb,
}: {
  icon: React.ReactNode;
  value: string;
  accentColor: string;
  rgb: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `rgba(${rgb},0.15)`, color: accentColor }}
      >
        {icon}
      </div>
      <span className="text-[11px] text-slate-600 font-medium leading-snug break-all">{value}</span>
    </div>
  );
}
