import type { Config } from '@netlify/functions';
import MistralClient from '@mistralai/mistralai';

// Define a type for the expected request body
interface RequestBody {
  query: string;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

  if (!MISTRAL_API_KEY) {
    console.error('MISTRAL_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { query } = (await req.json()) as RequestBody;

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = new MistralClient(MISTRAL_API_KEY);

    const systemPrompt = `
      Ets un expert en logística internacional i Incoterms 2020.
      La teva missió és analitzar la situació que et descriu l'usuari i recomanar l'Incoterm més adequat.
      La teva resposta ha de ser sempre en català i seguir estrictament el següent format:

      1.  **Incoterm Recomanat**: [Nom de l'Incoterm. Per exemple: EXW - Ex Works]
      2.  **Per què és el més adequat?**: [Explicació clara i concisa de per què aquest Incoterm s'ajusta a la necessitat de l'usuari.]
      3.  **Resum de Responsabilitats**:
          *   **Venedor**: [Breu llista de les principals obligacions del venedor sota aquest Incoterm.]
          *   **Comprador**: [Breu llista de les principals obligacions del comprador sota aquest Incoterm.]

      Sigues professional, directe i evita qualsevol informació que no sigui rellevant per a la consulta. No afegeixis salutacions ni comiats.
    `;

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
    });

    const advice = chatResponse.choices[0].message.content;

    return new Response(JSON.stringify({ advice }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Failed to get advice from AI', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config: Config = {
  path: '/api/incoterms',
};
