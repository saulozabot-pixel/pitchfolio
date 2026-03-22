'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Copy, CheckCircle, Clock, Loader2, MessageCircle, ArrowLeft } from 'lucide-react';

const PLAN_LABELS: Record<string, string> = {
  link: 'Link Personalizado',
  premium: 'Premium',
  ilimitado: 'Ilimitado',
};

const PERIOD_LABELS: Record<string, string> = {
  unico: 'pagamento único',
  mensal: 'mensal',
  semestral: 'semestral',
  anual: 'anual',
};

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const plan = params.plan as string;
  const period = searchParams.get('period') ?? 'unico';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pixData, setPixData] = useState<{
    id: string; qrCode: string; qrCodeImage: string; reference: string; value: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [polling, setPolling] = useState(false);

  // Gera o PIX ao montar
  useEffect(() => {
    async function generate() {
      setLoading(true);
      try {
        const res = await fetch('/api/pix/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, period }),
        });
        if (!res.ok) throw new Error('Erro ao gerar PIX');
        const data = await res.json();
        setPixData(data);
      } catch (e) {
        setError('Não foi possível gerar o PIX. Tente novamente ou fale conosco.');
      } finally {
        setLoading(false);
      }
    }
    generate();
  }, [plan, period]);

  // Polling para detectar pagamento automático
  const checkPayment = useCallback(async () => {
    if (!pixData?.reference || paid) return;
    setPolling(true);
    try {
      const res = await fetch(`/api/pix/webhook?ref=${pixData.reference}`);
      const data = await res.json();
      if (data.paid) {
        setPaid(true);
        setTimeout(() => router.push('/'), 3000);
      }
    } finally {
      setPolling(false);
    }
  }, [pixData?.reference, paid, router]);

  useEffect(() => {
    if (!pixData) return;
    // Verifica a cada 5 segundos
    const interval = setInterval(checkPayment, 5000);
    return () => clearInterval(interval);
  }, [pixData, checkPayment]);

  function copyCode() {
    if (!pixData?.qrCode) return;
    navigator.clipboard.writeText(pixData.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function formatValue(cents: number) {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Pagamento confirmado!</h2>
          <p className="text-slate-500 text-sm">Seu plano <strong>{PLAN_LABELS[plan]}</strong> foi ativado. Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => router.back()} className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div>
            <p className="text-xs text-slate-400 font-medium">Checkout</p>
            <p className="text-sm font-black text-slate-900">{PLAN_LABELS[plan] ?? plan} — {PERIOD_LABELS[period]}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 p-5 border-b border-slate-100">
            <div className="relative w-8 h-8">
              <Image src="/pitchfolio-icon.png" alt="PitchFólio" fill className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">PitchFólio</p>
              <p className="text-xs text-slate-400">Pagamento via PIX</p>
            </div>
            {pixData && (
              <span className="ml-auto text-xl font-black text-slate-900">{formatValue(pixData.value)}</span>
            )}
          </div>

          {/* QR Code */}
          <div className="p-6 flex flex-col items-center">
            {loading && (
              <div className="py-12 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <p className="text-sm text-slate-400">Gerando QR Code PIX...</p>
              </div>
            )}

            {error && (
              <div className="py-8 text-center space-y-4">
                <p className="text-sm text-red-500">{error}</p>
                <a
                  href="https://wa.me/5547988182649?text=Quero assinar o PitchFólio mas tive um erro no checkout."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
                </a>
              </div>
            )}

            {pixData && !error && (
              <>
                {/* QR Image */}
                {pixData.qrCodeImage ? (
                  <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-100 mb-5">
                    <img
                      src={`data:image/png;base64,${pixData.qrCodeImage}`}
                      alt="QR Code PIX"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                    <p className="text-xs text-slate-400 text-center px-4">Use o código abaixo para pagar</p>
                  </div>
                )}

                {/* Instruções */}
                <ol className="text-left space-y-2 mb-5 w-full">
                  {['Abra o app do seu banco', 'Escolha Pix → Pagar com QR Code', 'Escaneie o código ou copie abaixo', 'Pagamento detectado automaticamente!'].map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>

                {/* Copia-e-cola */}
                <button
                  type="button"
                  onClick={copyCode}
                  className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl border transition-all text-left ${
                    copied ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">PIX Copia e Cola</p>
                    <p className="text-xs text-slate-600 truncate font-mono">{pixData.qrCode.slice(0, 40)}...</p>
                  </div>
                  {copied
                    ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    : <Copy className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>

                {/* Status aguardando */}
                <div className="flex items-center gap-2 mt-5 text-xs text-slate-400">
                  {polling
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Clock className="w-3.5 h-3.5" />}
                  Aguardando confirmação do pagamento...
                </div>

                {/* Referência */}
                <p className="text-[10px] text-slate-300 mt-2 font-mono">Ref: {pixData.reference}</p>
              </>
            )}
          </div>
        </div>

        {/* Ajuda */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400 mb-2">Problema com o pagamento?</p>
          <a
            href="https://wa.me/5547988182649?text=Olá! Preciso de ajuda com o pagamento do PitchFólio."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
