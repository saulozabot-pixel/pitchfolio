import { NextRequest, NextResponse } from 'next/server';

const MAX_CHARS = 12000;

function truncate(text: string): string {
  if (text.length <= MAX_CHARS) return text.trim();
  return text.trim().slice(0, MAX_CHARS) + '\n\n[...conteúdo truncado para processamento]';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'Nenhum arquivo.' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const name = file.name.toLowerCase();

    // TXT / MD — extrai direto
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.doc')) {
      return NextResponse.json({ text: truncate(buffer.toString('utf-8')) });
    }

    // DOCX — usa mammoth
    if (name.endsWith('.docx') || name.endsWith('.doc')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      if (result.value?.trim()) {
        return NextResponse.json({ text: truncate(result.value) });
      }
      return NextResponse.json({ error: 'Word sem texto extraível.' }, { status: 422 });
    }

    // PDF — Gemini REST API
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key não configurada.' }, { status: 500 });
    }

    const base64 = buffer.toString('base64');
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [
            { inlineData: { mimeType: 'application/pdf', data: base64 } },
            { text: 'Extraia todo o texto deste currículo exatamente como está, sem resumir. Retorne apenas o texto puro.' },
          ]}],
        }),
      }
    );

    if (!resp.ok) {
      const errBody = await resp.text();
      console.error('[extract-pdf] Gemini error', resp.status, errBody);
      return NextResponse.json({
        error: 'Erro ao processar PDF.',
        detail: `Gemini ${resp.status}: ${errBody.slice(0, 300)}`,
      }, { status: 502 });
    }

    const json = await resp.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;

    if (!text?.trim()) {
      return NextResponse.json({ error: 'PDF sem texto extraível.' }, { status: 422 });
    }

    return NextResponse.json({ text: truncate(text) });

  } catch (err) {
    console.error('[extract-pdf]', err);
    return NextResponse.json({ error: 'Falha ao extrair texto.', detail: String(err) }, { status: 500 });
  }
}
