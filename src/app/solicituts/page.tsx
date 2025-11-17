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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListFilter, File, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { transportRequests } from '@/lib/data';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

export default function SolicitutsPage() {
  return (
    <Tabs defaultValue="totes">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="totes">Totes</TabsTrigger>
          <TabsTrigger value="obertes">Obertes</TabsTrigger>
          <TabsTrigger value="assignades">Assignades</TabsTrigger>
          <TabsTrigger value="completades">Completades</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar per</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Actives
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Arxivades</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exportar
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/solicituts/nova">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm-whitespace-nowrap">
                Nova Sol·licitud
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="totes">
        <Card>
          <CardHeader>
            <CardTitle>Sol·licituds de Transport</CardTitle>
            <CardDescription>
              Gestiona totes les teves sol·licituds de transport des d'un sol lloc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead className="hidden md:table-cell">Tipus</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="hidden md:table-cell">Ofertes</TableHead>
                  <TableHead>Estat</TableHead>
                  <TableHead>
                    <span className="sr-only">Accions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium">{req.requester.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {req.id}</div>
                    </TableCell>
                    <TableCell>{`${req.origin} → ${req.destination}`}</TableCell>
                    <TableCell className="hidden md:table-cell capitalize">
                      {req.transportType}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(req.dates.from, 'dd/MM/yyyy')}
                    </TableCell>
                     <TableCell className="hidden md:table-cell text-center">
                       <Badge variant="secondary">{req.offersCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'completada' ? 'default' : req.status === 'assignada' ? 'secondary' : 'outline'} className="capitalize">
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/transports/${req.id}`}>Veure</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
