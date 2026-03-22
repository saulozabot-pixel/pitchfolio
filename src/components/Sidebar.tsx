'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Video, Settings, Share2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/' },
  { icon: Sparkles,        label: 'Transformer', href: '/transform' },
  { icon: FileText,        label: 'Templates',   href: '/templates' },
  { icon: Video,           label: 'Media Pitch', href: '/media' },
  { icon: Share2,          label: 'Viral Growth',href: '/growth' },
  { icon: Settings,        label: 'Settings',    href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 h-screen glass border-r border-white/10 p-6 flex flex-col hidden md:flex">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Elite Creator <span className="text-purple-400">AI</span></h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold italic">Extraordinary Assets</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-white/5",
                active ? "bg-white/10 text-white shadow-xl" : "text-zinc-400 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                active ? "text-purple-400" : "text-zinc-500"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 text-center">
          <p className="text-xs text-zinc-500 mb-2">Ready to go live?</p>
          <button type="button" className="w-full py-2 px-4 rounded-xl gold-gradient text-black font-bold text-sm hover:scale-105 transition-transform duration-300">
            Go Extraordinary
          </button>
        </div>
      </div>
    </aside>
  );
}
