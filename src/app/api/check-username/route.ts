import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')?.toLowerCase().trim();

  if (!username || !/^[a-z0-9-]{3,30}$/.test(username)) {
    return NextResponse.json({ available: false, error: 'Nome inválido' });
  }

  try {
    // Tenta acessar username.vercel.app — se resolver com projeto real, está ocupado
    const res = await fetch(`https://${username}.vercel.app`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(4000),
    });

    // Se retornar a página de "deployment not found" da Vercel, está livre
    const isVercelNotFound = res.status === 404;
    // Se retornou algo que não é 404 da Vercel, está ocupado
    const available = isVercelNotFound;

    return NextResponse.json({ available, username });
  } catch {
    // Timeout ou DNS não resolveu = provavelmente disponível
    return NextResponse.json({ available: true, username });
  }
}
