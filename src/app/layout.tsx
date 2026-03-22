import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthHeader } from "@/components/AuthHeader";
import { BottomNav } from "@/components/BottomNav";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#06b6d4',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "PitchFólio | Transforme seu Portfólio em Experiência",
  description: "IA que transforma seus dados profissionais em ativos extraordinários — CVs, pitches em vídeo, portfólios e muito mais.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PitchFólio',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/pitchfolio-icon.png',
    apple: '/pitchfolio-icon.png',
    shortcut: '/pitchfolio-icon.png',
  },
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
            {/* Desktop sidebar — hidden on mobile */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative md:pb-0 main-content">
              {/* Desktop auth header */}
              <div className="hidden md:block">
                <AuthHeader />
              </div>

              {/* Mobile top spacing (height of top app bar) */}
              <div className="md:hidden h-14" />

              {children}
            </main>
          </div>

          {/* Mobile bottom nav + top app bar */}
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
