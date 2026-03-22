import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text) return Response.json({ error: 'Texto vazio.' }, { status: 400 });

  const prompt = `Você receberá o texto de um currículo profissional. Extraia as informações e retorne SOMENTE um JSON válido, sem markdown, sem explicações, apenas o JSON.

Formato obrigatório:
{
  "fullName": "Nome Completo",
  "role": "Cargo ou título profissional principal",
  "description": "Resumo profissional em 2-3 frases impactantes",
  "email": "email@example.com ou vazio",
  "phone": "telefone ou vazio",
  "location": "cidade, estado ou vazio",
  "website": "site ou linkedin ou vazio",
  "skills": [
    { "name": "Nome da habilidade", "level": 85 }
  ],
  "experience": [
    {
      "company": "Nome da empresa",
      "position": "Cargo",
      "period": "Ano - Ano",
      "achievements": ["conquista 1", "conquista 2", "conquista 3"]
    }
  ],
  "education": [
    {
      "institution": "Nome da instituição",
      "degree": "Curso ou grau",
      "period": "Ano - Ano"
    }
  ]
}

Regras:
- skills: liste até 6 habilidades. level é um número de 60 a 99 estimado pelo texto.
- experience: ordene do mais recente ao mais antigo.
- Se um campo não existir no texto, use string vazia ou array vazio.
- Retorne APENAS o JSON, sem nenhum texto antes ou depois.

TEXTO DO CURRÍCULO:
${text}`;

  try {
    const { text: raw } = await generateText({
      model: google('gemini-3-flash-preview'),
      prompt,
    });

    // Remove possíveis blocos de código markdown
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(clean);
    return Response.json(data);
  } catch (err) {
    console.error('[parse-cv]', err);
    return Response.json({ error: 'Falha ao extrair dados.' }, { status: 500 });
  }
}
