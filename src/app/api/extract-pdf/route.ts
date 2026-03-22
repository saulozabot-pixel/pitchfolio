import { NextRequest, NextResponse } from 'next/server';

const MAX_CHARS = 12000; // ~3000 tokens — suficiente para qualquer CV

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

    // PDF
    if (name.endsWith('.pdf') || file.type === 'application/pdf') {
      const pdfMod = await import('pdf-parse');
      const pdfParse = (pdfMod as unknown as { default: (b: Buffer) => Promise<{ text: string }> }).default ?? pdfMod;
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: truncate(data.text) });
    }

    // DOCX / DOC
    if (name.endsWith('.docx') || name.endsWith('.doc')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: truncate(result.value) });
    }

    // TXT / MD e demais texto plano
    return NextResponse.json({ text: truncate(buffer.toString('utf-8')) });

  } catch (err) {
    console.error('[extract-pdf]', err);
    return NextResponse.json({ error: 'Falha ao extrair texto.' }, { status: 500 });
  }
}
