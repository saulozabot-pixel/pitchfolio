import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('display_name, username')
    .eq('username', username)
    .eq('is_public', true)
    .single();

  if (!data) return { title: 'Portfólio não encontrado — PitchFólio' };

  return {
    title: `${data.display_name} — PitchFólio`,
    description: `Conheça o portfólio profissional de ${data.display_name}, criado com PitchFólio AI.`,
    openGraph: {
      title: `${data.display_name} — PitchFólio`,
      description: `Portfólio profissional criado com IA`,
      url: `https://pitchfolio-ai.vercel.app/u/${username}`,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single();

  if (!profile) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50/30 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <span className="text-xs font-bold pitch-gradient-text">PitchFólio</span>
            <span className="text-xs text-slate-400">/u/{username}</span>
          </div>

          <div className="w-20 h-20 rounded-2xl pitch-gradient flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg shadow-cyan-200">
            {profile.display_name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-2">{profile.display_name}</h1>
          <p className="text-slate-400 text-sm font-mono">pitchfolio-ai.vercel.app/u/{username}</p>
        </div>

        {/* Portfólio em breve */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-2">Portfólio em construção</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {profile.display_name} está preparando seu portfólio profissional com o PitchFólio AI.
            Em breve estará disponível aqui.
          </p>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-6">
          <a href="https://pitchfolio-ai.vercel.app" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Crie seu portfólio grátis com <span className="font-bold pitch-gradient-text">PitchFólio AI</span>
          </a>
        </div>
      </div>
    </div>
  );
}
