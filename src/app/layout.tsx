import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

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
            <main className="flex-1 h-screen overflow-y-auto">
              <div className="absolute top-6 right-8 z-50">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-6 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors">
                      Elite Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-10 h-10 border-2 border-purple-500/50"
                      }
                    }} 
                  />
                </SignedIn>
              </div>
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
