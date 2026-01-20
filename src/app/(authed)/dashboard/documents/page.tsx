'use client';

import React, { useState, useEffect } from 'react';
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
  usuari: string; // email del client
  concepte: string;
  preu_unitari: string;
  unitats: string;
  iva?: string; // Columna opcional
  dte?: string; // Columna opcional de descompte
  fpagament?: string; // Forma de pagament
};

type SheetDbUser = {
  usuari: string; // email
  treballador: string; // Nom i cognom
  empresa: string;
  rol: string;
  fiscalid: string; // NIF/CIF
  adreca: string;
  telefon?: string;
};

type FormattedInvoice = {
  invoiceNumber: string;
  date: string;
  userEmail: string; 
  paymentMethod?: string;
  client: {
    name: string;
    nif: string;
    address: string;
    phone?: string;
  };
  lines: {
    concept: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    vatPercentage: number;
    lineTotal: number; // (unitPrice * quantity)
    lineDiscountAmount: number;
    lineTaxableBase: number;
    lineVatAmount: number;
  }[];
  subtotal: number; // Suma de (unitPrice * quantity)
  totalDiscount: number;
  taxableBase: number; // subtotal - totalDiscount
  vatBreakdown: Record<string, { base: number; amount: number; }>; // Ex: { '21': { base: 120.50, amount: 25.30 } }
  totalVat: number; // Suma de tots els IVAs
  total: number; // taxableBase + totalVat
};


const MY_COMPANY_DETAILS = {
  name: 'EnTrans Solucions Logístiques S.L.',
  nif: 'B12345678',
  address: 'Carrer de la Logística, 123\n08001 Barcelona, Espanya',
  email: 'facturacio@entrans.app',
};

