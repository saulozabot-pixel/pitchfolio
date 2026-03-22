'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Star } from 'lucide-react';

interface RoseTemplateProps {
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

const rose = '#C4958A';
const roseMid = '#D4ADA3';
const roseLight = '#F0E4E1';
const charcoal = '#3D3D3D';
const greyMid = '#6B6B6B';
const greyLight = '#F7F4F3';

export function RoseTemplate({ data }: RoseTemplateProps) {
  return (
    <div style={{ fontFamily: "'Montserrat', 'Open Sans', sans-serif", background: '#FAF8F7', minHeight: '100vh', color: charcoal }}>

      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${charcoal} 0%, #4F4F4F 100%)`, padding: '64px 80px 48px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative rose blob */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 280, height: 280, borderRadius: '50%', background: rose, opacity: 0.12, filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: '30%', width: 200, height: 200, borderRadius: '50%', background: roseMid, opacity: 0.08, filter: 'blur(40px)' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 4, height: 40, background: rose, borderRadius: 2 }} />
            <div>
              <p style={{ color: roseMid, fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>Portfólio Profissional</p>
              <h1 style={{ color: '#FFFFFF', fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0 }}>
                {data.fullName}
              </h1>
            </div>
          </div>
          <p style={{ color: roseMid, fontSize: 18, fontWeight: 400, letterSpacing: '0.04em', maxWidth: 480, marginLeft: 16 }}>
            {data.role}
          </p>
        </motion.div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 56 }}>

        {/* Left — Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* Professional Profile */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SectionTitle icon={Star} label="Perfil Profissional" />
            <div style={{ background: roseLight, borderRadius: 16, padding: '24px 28px', borderLeft: `4px solid ${rose}`, marginTop: 20 }}>
              <p style={{ color: charcoal, fontSize: 15, lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                "{data.description}"
              </p>
            </div>
          </motion.section>

          {/* Experience */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SectionTitle icon={Briefcase} label="Experiência" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 20 }}>
              {data.experience.map((exp, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', border: '1px solid #EDE8E6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: charcoal, margin: 0 }}>{exp.position}</h3>
                      <p style={{ fontSize: 13, fontWeight: 700, color: rose, margin: '4px 0 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{exp.company}</p>
                    </div>
                    <span style={{ background: roseLight, color: rose, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap', border: `1px solid ${roseMid}` }}>
                      {exp.period}
                    </span>
                  </div>
                  <ul style={{ margin: '16px 0 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {exp.achievements.map((a, j) => (
                      <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: greyMid, lineHeight: 1.6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: rose, marginTop: 7, flexShrink: 0 }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Education */}
          {data.education.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <SectionTitle icon={GraduationCap} label="Formação" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', borderRadius: 14, padding: '18px 24px', border: '1px solid #EDE8E6' }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 15, color: charcoal, margin: 0 }}>{edu.degree}</p>
                      <p style={{ fontSize: 13, color: greyMid, margin: '4px 0 0' }}>{edu.institution}</p>
                    </div>
                    <span style={{ fontSize: 13, color: greyMid }}>{edu.period}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right — Sidebar */}
        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Contact */}
          <div style={{ background: charcoal, borderRadius: 20, padding: '28px 24px', color: '#FFFFFF' }}>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: roseMid, marginBottom: 20 }}>Contato</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {data.email && <ContactRow icon={Mail} label={data.email} />}
              {data.phone && <ContactRow icon={Phone} label={data.phone} />}
              {data.location && <ContactRow icon={MapPin} label={data.location} />}
              {data.website && <ContactRow icon={Globe} label={data.website} />}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '28px 24px', border: '1px solid #EDE8E6' }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: greyMid, marginBottom: 20 }}>Competências</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: charcoal }}>{skill.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: rose }}>{skill.level}%</span>
                    </div>
                    <div style={{ height: 5, background: roseLight, borderRadius: 999, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ delay: 0.5 + i * 0.07, duration: 0.6 }}
                        style={{ height: '100%', background: `linear-gradient(90deg, ${rose} 0%, ${roseMid} 100%)`, borderRadius: 999 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Pitch placeholder */}
          <div style={{ background: greyLight, borderRadius: 20, padding: '24px', border: '1px solid #EDE8E6', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: rose, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, color: charcoal, margin: '0 0 4px' }}>Video Pitch</p>
            <p style={{ fontSize: 12, color: greyMid, margin: 0 }}>Adicione sua apresentação em vídeo</p>
          </div>
        </motion.aside>
      </main>

      <footer style={{ borderTop: '1px solid #EDE8E6', padding: '32px 16px', textAlign: 'center', background: '#FAF8F7' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, opacity: 0.35 }}>
          <Image src="/pitchfolio-logo.png" alt="PitchFólio" width={110} height={26} />
        </div>
        <p style={{ fontSize: 10, color: greyMid, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, margin: 0 }}>
          Rose &amp; Grey Edition &bull; 2026
        </p>
      </footer>
    </div>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: roseLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon style={{ width: 18, height: 18, color: rose }} />
      </div>
      <h2 style={{ fontSize: 13, fontWeight: 800, color: charcoal, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>{label}</h2>
      <div style={{ flex: 1, height: 1, background: '#EDE8E6' }} />
    </div>
  );
}

function ContactRow({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(196,149,138,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: 15, height: 15, color: rose }} />
      </div>
      <span style={{ fontSize: 13, color: '#CCCCCC', wordBreak: 'break-all' }}>{label}</span>
    </div>
  );
}
