import { fal } from '@fal-ai/client';
import { NextRequest, NextResponse } from 'next/server';

fal.config({ credentials: process.env.FAL_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File;
    const style = (formData.get('style') as string) || 'professional';

    if (!file) {
      return NextResponse.json({ error: 'Nenhuma foto enviada.' }, { status: 400 });
    }

    // Converte para base64 para enviar ao fal.ai
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    const stylePrompts: Record<string, string> = {
      professional: 'professional LinkedIn headshot, business attire, clean background, studio lighting, sharp focus, high quality',
      executive: 'executive corporate portrait, formal suit, confident expression, premium studio lighting, white background',
      creative: 'creative professional headshot, modern artistic style, colorful bokeh background, warm lighting',
      casual: 'modern casual professional photo, friendly smile, natural light, lifestyle background',
    };

    const prompt = stylePrompts[style] || stylePrompts.professional;

    const input: Record<string, unknown> = {
      image_archive_url: dataUrl,
      prompt: `img, ${prompt}`,
      negative_prompt: 'bad quality, blurry, ugly, distorted face, multiple people',
      style_name: 'Photographic (Default)',
      num_images: 1,
      guidance_scale: 5,
      num_inference_steps: 30,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (fal.subscribe as any)('fal-ai/photomaker', { input });

    const output = result as { images?: { url: string }[] };
    const imageUrl = output?.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Falha ao gerar foto.' }, { status: 500 });
    }

    return NextResponse.json({ url: imageUrl });

  } catch (err) {
    console.error('photo error:', err);
    return NextResponse.json({ error: 'Erro interno ao processar foto.' }, { status: 500 });
  }
}
