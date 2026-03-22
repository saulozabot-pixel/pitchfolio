import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthHeader } from "@/components/AuthHeader";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Elite Creator AI | Extraordinary Asset Engine",
  description: "Transform raw data into extraordinary resumes, academic works, book covers, and premium invitations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.variable} ${outfit.variable} font-inter overflow-hidden bg-[#09090b]`}>
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[140px]" />
            <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-pink-600 rounded-full blur-[120px]" />
          </div>

          <div className="flex">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto relative">
              <AuthHeader />
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
