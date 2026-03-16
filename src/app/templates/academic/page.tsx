import { AcademicTemplate } from "@/components/templates/AcademicTemplate";

const mockAcademicData = {
  title: "Orquestração Genérica de Agentes Autônomos",
  subtitle: "O Impacto da Inteligência Artificial Agêntica na Redução da Sobrecarga Cognitiva Humana em Processos Operacionais Complexos",
  author: "Saulo Zabot Luciano",
  institution: "INSTITUTO DE TECNOLOGIA ELITE",
  department: "Centro de Desenvolvimento de Inteligência Artificial",
  advisor: "Dr. DeepMind Silver",
  abstract: "Esta pesquisa investiga os limites da automação através de agentes IA cooperativos. Propondo um modelo de orquestração descentralizada, o estudo demonstra como a substituição de fluxos rígidos por decisões orientadas a objetivos pode elevar a produtividade industrial em até 400%, redefinindo a relação entre criatividade humana e execução algorítmica.",
  year: 2026,
  chapters: [
    {
      title: "Fundamentos da IA Agêntica",
      content: "O advento dos Large Language Models trouxe a possibilidade de criar entidades que não apenas processam texto, mas planejam e executam tarefas. Este capítulo explora a evolução do GPT-4 para o Gemini 1.5 Pro e como a arquitetura de ferramentas (tool calling) permitiu o nascimento dos agentes.",
      keywords: ["LLM", "Autonomia", "Tool Calling", "Gemini"]
    },
    {
      title: "Arquitetura de Orquestração",
      content: "Proposta de um motor de decisão centralizado que distribui sub-tarefas para agentes especializados. O modelo foca em 'auto-correção' e 'verificação de qualidade' em tempo real, garantindo que a saída final seja extraordinária.",
      keywords: ["Microserviços", "Orquestração", "Agentes Especializados"]
    },
    {
      title: "Resultados e Impacto",
      content: "Análise de estudos de caso aplicados em ambientes de desenvolvimento ágil. O uso de agentes reduziu o tempo médio de deploy de 2 horas para 45 segundos, eliminando erros humanos em 99,8% das iterações testadas.",
      keywords: ["Escalabilidade", "ROI de Automação", "Eficiência"]
    }
  ],
  references: [
    "Silver, D. et al. (2025). Mastering General Agency in LLMs.",
    "Zabot, S. (2024). O Fim do Código Manual: A Ascensão do Copiloto Total.",
    "Vercel, N. J. (2026). The Future of UI: Generative Components.",
    "OpenAI Team (2024). Reasoning and Planning in Autonomous Agents."
  ]
};

export default function AcademicPreview() {
  return <AcademicTemplate data={mockAcademicData} />;
}
