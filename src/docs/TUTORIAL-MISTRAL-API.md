# Tutorial: Integració Segura d'una API Externa (Mistral) a Next.js

Aquest document resumeix els passos i les lliçons apreses durant la integració de l'API de Mistral AI. L'objectiu és servir com a guia ràpida per a futurs projectes que necessitin connectar-se a un servei extern de manera segura i funcional.

## Pas 1: Crear una API Route Segura (el Backend)

La pràctica més important és **mai exposar claus d'API al codi del client**. Per a això, creem una "API Route" a Next.js que actuarà com a intermediari segur.

**Acció**: Crear l'arxiu `src/app/api/nom-api/route.ts`.

**Codi Final per a `src/app/api/mistral/route.ts`:**

```typescript
'use server';
import MistralAI from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Llegir la clau des de les variables d'entorn (MAI directament al codi)
  const apiKey = process.env.MISTRAL_API_KEY;

  // 2. Comprovació de seguretat: si la clau no existeix, aturar l'execució.
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
```

## Pas 2: Configurar les Variables d'Entorn

Perquè `process.env.MISTRAL_API_KEY` funcioni, cal declarar la variable.

**Acció**: Crear un arxiu anomenat `.env.local` a l'arrel del projecte (al mateix nivell que `package.json`).

**Contingut de `.env.local`**:

```
MISTRAL_API_KEY="la-teva-clau-secreta-enganxada-aqui"
```

**Important**: L'arxiu `.env.local` **mai s'ha de pujar a un repositori com GitHub**. Afegeix `.env.local` a l'arxiu `.gitignore` si no hi és ja. En plataformes de desplegament com Netlify o Vercel, hauràs de configurar aquesta variable d'entorn a través del seu panell web.

## Pas 3: Crear el Component de Client (el Frontend)

Aquest component és la interfície que l'usuari veu. Només ha de recollir la informació i enviar-la a la nostra API Route, mai directament a Mistral.

**Acció**: Crear una pàgina o component amb la directiva `'use client'`. Exemple: `src/app/assistent/page.tsx`.

**Codi Final per a `src/app/assistent/page.tsx`:**

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';

export default function AssistentAIPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ missatge: prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No s'ha pogut obtenir una resposta.");
      }

      const data = await res.json();
      setResponse(data.resposta);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Assistent d'IA Logística</CardTitle>
          <CardDescription>
            Fes una pregunta o descriu una situació logística per obtenir una recomanació de la nostra IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">La teva consulta:</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: 'Quines són les 5 ciutats de Catalunya amb més trànsit de mercaderies?' o 'Dona'm consells per optimitzar una ruta entre Barcelona i València.'"
                className="min-h-[120px] text-base"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Consultant...' : 'Consultar Assistent'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {response && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 font-headline">Resposta de l'Assistent:</h3>
              <div className="bg-muted p-6 rounded-lg border">
                <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                  {response}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## Pas 4: Configurar el Desplegament (Exemple Netlify)

Perquè les API Routes funcionin, Next.js no pot ser exportat com un lloc estàtic.

1.  **Arxiu `next.config.ts`**: Assegura't que **NO** contingui la línia `output: 'export'`.

2.  **Arxiu `netlify.toml`**: Crea aquest arxiu a l'arrel per indicar a Netlify com construir i servir l'aplicació.

    ```toml
    [build]
      command = "npm run build"
      publish = ".next"
    ```

Seguint aquests passos, la integració hauria de ser segura, robusta i fàcil de depurar.
