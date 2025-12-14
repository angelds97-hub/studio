'use server';
import MistralAI from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    console.error("MISTRAL_API_KEY no està configurada a les variables d'entorn.");
    return NextResponse.json({ error: "Error de configuració del servidor: Manca la clau d'API." }, { status: 500 });
  }

  try {
    const { missatge } = await request.json();

    if (!missatge) {
        return NextResponse.json({ error: 'El missatge no pot estar buit.' }, { status: 400 });
    }
    
    // --- LÒGICA DEL PROMPT AMAGAT ---
    const fullPrompt = `Actua com a expert logístic de l'empresa EnTrans. Parla en català, Sigues corporatiu i breu. La pregunta del client és: "${missatge}"`;

    // --- LOGS DE CONTROL ---
    console.log("--- INICI DEPURACIÓ MISTRAL ---");
    console.log("Intentant connectar amb clau...");
    console.log(`Inici de la clau: ${apiKey.substring(0, 4)}...`);
    console.log(`Llargada de la clau: ${apiKey.length} caràcters`);
    console.log("Full Prompt a enviar a Mistral:", fullPrompt);
    console.log("----------------------------");

    const client = new MistralAI(apiKey);

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: fullPrompt }], // Enviem el prompt complet
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
