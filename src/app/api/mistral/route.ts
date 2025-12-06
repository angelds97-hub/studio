import MistralAI from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // ATENCIÓ: Posa la teva clau real aquí dins de les cometes
  const apiKey = "N0gEtea77xFuhBtJRDyehF0fQ5vgvHcA"; 

  const client = new MistralAI({ apiKey: apiKey });

  try {
    const { missatge } = await request.json();
    console.log("Rebuda pregunta:", missatge); // Això sortirà a la terminal negra

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: missatge }],
    });

    console.log("Resposta rebuda de Mistral!"); 
    return NextResponse.json({ resposta: chatResponse.choices[0].message.content });
    
  } catch (error) {
    console.error("ERROR MISTRAL:", error);
    return NextResponse.json({ error: 'Error connectant: ' + error }, { status: 500 });
  }
}