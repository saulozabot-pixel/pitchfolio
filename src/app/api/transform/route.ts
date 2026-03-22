import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const dynamic = 'force-dynamic';

type MsgIn = {
  role: 'user' | 'assistant';
  content: string;
  image?: { dataUrl: string; mimeType: string };
};

export async function POST(req: Request) {
  const { messages }: { messages: MsgIn[] } = await req.json();

  const systemPrompt = `Você é o PitchFólio AI, uma engine para reescrever dados profissionais reais.

REGRAS ABSOLUTAS:
1. NUNCA invente nomes, cargos, empresas, datas, estilos, paletas de cores ou branding. ZERO invenção.
2. Se o usuário não enviou dados reais (currículo, experiências, bio, texto acadêmico, ideia de livro), responda APENAS: "Por favor, cole aqui o conteúdo real que deseja transformar — seu currículo, bio ou dados profissionais."
3. Só transforme quando houver conteúdo real e substancial fornecido pelo usuário.
4. Se houver conteúdo real: reescreva com verbos de ação fortes, resultados quantificados, tom sofisticado. Use APENAS os dados fornecidos.
5. Se receber imagem: leia todo o texto visível na imagem e transforme com base nele.`;

  // Converte mensagens para formato multimodal do AI SDK
  const sdkMessages = messages.map(m => {
    if (m.image) {
      const base64 = m.image.dataUrl.replace(/^data:[^;]+;base64,/, '');
      return {
        role: m.role as 'user' | 'assistant',
        content: [
          { type: 'image' as const, image: base64, mimeType: m.image.mimeType as 'image/png' | 'image/jpeg' | 'image/webp' },
          ...(m.content ? [{ type: 'text' as const, text: m.content }] : []),
        ],
      };
    }
    return { role: m.role as 'user' | 'assistant', content: m.content };
  });

  try {
    const { text } = await generateText({
      model: google('gemini-3-flash-preview'),
      system: systemPrompt,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: sdkMessages as any,
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
