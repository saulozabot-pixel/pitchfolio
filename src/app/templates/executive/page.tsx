'use client';

import { useEffect, useState } from 'react';
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";
import { loadDraft } from '@/lib/pitchStore';

const mockData = {
  fullName: "Ricardo Menezes Cavalcanti",
  role: "Chief Financial Officer & Estrategista de Crescimento",
  description: "Executivo com 18 anos de experiência em finanças corporativas, fusões e aquisições e expansão internacional. Especialista em transformar estruturas financeiras complexas em vantagens competitivas sustentáveis para empresas de médio e grande porte.",
  email: "r.cavalcanti@execmail.com.br",
  phone: "+55 (11) 99234-5678",
  location: "São Paulo, SP - Brasil",
  skills: [
    { name: "Finanças Corporativas & M&A", level: 97 },
    { name: "Planejamento Estratégico", level: 94 },
    { name: "Gestão de Riscos", level: 91 },
    { name: "Reestruturação Organizacional", level: 88 },
    { name: "Relacionamento com Investidores", level: 93 }
  ],
  experience: [
    {
      company: "Grupo Meridian Brasil",
      position: "Chief Financial Officer",
      period: "2019 - Presente",
      achievements: [
        "Liderou processo de IPO avaliado em R$ 2,4 bilhões na B3.",
        "Reduziu o custo de capital em 22% através de refinanciamento estratégico da dívida.",
        "Estruturou 4 aquisições em mercados emergentes da América Latina."
      ]
    },
    {
      company: "Banco Altus S.A.",
      position: "Diretor de Finanças Corporativas",
      period: "2014 - 2019",
      achievements: [
        "Gerenciou carteira de crédito corporativo superior a R$ 800 milhões.",
        "Implementou modelo de avaliação de risco que reduziu inadimplência em 35%.",
        "Coordenou integração pós-fusão com banco regional do Nordeste."
      ]
    },
    {
      company: "Deloitte Brasil",
      position: "Senior Manager — Advisory",
      period: "2008 - 2014",
      achievements: [
        "Conduziu due diligence em mais de 30 transações de M&A.",
        "Desenvolveu modelos de valuation para clientes dos setores de energia e varejo.",
        "Liderou equipe de 12 consultores em projetos de transformação financeira."
      ]
    }
  ],
  education: [
    { institution: "FGV EAESP", degree: "MBA Executivo em Finanças", period: "2012 - 2014" },
    { institution: "Universidade de São Paulo (USP)", degree: "Ciências Contábeis", period: "2001 - 2005" }
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
