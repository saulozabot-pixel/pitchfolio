'use client';
import { useEffect, useState } from 'react';
import { PublishingTemplate } from "@/components/templates/PublishingTemplate";
import { loadDraft } from '@/lib/pitchStore';

const mockPublishingData = {
  title: "A MENTE DO FUNDADOR",
  subtitle: "Como Líderes que Constroem do Zero Pensam, Decidem e Sobrevivem.",
  author: "João Paulo Ramos",
  genre: "Negócios & Empreendedorismo",
  synopsis: "João Paulo Ramos mergulha na psicologia dos fundadores de startups que construíram empresas do zero. Através de entrevistas com mais de 80 empreendedores brasileiros e pesquisa comportamental inédita, o livro revela os padrões mentais que separam quem desiste de quem escala — e como qualquer pessoa pode desenvolver a mentalidade de fundador, independentemente de ter uma empresa.",
  theme: {
    baseColor: "#0f172a",
    accentColor: "#f59e0b",
    vibe: 'epic' as const
  },
  features: [
    { name: "3D Cover rendering", level: 100 },
    { name: "Dynamic Synopsis AI", level: 100 },
    { name: "One-Click Publishing", level: 100 },
    { name: "Viral Sales Loops", level: 100 }
  ].map(f => f.name)
};

export default function PublishingPreview() {
  const [data, setData] = useState(mockPublishingData);
  useEffect(() => {
    const draft = loadDraft();
    if (!draft) return;
    setData(prev => ({ ...prev, author: draft.fullName, synopsis: draft.description }));
  }, []);
  return <PublishingTemplate data={data} />;
}
