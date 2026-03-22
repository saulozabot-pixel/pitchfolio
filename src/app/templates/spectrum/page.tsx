'use client';

import { SpectrumTemplate } from "@/components/templates/SpectrumTemplate";
import { Instagram, Twitter, Music, Camera, Mail } from 'lucide-react';

const mockData = {
  name: "Leo Valente",
  identities: ["LGBTQ+", "Creative Soul", "Neuro-Unique"],
  bio: "Sou um visionário criativo que habita a interseção entre design, ativismo e tecnologia. Minha arte é um espectro de cores e ideias que desafiam o status quo e celebram a pluralidade da existência humana.",
  colors: {
    primary: "#f472b6", // Pink
    secondary: "#818cf8", // Indigo
    accent: "#fbbf24", // Amber
  },
  manifesto: "Existir é um ato de criação constante. Cada projeto é uma cor a mais no arco-íris da revolução digital.",
  works: [
    { title: "Prisma Visuals", category: "Digital Art", image: "#" },
    { title: "Fluid Identity", category: "Exhibition", image: "#" },
    { title: "Echo Chamber", category: "Interactive Install", image: "#" },
    { title: "Rainbow Code", category: "Open Source", image: "#" },
    { title: "Queer Tech Hub", category: "Community", image: "#" },
    { title: "Neon Nights", category: "Photography", image: "#" }
  ],
  socials: [
    { platform: "Instagram", url: "#", icon: Instagram },
    { platform: "Twitter", url: "#", icon: Twitter },
    { platform: "Behance", url: "#", icon: Camera },
    { platform: "Spotify", url: "#", icon: Music },
    { platform: "Personal", url: "#", icon: Mail }
  ]
};

export default function SpectrumPreview() {
  return <SpectrumTemplate data={mockData} />;
}
