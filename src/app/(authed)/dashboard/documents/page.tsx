'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, File, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type DocumentType = 'Factura' | 'Albarà';

type Document = {
  id: string;
  type: DocumentType;
  date: string;
  client: string;
  amount?: number;
  status: 'Pendent' | 'Pagada' | 'Lliurat';
};

// Mock data for all documents
const allDocuments: Document[] = [
  { id: 'FAC-001', type: 'Factura', date: '2024-07-15', client: 'Transports Velocs', amount: 1250.50, status: 'Pagada' },
  { id: 'ALB-001', type: 'Albarà', date: '2024-07-14', client: 'Transports Velocs', status: 'Lliurat' },
  { id: 'FAC-002', type: 'Factura', date: '2024-07-20', client: 'Logística Global', amount: 850.00, status: 'Pendent' },
  { id: 'ALB-002', type: 'Albarà', date: '2024-07-19', client: 'Logística Global', status: 'Lliurat' },
  { id: 'FAC-003', type: 'Factura', date: '2024-06-25', client: 'Càrrega Ràpida', amount: 2100.00, status: 'Pagada' },
  { id: 'ALB-003', type: 'Albarà', date: '2024-06-24', client: 'Càrrega Ràpida', status: 'Lliurat' },
];

function DocumentsTable({
  documents,
  docType,
  isAdminView,
}: {
  documents: Document[];
  docType: DocumentType;
  isAdminView: boolean;
}) {
  const { toast } = useToast();
  const filteredDocs = documents.filter((doc) => doc.type === docType);

  if (filteredDocs.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border rounded-lg">
        <File className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">No s'han trobat {docType.toLowerCase()}s</h3>
        <p className="mt-1 text-sm max-w-md mx-auto">
          Quan hi hagi {docType.toLowerCase()}s disponibles, apareixeran aquí.
        </p>
      </div>
    );
  }

  const handleDownload = (docId: string) => {
    toast({
      title: 'Descàrrega simulada',
      description: `S'iniciaria la descàrrega del document ${docId}.`,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Referència</TableHead>
          {isAdminView && <TableHead>Client</TableHead>}
          <TableHead>Data</TableHead>
          {docType === 'Factura' && <TableHead className="text-right">Import</TableHead>}
          <TableHead>Estat</TableHead>
          <TableHead className="text-right">Accions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredDocs.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">{doc.id}</TableCell>
            {isAdminView && <TableCell>{doc.client}</TableCell>}
            <TableCell>{doc.date}</TableCell>
            {docType === 'Factura' && (
              <TableCell className="text-right">
                {doc.amount?.toFixed(2)} €
              </TableCell>
            )}
            <TableCell>
              <Badge
                variant={doc.status === 'Pagada' || doc.status === 'Lliurat' ? 'secondary' : 'outline'}
                className={doc.status === 'Pendent' ? 'text-orange-600 border-orange-600' : doc.status === 'Pagada' ? 'text-green-600 border-green-600' : ''}
              >
                {doc.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(doc.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                Descarregar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function DocumentsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setProfile(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const isAdminOrWorker = profile?.role === 'administrador' || profile?.role === 'treballador';
  const userDocuments = isAdminOrWorker
    ? allDocuments
    : allDocuments.filter(doc => doc.client === profile?.empresa);
  
  const pageTitle = isAdminOrWorker ? "Gestió de Documents" : "Els Meus Documents";
  const pageDescription = isAdminOrWorker
    ? "Visualitza i gestiona totes les factures i albarans de la plataforma."
    : `Aquí trobaràs totes les factures i albarans associats a ${profile?.empresa || 'la teva empresa'}.`;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!profile) {
      return (
         <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Accés Denegat</AlertTitle>
            <AlertDescription>
                Necessites iniciar sessió per veure aquesta pàgina.
            </AlertDescription>
        </Alert>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{pageTitle}</CardTitle>
        <CardDescription>{pageDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="factures">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="factures">Factures</TabsTrigger>
            <TabsTrigger value="albarans">Albarans</TabsTrigger>
          </TabsList>
          <TabsContent value="factures" className="mt-6">
            <DocumentsTable documents={userDocuments} docType="Factura" isAdminView={isAdminOrWorker} />
          </TabsContent>
          <TabsContent value="albarans" className="mt-6">
            <DocumentsTable documents={userDocuments} docType="Albarà" isAdminView={isAdminOrWorker} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
