'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Zap, Crown, Infinity, MessageCircle, ChevronDown, ChevronUp, Star } from 'lucide-react';

type Period = 'mensal' | 'semestral' | 'anual';

const PRICES = {
  premium: { mensal: 29.90, semestral: 24.90, anual: 19.90 },
  ilimitado: { mensal: 59.90, semestral: 49.90, anual: 39.90 },
};

const DISCOUNTS = {
  mensal: null,
  semestral: '17% off',
  anual: '34% off',
};

const PERIOD_LABELS = {
  mensal: 'mês',
  semestral: 'mês (cobrado a cada 6 meses)',
  anual: 'mês (cobrado anualmente)',
};

export default function PricingPage() {
  const [period, setPeriod] = useState<Period>('mensal');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-600 text-xs font-bold uppercase tracking-wide mb-4">
          <Zap className="w-3 h-3" />
          Planos PitchFólio
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 mb-3">
          Invista no seu<br className="md:hidden" /> <span style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>posicionamento</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
          Portfólios que te fazem ser lembrado. Escolha o plano ideal.
        </p>
      </div>

      {/* Period toggle */}
      <div className="flex items-center justify-center gap-2 px-4 mb-8">
        {(['mensal', 'semestral', 'anual'] as Period[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              period === p
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
            {DISCOUNTS[p] && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {DISCOUNTS[p]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="px-4 md:px-8 max-w-4xl mx-auto space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-5 mb-8">

        {/* Link Personalizado */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Link</p>
          <h2 className="text-xl font-black text-slate-900 mb-1">Personalizado</h2>
          <div className="flex items-end gap-1 mb-4">
            <span className="text-4xl font-black text-slate-900">R$7</span>
            <span className="text-xl font-black text-slate-900">,99</span>
            <span className="text-slate-400 text-sm mb-1 ml-1">único</span>
          </div>
          <p className="text-slate-500 text-sm mb-5">
            Seu link único para sempre:<br />
            <span className="font-mono text-xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded mt-1 inline-block">
              pitchfolio-ai.vercel.app/u/seu-nome
            </span>
          </p>
          <ul className="space-y-2 mb-6">
            {['Link personalizado com seu nome', 'Compartilhe em qualquer lugar', 'QR Code incluso', 'Válido para sempre'].map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/pricing/checkout/link"
            className="block w-full py-3 rounded-xl bg-cyan-500 text-white font-bold text-sm text-center hover:bg-cyan-600 transition-colors"
          >
            Quero meu link →
          </Link>
        </div>

        {/* Premium */}
        <div className="relative bg-slate-900 rounded-2xl p-6 shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20"
               style={{ background: 'radial-gradient(ellipse at top right, #06b6d4 0%, transparent 60%)' }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="bg-cyan-400/20 text-cyan-300 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                Mais popular
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Premium</p>
            <h2 className="text-xl font-black text-white mb-1">30 trabalhos/mês</h2>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-black text-white">R${PRICES.premium[period].toFixed(2).replace('.', ',')}</span>
              <span className="text-slate-400 text-sm mb-1 ml-1">/{PERIOD_LABELS[period]}</span>
            </div>
            {period !== 'mensal' && (
              <p className="text-cyan-400 text-xs font-bold mb-4">Economize com o plano {period}</p>
            )}
            <ul className="space-y-2 mb-6 mt-4">
              {['30 portfólios por mês', 'Todos os templates', 'Transformer IA', 'Media Pitch', 'Viral Growth', 'Link personalizado'].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/pricing/checkout/premium?period=${period}`}
              className="block w-full py-3 rounded-xl font-bold text-sm text-center text-slate-900 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }}
            >
              Assinar Premium →
            </Link>
          </div>
        </div>

        {/* Ilimitado */}
        <div className="bg-white rounded-2xl border-2 border-fuchsia-200 p-6 shadow-sm relative">
          <div className="absolute top-4 right-4">
            <Star className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center mb-4">
            <Infinity className="w-5 h-5 text-fuchsia-500" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ilimitado</p>
          <h2 className="text-xl font-black text-slate-900 mb-1">Sem limites</h2>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-black text-slate-900">R${PRICES.ilimitado[period].toFixed(2).replace('.', ',')}</span>
            <span className="text-slate-400 text-sm mb-1 ml-1">/{PERIOD_LABELS[period]}</span>
          </div>
          {period !== 'mensal' && (
            <p className="text-fuchsia-500 text-xs font-bold mb-4">Economize com o plano {period}</p>
          )}
          <ul className="space-y-2 mb-6 mt-4">
            {['Trabalhos ilimitados', 'Todos os templates', 'Transformer IA ilimitado', 'Media Pitch', 'Viral Growth', 'Link personalizado', 'Suporte prioritário'].map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-fuchsia-500 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={`/pricing/checkout/ilimitado?period=${period}`}
            className="block w-full py-3 rounded-xl font-bold text-sm text-center text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
          >
            Assinar Ilimitado →
          </Link>
        </div>
      </div>

      {/* Outras formas */}
      <div className="px-4 md:px-8 max-w-4xl mx-auto mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-bold text-slate-700">Outras formas de pagamento</p>
            <p className="text-xs text-slate-400 mt-0.5">Boleto, cartão de crédito, Pix parcelado — entre em contato</p>
          </div>
          <a
            href="https://wa.me/5547988182649?text=Olá! Quero assinar o PitchFólio e preciso de outra forma de pagamento."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-4 md:px-8 max-w-2xl mx-auto pb-16">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center mb-4">Dúvidas frequentes</h3>
        {[
          { q: 'Como funciona o pagamento?', a: 'Você gera um QR Code PIX único para o seu pedido. Após o pagamento ser confirmado, o acesso é liberado automaticamente em segundos.' },
          { q: 'O link de R$7,99 é para sempre?', a: 'Sim! É um pagamento único. Seu link personalizado (pitchfolio-ai.vercel.app/u/seu-nome) fica ativo para sempre.' },
          { q: 'Posso cancelar a assinatura?', a: 'Sim, a qualquer momento. O acesso continua até o fim do período pago.' },
          { q: 'Qual a diferença entre Premium e Ilimitado?', a: 'O Premium permite até 30 portfólios/trabalhos por mês. O Ilimitado não tem restrição de quantidade.' },
          { q: 'O desconto semestral/anual é automático?', a: 'Sim! Ao escolher o plano semestral ou anual, o valor já aparece com o desconto aplicado.' },
        ].map((faq, i) => (
          <div key={i} className="border-b border-slate-100 last:border-0">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left gap-4"
            >
              <span className="text-sm font-semibold text-slate-700">{faq.q}</span>
              {openFaq === i
                ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
            </button>
            {openFaq === i && (
              <p className="text-sm text-slate-500 pb-4 leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
