import { PublishingTemplate } from "@/components/templates/PublishingTemplate";

const mockPublishingData = {
  title: "CÓDIGO DE ELITE",
  subtitle: "A Arte de Orquestrar o Caos Tecnológico em Sistemas extraordinários.",
  author: "Saulo Zabot",
  genre: "High-Tech Strategy",
  synopsis: "Como um mestre artesão do século XXI, Saulo Zabot revela os segredos para transformar linhas de código em ativos digitais que geram lucro, impacto e autoridade. Um guia definitivo para quem deseja sair do binário e entrar no extraordinário.",
  theme: {
    baseColor: "#1e1b4b", // Deep Indigo
    accentColor: "#facc15", // Electric Yellow
    vibe: 'epic' as const
  },
  features: [
    { name: "3D Cover rendering", level: 100 },
    { name: "Dynamic Synopsis AI", level: 100 },
    { name: "One-Click Publishing", level: 100 },
    { name: "Viral Sales Loops", level: 100 }
  ].map(f => f.name) // Simplified for the feature mapping in template
};

export default function PublishingPreview() {
  return <PublishingTemplate data={mockPublishingData} />;
}
