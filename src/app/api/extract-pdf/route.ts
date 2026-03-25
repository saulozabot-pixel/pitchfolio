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
      try {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        if (result.value?.trim()) {
          return NextResponse.json({ text: truncate(result.value) });
        }
      } catch (e) {
        console.error('[extract-pdf] mammoth error:', e);
      }
      return NextResponse.json({ error: 'Não foi possível extrair o texto do Word.' }, { status: 422 });
    }

    // PDF — usa pdfjs-dist legacy (sem worker, sem API externa)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const data = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
      const doc = await loadingTask.promise;
      const pages: string[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageText = content.items.map((item: any) => item.str ?? '').join(' ');
        pages.push(pageText);
      }

      const text = pages.join('\n').trim();
      if (text) return NextResponse.json({ text: truncate(text) });
    } catch (e) {
      console.error('[extract-pdf] pdfjs error:', e);
    }

    return NextResponse.json({ error: 'PDF sem texto extraível. Tente salvar como .txt.' }, { status: 422 });

  } catch (err) {
    console.error('[extract-pdf]', err);
    return NextResponse.json({ error: 'Falha ao extrair texto.' }, { status: 500 });
  }
}
