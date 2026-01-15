'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Printer, ArrowLeft, ShieldAlert, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- ESTRUCTURES DE DADES ---
type InvoiceLine = {
  id: string;
  num_factura: string;
  data: string;
  usuari: string;
  nom_client: string;
  nif_client: string;
  adreca_client: string;
  concepte: string;
  preu_unitari: string;
  unitats: string;
};

type FormattedInvoice = {
  invoiceNumber: string;
  date: string;
  userEmail: string; // Afegim l'email per poder filtrar
  client: {
    name: string;
    nif: string;
    address: string;
  };
  lines: {
    concept: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
};

const MY_COMPANY_DETAILS = {
  name: 'EnTrans Solucions Logístiques S.L.',
  nif: 'B12345678',
  address: 'Carrer de la Logística, 123\n08001 Barcelona, Espanya',
  email: 'facturacio@entrans.app',
};

// --- COMPONENT DE LA PÀGINA ---
export default function DocumentsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [invoices, setInvoices] = useState<FormattedInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<FormattedInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProfile(user);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile) { // Check if profile is loaded
      fetchAndProcessInvoices(profile.email);
    } else if (!isLoading && !profile) {
      // Handle the case where loading is finished but there's no profile
       setError('El perfil d\'usuari no s\'ha pogut carregar.');
       setIsLoading(false);
    }
  }, [profile, isLoading]);


  const fetchAndProcessInvoices = async (userEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://sheetdb.io/api/v1/sjvdps9wa0f8z?sheet=documents');
      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb el servei de documents.");
      }
      const allInvoiceLines: InvoiceLine[] = await response.json();

      if (allInvoiceLines.length === 0) {
        setInvoices([]);
        setIsLoading(false);
        return;
      }

      // 1. Agrupar totes les línies per número de factura
      const grouped = allInvoiceLines.reduce((acc, line) => {
        if (!line.num_factura) return acc; // Ignorar línies sense número de factura
        const { num_factura } = line;
        if (!acc[num_factura]) {
          acc[num_factura] = [];
        }
        acc[num_factura].push(line);
        return acc;
      }, {} as Record<string, InvoiceLine[]>);

      // 2. Formatejar en factures estructurades
      const allFormattedInvoices: FormattedInvoice[] = Object.values(grouped).map(lines => {
        const firstLine = lines[0];
        const invoiceLines = lines.map(l => ({
          concept: l.concepte,
          quantity: parseFloat(l.unitats) || 0,
          unitPrice: parseFloat(l.preu_unitari.replace(',', '.')) || 0,
          total: (parseFloat(l.preu_unitari.replace(',', '.')) || 0) * (parseFloat(l.unitats) || 0),
        }));

        const subtotal = invoiceLines.reduce((sum, l) => sum + l.total, 0);
        const vat = subtotal * 0.21;
        const total = subtotal + vat;

        return {
          invoiceNumber: firstLine.num_factura,
          date: firstLine.data,
          userEmail: firstLine.usuari, // Guardem l'email de l'usuari de la factura
          client: {
            name: firstLine.nom_client,
            nif: firstLine.nif_client,
            address: firstLine.adreca_client,
          },
          lines: invoiceLines,
          subtotal,
          vat,
          total,
        };
      });

      // 3. Filtrar les factures per l'usuari que ha iniciat sessió
      let userInvoices;
      if (profile?.role === 'administrador' || profile?.role === 'treballador') {
        userInvoices = allFormattedInvoices;
      } else {
        userInvoices = allFormattedInvoices.filter(invoice => invoice.userEmail === userEmail);
      }
      
      setInvoices(userInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Error en carregar documents',
        description: e.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!profile && !isLoading) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Accés Denegat</AlertTitle>
        <AlertDescription>Necessites iniciar sessió per veure aquesta pàgina.</AlertDescription>
      </Alert>
    );
  }

  if (selectedInvoice) {
    return (
      <InvoiceDetailView 
        invoice={selectedInvoice} 
        onBack={() => setSelectedInvoice(null)} 
        onPrint={handlePrint} 
      />
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-invoice, .printable-invoice * {
            visibility: visible;
          }
          .printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 20mm;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <Card>
        <CardHeader>
          <CardTitle>Gestió de Factures</CardTitle>
          <CardDescription>Aquí pots veure i imprimir totes les teves factures.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Carregant factures...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Ha ocorregut un error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : invoices.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <h3 className="text-lg font-semibold">No s'han trobat factures</h3>
              <p>Actualment no tens cap factura registrada al sistema.</p>
            </div>
          ) : (
            <InvoiceListView invoices={invoices} onSelectInvoice={setSelectedInvoice} />
          )}
        </CardContent>
      </Card>
    </>
  );
}

