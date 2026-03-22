'use client';

import { useEffect, useState } from 'react';
import { HarmonyTemplate } from "@/components/templates/HarmonyTemplate";
import { loadDraft } from '@/lib/pitchStore';

const mockData = {
  fullName: "Ana Beatriz Rocha",
  role: "Software Engineer & Accessibility Advocate",
  description: "Desenvolvedora com foco em criar aplicações que todos podem usar. Sou uma profissional neurodivergente apaixonada por simplificar a complexidade técnica e garantir que a tecnologia seja uma ponte para a inclusão, não uma barreira.",
  email: "ana.rocha@harmony.ai",
  phone: "+55 (11) 98765-4321",
  location: "São Paulo, SP - Brasil",
  skills: [
    { name: "Web Accessibility (WCAG)", description: "Especialista em criar interfaces 100% navegáveis por tecnologias assistivas." },
    { name: "React Engineering", description: "Construção de componentes modulares com alta performance e legibilidade." },
    { name: "Inclusive UX Design", description: "Design focado em reduzir a carga cognitiva para usuários com TDAH e Autismo." }
  ],
  experience: [
    {
      company: "Tech4All Solutions", position: "Senior Frontend Engineer", period: "2021 - Presente",
      summary: "Liderando a iniciativa de acessibilidade nos produtos principais da empresa.",
      bullets: ["Aumentou em 40% a base de usuários ativos.", "Implementou um Design System inclusivo utilizado por 15 times."]
    },
    {
      company: "Future Lab", position: "Frontend Developer", period: "2019 - 2021",
      summary: "Desenvolvimento de dashboards complexos com foco em UX clara.",
      bullets: ["Otimizou a renderização de gráficos.", "Documentou guias de estilo focados em neurodiversidade."]
    }
  ],
  education: [{ institution: "Universidade de São Paulo (USP)", degree: "Ciência da Computação", period: "2015 - 2019" }]
};

export default function HarmonyPreview() {
  const [data, setData] = useState(mockData);
  useEffect(() => {
    const draft = loadDraft();
    if (!draft) return;
    setData({
      ...mockData,
      fullName: draft.fullName,
      role: draft.role,
      description: draft.description,
      email: draft.email ?? mockData.email,
      phone: draft.phone ?? mockData.phone,
      location: draft.location ?? mockData.location,
      skills: draft.skills.length > 0
        ? draft.skills.map(s => ({ name: s.name, description: `Proficiência: ${s.level}%` }))
        : mockData.skills,
      experience: draft.experience.length > 0
        ? draft.experience.map(e => ({
            company: e.company, position: e.position, period: e.period,
            summary: e.achievements[0] ?? '',
            bullets: e.achievements.slice(1),
          }))
        : mockData.experience,
      education: draft.education.length > 0 ? draft.education : mockData.education,
    });
  }, []);
  return <HarmonyTemplate data={data} />;
}
