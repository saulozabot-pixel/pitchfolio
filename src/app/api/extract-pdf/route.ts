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
      return NextResponse.json({ text: truncate(result.value) });
    }

    // PDF — usa pdf-parse v2 (local, sem API externa)
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    const text = result.text?.trim();

    if (!text) {
      return NextResponse.json({ error: 'PDF sem texto extraível (pode ser imagem).' }, { status: 422 });
    }

    return NextResponse.json({ text: truncate(text) });

  } catch (err) {
    console.error('[extract-pdf]', err);
    return NextResponse.json({ error: 'Falha ao extrair texto.' }, { status: 500 });
  }
}
