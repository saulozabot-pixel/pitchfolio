import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { imageBase64 } = await req.json();
  if (!imageBase64) return NextResponse.json({ error: 'Imagem necessária' }, { status: 400 });

  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image' as const,
          image: Buffer.from(imageBase64, 'base64'),
        },
        {
          type: 'text',
          text: `Analise este cartão de visitas e extraia as informações. Retorne APENAS um JSON válido no formato:
{"name":"","title":"","company":"","email":"","phone":"","website":""}
Se um campo não estiver visível, deixe como string vazia. Retorne apenas o JSON, sem markdown.`,
        },
      ],
    }],
  });

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Não foi possível extrair os dados' }, { status: 422 });
  }
}
