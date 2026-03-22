'use client';

import { useEffect, useState } from 'react';
import { RoseTemplate } from '@/components/templates/RoseTemplate';
import { loadDraft } from '@/lib/pitchStore';

const mockData = {
  fullName: 'Seu Nome Completo',
  role: 'Consultora de Vendas e Atendimento',
  description: 'Profissional com trajetória sólida em vendas consultivas e atendimento ao cliente. Especialista em fidelização de clientes e resultados comerciais de alta performance.',
  email: 'seuemail@exemplo.com',
  phone: '+55 (81) 99999-9999',
  location: 'Recife, PE - Brasil',
  skills: [
    { name: 'Vendas Consultivas', level: 95 },
    { name: 'Atendimento ao Cliente', level: 98 },
    { name: 'Gestão de Estoque', level: 85 },
    { name: 'Fidelização de Clientes', level: 92 },
    { name: 'Comunicação', level: 90 },
  ],
  experience: [
    {
      company: 'Farmácia Pague Menos',
      position: 'Atendente de Farmácia',
      period: '2019 - 2021',
      achievements: [
        'Execução do atendimento direto ao público e suporte técnico sobre produtos.',
        'Gestão de estoque e controle de entrada/saída de mercadorias.',
        'Foco em agilidade operacional e excelência na jornada do consumidor.',
      ],
    },
  ],
  education: [],
};

export default function RosePreview() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setData({
        ...mockData,
        ...draft,
        email: draft.email ?? mockData.email,
        phone: draft.phone ?? mockData.phone,
        location: draft.location ?? mockData.location,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }
  }, []);

  return <RoseTemplate data={data} />;
}
