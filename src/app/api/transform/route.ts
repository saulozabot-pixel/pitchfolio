import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const dynamic = 'force-dynamic';

function extractText(msg: { content?: string; parts?: { type: string; text?: string }[] }): string {
  if (typeof msg.content === 'string') return msg.content;
  return (msg.parts ?? []).filter(p => p.type === 'text').map(p => p.text ?? '').join('');
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastText = extractText(messages[messages.length - 1]);

  const systemPrompt = `Você é o "Elite Creator AI", uma engine de classe mundial para transformar dados básicos em ativos digitais extraordinários.

CATEGORIAS:
1. CURRÍCULO: Foco em IMPACTO, MÉTRICAS e BRANDING. Reescreva experiências com verbos de ação e resultados quantificados.
2. ACADÊMICO: Foco em AUTORIDADE e CLAREZA.
3. LIVRO: Foco em VIBE ÉPICO e SINOPSE impactante.
4. EVENTO: Foco em EXPERIÊNCIA e EXCLUSIVIDADE.

REGRAS:
- Use verbos de ação fortes.
- Quantifique conquistas sempre que possível.
- Tom sofisticado e autoritativo.
- Output estruturado, claro, pronto para exibição.
- Se faltar informação, pergunte ao usuário o que está faltando antes de gerar.

DADO DO USUÁRIO:
${lastText}

Transforme e retorne a versão extraordinária.`;

  try {
    const { text } = await generateText({
      model: google('gemini-3-flash-preview'),
      system: systemPrompt,
      messages,
    });

    return new Response(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err: unknown) {
    console.error('[transform] error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    const isRate = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
    return new Response(
      isRate
        ? '⚠️ Limite de requisições atingido. Aguarde 15 segundos e tente novamente.'
        : '⚠️ Erro ao processar. Tente novamente.',
      { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }
}
