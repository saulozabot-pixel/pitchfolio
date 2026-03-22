'use client';

import { useEffect, useState } from 'react';
import { CustomTemplate } from "@/components/templates/CustomTemplate";
import { loadDraft } from '@/lib/pitchStore';

const mockData = {
  fullName: "Carlos Eduardo Drummond",
  role: "Diretor de Marketing & Growth — B2B SaaS",
  description: "Profissional de marketing com trajetória em empresas de tecnologia B2B. Especialista em construir estratégias de crescimento orgânico, branding de produto e campanhas de geração de demanda que conectam dados com criatividade.",
  email: "carlos.drummond@growthlab.io",
  phone: "+55 (31) 97654-3210",
  location: "Belo Horizonte, MG - Brasil",
  skills: [
    { name: "Product Marketing & Positioning", level: 95 },
    { name: "Growth Hacking & SEO", level: 91 },
    { name: "Campanhas Demand Gen (HubSpot)", level: 89 },
    { name: "Análise de Dados & BI", level: 85 },
    { name: "Gestão de Times Criativos", level: 93 }
  ],
  experience: [
    {
      company: "Contabilizei",
      position: "Head de Marketing",
      period: "2021 - Presente",
      achievements: [
        "Liderou crescimento de 120% no MRR através de estratégia de conteúdo e SEO.",
        "Estruturou pipeline de leads inbound gerando R$ 8M em ARR qualificado.",
        "Coordenou rebranding completo aumentando NPS de 42 para 71 pontos."
      ]
    },
    {
      company: "Totvs S.A.",
      position: "Gerente de Marketing de Produto",
      period: "2017 - 2021",
      achievements: [
        "Lançou 3 produtos no mercado B2B com GTM do zero.",
        "Reduziu CAC em 40% com campanhas de nurturing automatizadas.",
        "Criou programa de casos de sucesso que virou ativo de vendas chave."
      ]
    }
  ],
  education: [
    { institution: "PUC Minas", degree: "Comunicação Social — Publicidade e Propaganda", period: "2009 - 2013" },
    { institution: "Fundação Dom Cabral", degree: "Especialização em Gestão Estratégica de Marketing", period: "2016 - 2017" }
  ]
};

const ACCENT_COLORS = [
  { label: 'Azul', value: '#2563EB' },
  { label: 'Roxo', value: '#7C3AED' },
  { label: 'Verde', value: '#059669' },
  { label: 'Laranja', value: '#EA580C' },
  { label: 'Rosa', value: '#DB2777' },
  { label: 'Índigo', value: '#4F46E5' },
];

const FONT_STYLES: { label: string; value: 'modern' | 'classic' | 'bold' }[] = [
  { label: 'Moderno', value: 'modern' },
  { label: 'Clássico', value: 'classic' },
  { label: 'Impactante', value: 'bold' },
];

export default function CustomPreview() {
  const [data, setData] = useState(mockData);
  const [accent, setAccent] = useState('#2563EB');
  const [fontStyle, setFontStyle] = useState<'modern' | 'classic' | 'bold'>('modern');

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setData({ ...mockData, ...draft } as any);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Painel de personalização */}
      <aside className="w-72 shrink-0 bg-white border-r border-slate-200 p-6 space-y-8 sticky top-0 h-screen overflow-y-auto">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Personalizar</h2>
          <p className="text-xs text-slate-400">Ajuste as cores e tipografia do seu template.</p>
        </div>

        {/* Cor de destaque */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Cor de destaque</p>
          <div className="grid grid-cols-3 gap-2">
            {ACCENT_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setAccent(c.value)}
                className={`h-10 rounded-xl border-2 transition-all ${
                  accent === c.value ? 'border-slate-900 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
          {/* Custom hex */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accent}
              onChange={e => setAccent(e.target.value)}
              className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
            />
            <span className="text-xs font-mono text-slate-500">{accent}</span>
          </div>
        </div>

        {/* Tipografia */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tipografia</p>
          <div className="space-y-2">
            {FONT_STYLES.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFontStyle(f.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all border ${
                  fontStyle === f.value
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">Template Premium — personalizável</p>
        </div>
      </aside>

      {/* Preview */}
      <div className="flex-1 overflow-y-auto">
        <CustomTemplate
          data={data}
          theme={{ accentColor: accent, bgColor: '#FFFFFF', fontStyle }}
        />
      </div>
    </div>
  );
}
