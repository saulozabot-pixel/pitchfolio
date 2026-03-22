'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Wand2, LayoutTemplate, TrendingUp, Settings } from 'lucide-react';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';

const NAV_ITEMS = [
  { icon: Home,           label: 'Início',      href: '/' },
  { icon: Wand2,          label: 'Transformer', href: '/transform' },
  { icon: LayoutTemplate, label: 'Templates',   href: '/templates' },
  { icon: TrendingUp,     label: 'Growth',      href: '/growth' },
  { icon: Settings,       label: 'Config',      href: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/pitchfolio-icon.png" alt="PitchFólio" fill className="object-contain" priority />
          </div>
          <span className="font-black text-base tracking-tight">
            Pitch<span style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fólio</span>
          </span>
        </Link>
        {/* Auth slot */}
        {isSignedIn
          ? <UserButton />
          : <SignInButton mode="modal"><button type="button" className="text-xs font-bold pitch-gradient-text">Entrar</button></SignInButton>
        }
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch h-16">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200 active:scale-95"
              >
                {/* Active indicator pill */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
                        style={{ background: 'linear-gradient(90deg, #06b6d4, #a855f7)' }} />
                )}

                {/* Icon container */}
                <div className={`w-10 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${
                  active ? 'scale-110' : ''
                }`}>
                  <item.icon
                    className="w-[22px] h-[22px] transition-colors duration-200"
                    style={active ? {
                      color: '#06b6d4',
                      filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.5))'
                    } : { color: '#94a3b8' }}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </div>

                <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                  active ? 'text-cyan-500' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="md:hidden h-16" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </>
  );
}