// Funció per formatar dates de manera segura
const safeFormatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('ca-ES');
  }
  const parts = dateString.split('/');
  if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const newDate = new Date(year, month, day);
      if (!isNaN(newDate.getTime())) {
          return newDate.toLocaleDateString('ca-ES');
      }
  }
  return dateString;
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
    if (profile) {
      fetchAndProcessInvoices(profile);
    } else if (!isLoading && !profile) {
       setError("El perfil d'usuari no s'ha pogut carregar.");
       setIsLoading(false);
    }
  }, [profile]);


  const fetchAndProcessInvoices = async (userProfile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fer les dues peticions a la vegada
      const [invoiceLinesResponse, usersResponse] = await Promise.all([
        fetch('https://sheetdb.io/api/v1/sjvdps9wa0f8z?sheet=documents'),
        fetch('https://sheetdb.io/api/v1/sjvdps9wa0f8z?sheet=usuaris')
      ]);

      if (!invoiceLinesResponse.ok || !usersResponse.ok) {
        throw new Error("No s'ha pogut connectar amb el servei de documents.");
      }
      const allInvoiceLines: InvoiceLine[] = await invoiceLinesResponse.json();
      const allSheetDbUsers: SheetDbUser[] = await usersResponse.json();
      
      const usersMap = new Map(allSheetDbUsers.map(u => [u.usuari, u]));

      // 2. Agrupar totes les línies per número de factura
      const grouped = allInvoiceLines.reduce((acc, line) => {
        if (!line.num_factura) return acc;
        const { num_factura } = line;
        if (!acc[num_factura]) {
          acc[num_factura] = [];
        }
        acc[num_factura].push(line);
        return acc;
      }, {} as Record<string, InvoiceLine[]>);

      // 3. Formatejar en factures estructurades i fer el "JOIN"
      const allFormattedInvoices: FormattedInvoice[] = Object.values(grouped).map(lines => {
        const firstLine = lines[0];
        const clientData = usersMap.get(firstLine.usuari);
        
        let subtotal = 0;
        let totalDiscount = 0;
        const vatBreakdown: Record<string, { base: number; amount: number; }> = {};

        const invoiceLines = lines.map(l => {
          const quantity = parseFloat(l.unitats) || 0;
          const unitPrice = parseFloat(l.preu_unitari.replace(',', '.')) || 0;
          const discountPercentage = parseFloat(l.dte || '0') || 0;
          const vatPercentage = parseFloat(l.iva || '0') || 0;

          const lineTotal = unitPrice * quantity;
          const lineDiscountAmount = lineTotal * (discountPercentage / 100);
          const lineTaxableBase = lineTotal - lineDiscountAmount;
          const lineVatAmount = lineTaxableBase * (vatPercentage / 100);

          subtotal += lineTotal;
          totalDiscount += lineDiscountAmount;
          
          if (!vatBreakdown[vatPercentage]) {
            vatBreakdown[vatPercentage] = { base: 0, amount: 0 };
          }
          vatBreakdown[vatPercentage].base += lineTaxableBase;
          vatBreakdown[vatPercentage].amount += lineVatAmount;

          return {
            concept: l.concepte,
            quantity,
            unitPrice,
            discountPercentage,
            vatPercentage,
            lineTotal,
            lineDiscountAmount,
            lineTaxableBase,
            lineVatAmount,
          };
        });

        const taxableBase = subtotal - totalDiscount;
        const totalVat = Object.values(vatBreakdown).reduce((sum, breakdown) => sum + breakdown.amount, 0);
        const total = taxableBase + totalVat;

        return {
          invoiceNumber: firstLine.num_factura,
          date: firstLine.data,
          userEmail: firstLine.usuari,
          paymentMethod: firstLine.fpagament,
          client: {
            name: clientData?.empresa || firstLine.usuari,
            nif: clientData?.fiscalid || 'N/A',
            address: clientData?.adreca || 'N/A',
            phone: clientData?.telefon,
          },
          lines: invoiceLines,
          subtotal,
          totalDiscount,
          taxableBase,
          vatBreakdown,
          totalVat,
          total,
        };
      });

      // 4. Filtrar les factures per l'usuari que ha iniciat sessió
      let userInvoices;
      if (userProfile?.role === 'administrador' || userProfile?.role === 'treballador') {
        userInvoices = allFormattedInvoices;
      } else {
        userInvoices = allFormattedInvoices.filter(invoice => invoice.userEmail === userProfile.email);
      }
      
      setInvoices(userInvoices.sort((a, b) => {
          const datePartsA = a.date.split('/');
          const datePartsB = b.date.split('/');
          if (datePartsA.length === 3 && datePartsB.length === 3) {
            const dateA = new Date(+datePartsA[2], +datePartsA[1] - 1, +datePartsA[0]);
            const dateB = new Date(+datePartsB[2], +datePartsB[1] - 1, +datePartsB[0]);
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                return dateB.getTime() - dateA.getTime();
            }
          }
          return b.date.localeCompare(a.date);
        }));

    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Error en carregar documents',
        description: e.message || 'Hi ha hagut un problema al connectar amb el servidor de dades.',
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
            <TableCell>{safeFormatDate(invoice.date)}</TableCell>
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
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body * { 
            visibility: hidden; 
          }
          
          #zona-factura, #zona-factura * { 
            visibility: visible; 
          }

          #zona-factura {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            padding: 20mm 20mm 30mm 20mm; 
            margin: 0;
            background: white;
            font-size: 12px;
          }

          #footer-legal {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 15mm;
            background-color: #f3f4f6;
            color: #4b5563;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            border-top: 1px solid #d1d5db;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 9999;
          }

          .print\\:hidden { 
            display: none !important; 
          }
        }
      `}</style>
      
      <div>
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Tornar a la llista
          </Button>
          <Button onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir PDF
          </Button>
        </div>

        <div id="zona-factura" className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200">
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
                <span className="font-semibold">Data:</span> {safeFormatDate(invoice.date)}
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
               {invoice.client.phone && (
                <p className="text-sm text-gray-600 mt-1">Tel: {invoice.client.phone}</p>
              )}
            </div>
          </section>

          {/* Línies de la factura */}
          <section>
            <Table>
              <TableHeader className="bg-gray-200 text-gray-800">
                <TableRow>
                  <TableHead className="w-2/5">Concepte</TableHead>
                  <TableHead className="text-center">Unitats</TableHead>
                  <TableHead className="text-right">Preu Unitari</TableHead>
                  <TableHead className="text-center">Dte.%</TableHead>
                  <TableHead className="text-center">IVA%</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lines.map((line, index) => (
                  <TableRow key={index} className="border-b">
                    <TableCell className="font-medium text-gray-700">{line.concept}</TableCell>
                    <TableCell className="text-center text-gray-600">{line.quantity}</TableCell>
                    <TableCell className="text-right text-gray-600">{line.unitPrice.toFixed(2)} €</TableCell>
                    <TableCell className="text-center text-gray-600">{line.discountPercentage > 0 ? `${line.discountPercentage}%` : '0%'}</TableCell>
                    <TableCell className="text-center text-gray-600">{line.vatPercentage}%</TableCell>
                    <TableCell className="text-right font-medium text-gray-700">{line.lineTaxableBase.toFixed(2)} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          {/* Totals */}
          <section className="mt-8 flex justify-end">
            <div className="w-full max-w-sm space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{invoice.subtotal.toFixed(2)} €</span>
              </div>
              {invoice.totalDiscount > 0 && (
                 <div className="flex justify-between">
                    <span>Descomptes:</span>
                    <span className="font-medium text-red-600">- {invoice.totalDiscount.toFixed(2)} €</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2" />
              {Object.entries(invoice.vatBreakdown).map(([rate, { base, amount }]) => (
                 amount > 0 && (
                    <React.Fragment key={rate}>
                        <div className="flex justify-between">
                            <span>Base Imposable ({rate}%):</span>
                            <span className="font-medium">{base.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Quota IVA ({rate}%):</span>
                            <span className="font-medium">{amount.toFixed(2)} €</span>
                        </div>
                    </React.Fragment>
                )
              ))}
              <div className="flex justify-between pt-2 border-t-2 border-gray-800 mt-2">
                <span className="text-lg font-bold">TOTAL A PAGAR:</span>
                <span className="text-lg font-bold">{invoice.total.toFixed(2)} €</span>
              </div>
            </div>
          </section>

          {invoice.paymentMethod && (
            <div className="mt-8 pt-4 border-t text-sm">
                <span className="font-semibold text-gray-800">Forma de pagament: </span>
                <span className="text-gray-600">{invoice.paymentMethod}</span>
            </div>
          )}
          
          <div id="footer-legal">
            Gràcies per la seva confiança. EnTrans Solucions Logístiques - www.entrans.cat - admin@entrans.cat
          </div>
        </div>
      </div>
    </>
  );
}
