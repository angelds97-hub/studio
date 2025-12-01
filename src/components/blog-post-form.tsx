'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export function BlogPostForm() {
  return (
    <form
      action="https://formspree.io/f/xblnopqq"
      method="POST"
      className="space-y-8"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Títol de l'article</Label>
        <Input
          id="title"
          name="title"
          placeholder="Un títol atractiu per al teu article"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            name="category"
            placeholder="Ex: Logística, Tecnologia..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageHint">Descripció de la imatge</Label>
          <Input
            id="imageHint"
            name="imageHint"
            placeholder="Ex: camió modern a la carretera"
            required
          />
          <p className="text-sm text-muted-foreground">
            Això ajudarà a generar una imatge de capçalera adient.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contingut</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Escriu aquí el teu article..."
          className="min-h-[250px]"
          required
        />
        <p className="text-sm text-muted-foreground">
          Pots utilitzar etiquetes HTML bàsiques per formatar el text. Per
          exemple: <code>&lt;h3&gt;Subtítol&lt;/h3&gt;</code>,{' '}
          <code>&lt;p&gt;Paràgraf.&lt;/p&gt;</code>,{' '}
          <code>&lt;strong&gt;Negreta&lt;/strong&gt;</code>, o{' '}
          <code>
            &lt;ul&gt;&lt;li&gt;Element de llista&lt;/li&gt;&lt;/ul&gt;
          </code>
          .
        </p>
      </div>

      {/* Hidden field for Formspree subject */}
      <input
        type="hidden"
        name="_subject"
        value="Nova Proposta d'Article per al Blog d'EnTrans!"
      />

      <Button type="submit">Enviar Article per a Revisió</Button>
    </form>
  );
}
