import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthHeader } from "@/components/AuthHeader";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "PitchFólio | Transforme seu Portfólio em Experiência",
  description: "IA que transforma seus dados profissionais em ativos extraordinários — CVs, pitches em vídeo, portfólios e muito mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={`${inter.variable} ${outfit.variable} font-inter bg-slate-50`}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
              <AuthHeader />
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
