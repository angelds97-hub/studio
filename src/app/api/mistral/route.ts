'use server';
import MistralAI from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = "qbmLYgq2z5NtJr1OF7yVQzSEj8K4HKDa"; 

  try {
    const { missatge } = await request.json();

    // --- LOGS DE CONTROL ---
    console.log("--- INICI DEPURACIÓ MISTRAL ---");
    console.log("Intentant connectar amb clau...");
    console.log(`Inici de la clau: ${apiKey.substring(0, 4)}...`);
    console.log(`Llargada de la clau: ${apiKey.length} caràcters`);
    console.log("Missatge a enviar:", missatge);
    console.log("----------------------------");

    if (!missatge) {
        return NextResponse.json({ error: 'El missatge no pot estar buit.' }, { status: 400 });
    }
    
    if (apiKey === "ENGANXA_AQUI_LA_TEVA_CLAU_DE_MISTRAL") {
        return NextResponse.json({ error: "La clau de l'API de Mistral no està configurada. Si us plau, edita l'arxiu `src/app/api/mistral/route.ts` i afegeix la teva clau." }, { status: 400 });
    }

    const client = new MistralAI(apiKey);

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: missatge }],
    });

    console.log("Resposta rebuda de Mistral!"); 
    return NextResponse.json({ resposta: chatResponse.choices[0].message.content });
    
  } catch (error: any) {
    console.error("--- ERROR DETALLAT MISTRAL ---");
    console.error(JSON.stringify(error, null, 2));
    console.error("-------------------------------");

    const errorMessage = error.message.includes('401') 
      ? "Error d'autorització. La teva clau d'API de Mistral no és vàlida."
      : "No s'ha pogut contactar amb l'assistent d'IA.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
