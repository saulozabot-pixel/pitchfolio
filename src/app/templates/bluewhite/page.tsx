'use client';

import { useEffect, useState } from 'react';
import { BlueWhiteTemplate } from "@/components/templates/BlueWhiteTemplate";
import { loadDraft } from '@/lib/pitchStore';

const mockData = {
  fullName: "Fernanda Araujo Lima",
  role: "Advogada Sênior — Direito Empresarial & Compliance",
  description: "Especialista em direito societário, contratos internacionais e programas de compliance corporativo. Atua em empresas de tecnologia, energia e finanças com foco em minimizar riscos regulatórios e fortalecer a governança institucional.",
  email: "fernanda.lima@araujoassociados.adv.br",
  phone: "+55 (21) 98876-1234",
  location: "Rio de Janeiro, RJ - Brasil",
  website: "araujoassociados.adv.br",
  skills: [
    { name: "Direito Societário & M&A", level: 96 },
    { name: "Compliance Corporativo", level: 94 },
    { name: "Contratos Internacionais", level: 90 },
    { name: "LGPD & Proteção de Dados", level: 92 },
    { name: "Arbitragem Empresarial", level: 87 }
  ],
  experience: [
    {
      company: "Araujo & Lima Associados",
      position: "Sócia-Fundadora",
      period: "2018 - Presente",
      achievements: [
        "Fundou escritório especializado em direito empresarial com foco em startups e scale-ups.",
        "Assessorou 3 rodadas de investimento Series A e B no ecossistema de tecnologia.",
        "Implementou programa de compliance premiado pela OAB-RJ como referência nacional."
      ]
    },
    {
      company: "Machado Meyer Advogados",
      position: "Advogada Associada Sênior",
      period: "2013 - 2018",
      achievements: [
        "Participou de transações de M&A avaliadas em mais de R$ 1,2 bilhão.",
        "Coordenou contratos de joint venture com parceiros europeus e asiáticos.",
        "Liderou equipe de 6 advogados em auditoria de contratos de infraestrutura."
      ]
    }
  ],
  education: [
    { institution: "Universidade do Estado do Rio de Janeiro (UERJ)", degree: "Direito — Bacharelado", period: "2007 - 2012" },
    { institution: "Instituto de Empresa (IE Business School)", degree: "LLM em Direito Internacional dos Negócios", period: "2012 - 2013" }
  ]
};

export default function BlueWhitePreview() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setData({ ...mockData, ...draft } as any);
  }, []);

  return <BlueWhiteTemplate data={data} />;
}
