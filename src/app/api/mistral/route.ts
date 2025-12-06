import MistralAI from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // ATENCIÓ: Posa la teva clau real aquí dins de les cometes
  const apiKey = "N0gEtea77xFuhBtJRDyehF0fQ5vgvHcA"; 

  if (apiKey === "N0gEtea77xFuhBtJRDyehF0fQ5vgvHcA") {
    return NextResponse.json({ error: "La clau de l'API de Mistral no està configurada. Si us plau, edita l'arxiu `src/app/api/mistral/route.ts` i afegeix la teva clau." }, { status: 400 });
  }

  const client = new MistralAI({ apiKey: apiKey });

  try {
    const { missatge } = await request.json();
    console.log("Rebuda pregunta:", missatge); // Això sortirà a la terminal negra

    if (!missatge) {
        return NextResponse.json({ error: 'El missatge no pot estar buit.' }, { status: 400 });
    }

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: missatge }],
    });

    console.log("Resposta rebuda de Mistral!"); 
    return NextResponse.json({ resposta: chatResponse.choices[0].message.content });
    
  } catch (error: any) {
    console.error("ERROR MISTRAL:", error);
    // Retornem un missatge més net a l'usuari
    const errorMessage = error.message.includes('401') 
      ? "Error d'autorització. La teva clau d'API de Mistral no és vàlida."
      : "No s'ha pogut contactar amb l'assistent d'IA.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