// --- COMPONENTS DE VISTA ---

function InvoiceListView({ invoices, onSelectInvoice }: { invoices: FormattedInvoice[]; onSelectInvoice: (invoice: FormattedInvoice) => void; }) {
  const profileRole = JSON.parse(localStorage.getItem('loggedInUser') || '{}').role;
  const isAdminOrWorker = profileRole === 'administrador' || profileRole === 'treballador';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Número de Factura</TableHead>
          {isAdminOrWorker && <TableHead>Client</TableHead>}
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Accions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoiceNumber}>
            <TableCell>{new Date(invoice.date).toLocaleDateString('ca-ES')}</TableCell>
            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
            {isAdminOrWorker && <TableCell>{invoice.client.name}</TableCell>}
            <TableCell className="text-right font-mono">{invoice.total.toFixed(2)} €</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => onSelectInvoice(invoice)}>
                Veure
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function InvoiceDetailView({ invoice, onBack, onPrint }: { invoice: FormattedInvoice; onBack: () => void; onPrint: () => void; }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6 no-print">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Tornar a la llista
        </Button>
        <Button onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir PDF
        </Button>
      </div>

      <div id="printable-invoice" className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200 printable-a4">
         <style jsx global>{`
          .printable-a4 {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 1cm auto;
            border: 1px #D1D5DB solid;
            background: white;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          }
           @page {
            size: A4;
            margin: 0;
          }
           @media print {
            html, body {
              width: 210mm;
              height: 297mm;        
            }
            .printable-a4 {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
      `}</style>
        {/* Capçalera */}
        <header className="flex justify-between items-start pb-8 border-b-2 border-gray-800">
          <div className="flex items-center gap-4">
             <Truck className="h-10 w-10 text-primary" />
             <div>
                <h1 className="text-2xl font-bold text-gray-800">{MY_COMPANY_DETAILS.name}</h1>
                <p className="text-sm text-gray-500 whitespace-pre-line">{MY_COMPANY_DETAILS.address}</p>
                <p className="text-sm text-gray-500">{MY_COMPANY_DETAILS.nif}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold uppercase text-gray-400">Factura</h2>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Nº Factura:</span> {invoice.invoiceNumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Data:</span> {new Date(invoice.date).toLocaleDateString('ca-ES')}
            </p>
          </div>
        </header>

        {/* Dades del Client */}
        <section className="my-8">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">Facturar a:</h3>
            <p className="font-bold text-gray-700">{invoice.client.name}</p>
            <p className="text-sm text-gray-600">{invoice.client.nif}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </section>

        {/* Línies de la factura */}
        <section>
          <Table>
            <TableHeader className="bg-gray-200 text-gray-800">
              <TableRow>
                <TableHead className="w-1/2">Concepte</TableHead>
                <TableHead className="text-center">Unitats</TableHead>
                <TableHead className="text-right">Preu Unitari</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lines.map((line, index) => (
                <TableRow key={index} className="border-b">
                  <TableCell className="font-medium text-gray-700">{line.concept}</TableCell>
                  <TableCell className="text-center text-gray-600">{line.quantity}</TableCell>
                  <TableCell className="text-right text-gray-600">{line.unitPrice.toFixed(2)} €</TableCell>
                  <TableCell className="text-right font-medium text-gray-700">{line.total.toFixed(2)} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Totals */}
        <section className="mt-8 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Base Imposable:</span>
              <span className="font-medium">{invoice.subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (21%):</span>
              <span className="font-medium">{invoice.vat.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-gray-800 mt-2">
              <span className="text-lg font-bold">TOTAL A PAGAR:</span>
              <span className="text-lg font-bold">{invoice.total.toFixed(2)} €</span>
            </div>
          </div>
        </section>
        
        <footer className="mt-12 pt-4 border-t text-center text-xs text-gray-400">
            <p>Gràcies per la seva confiança.</p>
            <p>{MY_COMPANY_DETAILS.name} | {MY_COMPANY_DETAILS.email}</p>
        </footer>
      </div>
    </div>
  );
}
