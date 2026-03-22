'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, FileText, Video, Share2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: '/' },
  { icon: Sparkles,        label: 'Transformer',  href: '/transform' },
  { icon: FileText,        label: 'Templates',    href: '/templates' },
  { icon: Video,           label: 'Media Pitch',  href: '/media' },
  { icon: Share2,          label: 'Viral Growth', href: '/growth' },
  { icon: Settings,        label: 'Settings',     href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 p-5 flex flex-col hidden md:flex shrink-0">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-10 px-2 group">
        <div className="w-9 h-9 relative shrink-0">
          <Image
            src="/pitchfolio-logo.png"
            alt="PitchFólio"
            fill
            className="object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Fallback icon if logo not found */}
          <div className="w-9 h-9 pitch-gradient rounded-xl flex items-center justify-center absolute inset-0 opacity-0 group-has-[img[style*='none']]:opacity-100">
            <Sparkles className="text-white w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-[17px] font-black tracking-tight text-slate-900 leading-none">
            Pitch<span className="pitch-gradient-text">Fólio</span>
          </p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 font-semibold mt-0.5">
            Seu Portfólio ao Vivo
          </p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                active
                  ? "bg-cyan-50 text-cyan-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 pitch-gradient rounded-r-full" />
              )}
              <item.icon className={cn(
                "w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                active ? "text-cyan-500" : "text-slate-400"
              )} />
              <span className={cn(
                "text-sm font-semibold",
                active ? "text-slate-900" : ""
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-fuchsia-50 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 mb-3 font-medium">Pronto para ir ao ar?</p>
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl pitch-gradient text-white font-bold text-sm hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-md shadow-cyan-200"
          >
            Publicar Agora
          </button>
        </div>
      </div>
    </aside>
  );
}
