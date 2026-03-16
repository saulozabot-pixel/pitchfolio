import { PioneerTemplate } from "@/components/templates/PioneerTemplate";

const mockData = {
  fullName: "Mariana Costa",
  role: "Principal Infrastructure Architect & Engineering Director",
  tagline: "Arquitetando sistemas resilientes para o futuro da computação distribuída.",
  about: "Com mais de 12 anos de experiência na linha de frente da tecnologia, foco em liderar transformações técnicas que unem escalabilidade massiva com cultura de engenharia de alta performance. Minha missão é abrir caminhos para a próxima geração de líderes técnicas.",
  email: "mariana.costa@pioneer.io",
  linkedin: "https://linkedin.com/in/marianacosta",
  github: "https://github.com/marianacosta",
  techStack: [
    { category: "Backend & Infra", skills: ["Go", "Rust", "Kubernetes", "AWS Suite", "Distributed Systems"] },
    { category: "Security", skills: ["DevSecOps", "Zero Trust Architecture", "Cryptographic Protocols"] },
    { category: "Architecture", skills: ["Event-Driven Design", "Microservices Optimization", "Data Mesh"] },
    { category: "Leadership", skills: ["VPE Management", "OKRs for Scale", "Engineering Hiring"] }
  ],
  projects: [
    {
      name: "Nebula Core Engine",
      description: "Desenvolvimento de um sistema de orquestração de containers de baixíssima latência para processamento de borda.",
      tech: ["Rust", "gRPC", "WebAssembly"],
      link: "#"
    },
    {
      name: "Global Data Fabric",
      description: "Arquitetura de uma malha de dados multirregional processando mais de 5 PB diários com consistência eventual.",
      tech: ["Kafka", "Cassandra", "Terraform"],
      link: "#"
    }
  ],
  leadership: [
    {
      title: "Cultura de Excelência",
      points: [
        "Redução do turnover técnico em 45% através de planos de carreira claros.",
        "Implementação de processos de revisão por pares que elevaram a qualidade do código em 60%.",
        "Pioneira no programa 'Women in Architecture' dentro da organização."
      ]
    },
    {
      title: "Escala Sustentável",
      points: [
        "Gerenciamento de um orçamento de infraestrutura de US$ 5M com economia de 20% anual.",
        "Liderança de uma organização global de 80+ engenheiros em 4 continentes.",
        "Definição do roadmap tecnológico para a próxima década da empresa."
      ]
    }
  ]
};

export default function PioneerPreview() {
  return <PioneerTemplate data={mockData} />;
}
