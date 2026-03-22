import { EventTemplate } from "@/components/templates/EventTemplate";

const mockEventData = {
  title: "A ERA DOS AGENTES",
  type: 'launch' as const,
  date: "25 de Julho, 2026",
  time: "20:00 - 02:00",
  location: {
    name: "Pixel Tower Sanctuary",
    address: "Av. Faria Lima, 4500 - São Paulo, SP",
  },
  description: "Não é apenas um lançamento. É o início de uma nova era criativa. Uma noite imersiva onde mentes visionárias se encontram para celebrar o futuro — com arte, tecnologia e conexões que transformam.",
  rsvpDeadline: "10 de Julho",
  theme: {
    primaryColor: "#c4b5fd", // Soft Violet
    secondaryColor: "#fbbf24", // Gold
    fontFamily: 'serif' as const,
  },
};

export default function EventPreview() {
  return <EventTemplate data={mockEventData} />;
}
