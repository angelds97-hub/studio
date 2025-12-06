import MistralClient from '@mistralai/mistralai';

export const config = {
  path: "/.netlify/functions/incoterms",
};

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { query } = await req.json();

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Mistral API key is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = new MistralClient(apiKey);

  const systemPrompt = `
    Ets un expert en logística i comerç internacional, especialitzat en Incoterms 2020.
    La teva tasca és analitzar la situació que et descriu l'usuari i recomanar l'Incoterm més adequat.
    La teva resposta ha de ser clara, concisa i en català.

    Estructura la teva resposta de la següent manera:
    1.  **Incoterm Recomanat:** Nom de l'Incoterm (p. ex., "FOB - Free On Board").
    2.  **Per què?** Una explicació breu i senzilla de per què aquest Incoterm s'ajusta a la seva necessitat.
    3.  **Resum de Responsabilitats:**
        *   **Venedor:** Llista breu de les obligacions clau del venedor amb aquest Incoterm.
        *   **Comprador:** Llista breu de les obligacions clau del comprador amb aquest Incoterm.

    Analitza la consulta de l'usuari per determinar qui és (venedor/comprador) i quines responsabilitats vol assumir o evitar (transport principal, assegurança, tràmits duaners, lloc de lliurament, etc.).
  `;

  try {
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

  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    return new Response(JSON.stringify({ error: 'Failed to get advice from AI' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};