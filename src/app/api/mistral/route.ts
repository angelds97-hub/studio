import MistralAI from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

/**
 * Funció POST per gestionar les peticions a l'API de Mistral.
 * Llegeix un missatge d'una petició JSON, el processa amb Mistral AI
 * i retorna la resposta del model.
 */
export async function POST(req: Request) {
  try {
    // IMPORTANT: Substitueix aquest valor per la teva clau d'API de Mistral
    // o, preferiblement, carrega-la des de les variables d'entorn.
    const apiKey = "N0gEtea77xFuhBtJRDyehF0fQ5vgvHcA";

    // Inicialitza el client de Mistral
    const client = new MistralAI({ apiKey });

    // Llegeix el cos de la petició per obtenir el missatge
    const { missatge } = await req.json();

    // Comprova si el missatge existeix
    if (!missatge) {
      return NextResponse.json({ error: 'El camp "missatge" és requerit' }, { status: 400 });
    }

    // Crida a l'API de Mistral
    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: missatge }],
    });

    // Extreu la resposta
    const resposta = chatResponse.choices[0].message.content;

    // Retorna la resposta en format JSON
    return NextResponse.json({ resposta });

  } catch (error) {
    console.error("Error en la crida a l'API de Mistral:", error);
    return NextResponse.json({ error: "No s'ha pogut contactar amb l'assistent d'IA." }, { status: 500 });
  }
}
