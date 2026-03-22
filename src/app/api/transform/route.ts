import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `Você é o PitchFólio AI, uma engine de classe mundial para transformar dados brutos em ativos digitais extraordinários.

COMPORTAMENTO:
- Quando o usuário enviar dados (currículo, bio, experiências, trabalho acadêmico, ideia de livro, evento), transforme IMEDIATAMENTE em output extraordinário.
- Não peça confirmação de categoria — detecte automaticamente pelo conteúdo.
- Não invente dados. Use APENAS o que o usuário forneceu.
- Se o conteúdo for claramente um currículo/CV, reescreva com verbos de ação fortes e resultados quantificados.
- Se o conteúdo for acadêmico, priorize autoridade e clareza.
- Se for livro ou evento, foque em impacto e exclusividade.
- Tom sofisticado, direto, pronto para publicação.
- Se o usuário enviar texto vago demais (menos de 30 palavras sem contexto real), peça mais detalhes de forma objetiva.`;

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
