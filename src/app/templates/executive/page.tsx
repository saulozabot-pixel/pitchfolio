'use client';

import { useEffect, useState } from 'react';
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";
import { loadDraft } from '@/lib/pitchStore';

const mockData = {
  fullName: "Saulo Zabot Luciano",
  role: "Diretor de Operações & Especialista em Automação IA",
  description: "Estrategista focado em orquestrar ecossistemas tecnológicos para escala exponencial. Especialista em transformar automações complexas em ativos lucrativos de alta performance, unindo inteligência artificial a processos operacionais de elite.",
  email: "saulo.zabot@elite.ai",
  phone: "+55 (47) 98818-2649",
  location: "Gaspar, SC - Brasil",
  skills: [
    { name: "Orquestração de Agentes IA", level: 98 },
    { name: "Full Stack Architecture", level: 92 },
    { name: "Gestão de Operações Escalonáveis", level: 95 },
    { name: "Automação de Processos Críticos", level: 99 },
    { name: "Python & Machine Learning Workflow", level: 88 }
  ],
  experience: [
    {
      company: "Elite CV AI Engine",
      position: "Founder & Lead Architect",
      period: "2024 - Presente",
      achievements: [
        "Desenvolveu o primeiro 'Resume Transformer' baseado em Gemini 1.5 Pro do mercado.",
        "Implementou arquitetura multi-tenant para hospedagem viral de perfis interativos.",
        "Acelerou o tempo de criação de perfis premium em 90% através de LLMs otimizados."
      ]
    },
    {
      company: "RC Empreendimentos Hoteleiros",
      position: "Gerente Operacional",
      period: "2018 - 2019",
      achievements: [
        "Gerenciou equipes multidisciplinares com foco em eficiência e redução de custos.",
        "Implementou sistemas de controle rigorosos para manutenção e suprimentos.",
        "Otimizou processos operacionais elevando a nota de satisfação dos clientes."
      ]
    }
  ],
  education: [
    {
      institution: "ESTÁCIO/UNIP",
      degree: "Engenharia Mecânica",
      period: "2014 - 2018"
    }
  ]
};

export default function ExecutivePreview() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setData({
      ...mockData,
      ...draft,
      email: draft.email ?? mockData.email,
      phone: draft.phone ?? mockData.phone,
      location: draft.location ?? mockData.location,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }, []);

  return <ExecutiveTemplate data={data} />;
}
