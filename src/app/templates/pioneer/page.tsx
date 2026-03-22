'use client';

import { useEffect, useState } from 'react';
import { PioneerTemplate } from "@/components/templates/PioneerTemplate";
import { loadDraft } from '@/lib/pitchStore';

const mockData = {
  fullName: "Mariana Costa",
  role: "Principal Infrastructure Architect & Engineering Director",
  tagline: "Arquitetando sistemas resilientes para o futuro da computação distribuída.",
  about: "Com mais de 12 anos de experiência na linha de frente da tecnologia, foco em liderar transformações técnicas que unem escalabilidade massiva com cultura de engenharia de alta performance.",
  email: "mariana.costa@pioneer.io",
  linkedin: "https://linkedin.com/in/marianacosta",
  github: "https://github.com/marianacosta",
  techStack: [
    { category: "Backend & Infra", skills: ["Go", "Rust", "Kubernetes", "AWS Suite"] },
    { category: "Architecture", skills: ["Event-Driven Design", "Microservices", "Data Mesh"] },
    { category: "Leadership", skills: ["VPE Management", "OKRs for Scale", "Engineering Hiring"] }
  ],
  projects: [
    { name: "Nebula Core Engine", description: "Sistema de orquestração de containers de baixíssima latência.", tech: ["Rust", "gRPC"], link: "#" },
    { name: "Global Data Fabric", description: "Malha de dados multirregional processando 5 PB diários.", tech: ["Kafka", "Terraform"], link: "#" }
  ],
  leadership: [
    { title: "Resultados", points: ["Redução do turnover em 45%.", "Elevação da qualidade do código em 60%.", "Gestão de orçamento de US$ 5M."] }
  ]
};

export default function PioneerPreview() {
  const [data, setData] = useState(mockData);
  useEffect(() => {
    const draft = loadDraft();
    if (!draft) return;
    setData({
      ...mockData,
      fullName: draft.fullName,
      role: draft.role,
      tagline: draft.description.slice(0, 120),
      about: draft.description,
      email: draft.email ?? mockData.email,
      techStack: draft.skills.length > 0
        ? [{ category: 'Competências', skills: draft.skills.map(s => s.name) }]
        : mockData.techStack,
      leadership: draft.experience.length > 0
        ? draft.experience.map(e => ({ title: `${e.position} — ${e.company} (${e.period})`, points: e.achievements }))
        : mockData.leadership,
    });
  }, []);
  return <PioneerTemplate data={data} />;
}
