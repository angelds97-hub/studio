'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldAlert } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ConfiguracioPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = () => {
    toast({ title: 'Sessió tancada correctament.' });
    router.push('/');
  };

  const handleDeleteAccount = () => {
    const fakeData = new FormData();
    fakeData.append('message', 'Un usuari amb el correu admin@entrans.app ha sol·licitat eliminar el seu compte.');
    fakeData.append('_subject', 'Sol·licitud d\'Eliminació de Compte');

    fetch("https://formspree.io/f/xblnopqq", {
        method: "POST",
        body: fakeData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
       toast({
        title: 'Sol·licitud d\'eliminació enviada',
        description: 'Hem rebut la teva petició. Es processarà manualment en un termini de 48 hores.',
      });
    }).catch(() => {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: "No s'ha pogut enviar la sol·licitud d'eliminació.",
        });
    });
  };


  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-bold">Configuració</h1>

      <Card>
        <CardHeader>
          <CardTitle>Compte</CardTitle>
          <CardDescription>Gestiona les opcions de la teva sessió.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Tancar Sessió
          </Button>
        </CardContent>
      </Card>

       <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona Perillosa</CardTitle>
          <CardDescription>Aquestes accions són permanents i no es poden desfer.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
            <div>
                <p className="font-semibold">Eliminar el meu compte</p>
                <p className="text-sm text-muted-foreground">Envia una sol·licitud per eliminar el teu compte permanentment.</p>
            </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Sol·licitar Eliminació
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Estàs absolutament segur?</AlertDialogTitle>
                <AlertDialogDescription>
                  Aquesta acció enviarà una sol·licitud per eliminar permanentment el teu compte i esborrar les teves dades. Aquesta acció no es pot desfer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
