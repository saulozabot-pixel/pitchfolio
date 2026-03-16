import { HarmonyTemplate } from "@/components/templates/HarmonyTemplate";

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
      company: "Tech4All Solutions",
      position: "Senior Frontend Engineer",
      period: "2021 - Presente",
      summary: "Liderando a iniciativa de acessibilidade nos produtos principais da empresa.",
      bullets: [
        "Aumentou em 40% a base de usuários ativos através de melhorias em A11y.",
        "Implementou um Design System inclusivo utilizado por 15 times diferentes.",
        "Reduziu o tempo de resposta do suporte para usuários PCD em 30%."
      ]
    },
    {
      company: "Future Lab",
      position: "Frontend Developer",
      period: "2019 - 2021",
      summary: "Desenvolvimento de dashboards complexos com foco em UX clara.",
      bullets: [
        "Otimizou a renderização de gráficos complexos para melhor legibilidade.",
        "Documentou guias de estilo focados em neurodiversidade."
      ]
    }
  ],
  education: [
    {
      institution: "Universidade de São Paulo (USP)",
      degree: "Ciência da Computação",
      period: "2015 - 2019"
    }
  ]
};

export default function HarmonyPreview() {
  return <HarmonyTemplate data={mockData} />;
}
