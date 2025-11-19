
import type { BlogPost } from './types';
import { subDays } from 'date-fns';
import { PlaceHolderImages } from './placeholder-images';

const reusImage = PlaceHolderImages.find(p => p.id === 'reus-city');
const reusMapImage = PlaceHolderImages.find(p => p.id === 'reus-map');
const reusTruckImage = PlaceHolderImages.find(p => p.id === 'cargo-truck');
const tarragonaPortImage = PlaceHolderImages.find(p => p.id === 'tarragona-port');
const truckHighwayImage = PlaceHolderImages.find(p => p.id === 'truck-highway');

export const blogPosts: BlogPost[] = [
    {
        id: 'reus-transport-catalunya',
        title: 'Reus: El Cor Logístic del Sud de Catalunya',
        content: `
<p>Reus, més enllà de ser coneguda pel seu modernisme i el seu dinamisme comercial, s'ha erigit com una peça fonamental en el tauler logístic de Catalunya. La seva ubicació estratègica i una xarxa d'infraestructures de primer nivell la converteixen en el motor del transport de mercaderies al sud del país.</p>

<img src="${reusMapImage?.imageUrl}" alt="Mapa estratègic de Reus" class="rounded-lg my-6" data-ai-hint="${reusMapImage?.imageHint}" />

<h3>Una Cruïlla de Camins Privilegiada</h3>
<p>Situada al cor del Camp de Tarragona, Reus gaudeix d'un accés directe a eixos viaris vitals com l'AP-7, la principal autopista del corredor mediterrani, i l'A-27, que connecta la costa amb l'interior de la península. Aquesta connectivitat permet a les empreses de transport optimitzar rutes, escurçar temps de lliurament i, en conseqüència, reduir costos operatius.</p>

<img src="${truckHighwayImage?.imageUrl}" alt="Camió en autopista" class="rounded-lg my-6" data-ai-hint="${truckHighwayImage?.imageHint}" />

<h3>Sinergies amb Infraestructures Clau</h3>
<p>El potencial de Reus es multiplica gràcies a la seva proximitat a dues infraestructures cabdals:</p>
<ul>
    <li><strong>El Port de Tarragona:</strong> A pocs quilòmetres, és un dels ports més importants de la Mediterrània, líder en el tràfic de productes agroalimentaris i químics. Aquesta proximitat facilita enormement les operacions d'importació i exportació.</li>
    <li><strong>L'Aeroport de Reus:</strong> Actua com un complement perfecte per al transport urgent de mercaderies i paqueteria, connectant la regió amb destinacions nacionals i internacionals.</li>
</ul>
<p>Aquesta combinació de transport terrestre, marítim i aeri crea un ecosistema logístic integral, on Reus funciona com el centre neuràlgic que ho connecta tot.</p>

<img src="${tarragonaPortImage?.imageUrl}" alt="Port de Tarragona" class="rounded-lg my-6" data-ai-hint="${tarragonaPortImage?.imageHint}" />

<h3>Un Futur Orientat a la Innovació</h3>
<p>Amb la constant expansió de polígons industrials com el CIM Camp i l'aposta per la digitalització del sector, Reus no només consolida la seva posició actual, sinó que mira cap al futur. La ciutat està preparada per liderar la transformació del sector logístic, adoptant noves tecnologies i pràctiques més sostenibles per afrontar els reptes de demà.</p>
        `,
        category: 'Logística',
        imageUrl: reusTruckImage?.imageUrl || '',
        imageHint: reusTruckImage?.imageHint || 'cargo truck',
        excerpt: 'Descobreix per què la ubicació i les infraestructures de Reus la converteixen en un punt clau per al transport de mercaderies a Catalunya.',
        authorId: 'user-1', 
        createdAt: subDays(new Date(), 5).toISOString(),
        updatedAt: subDays(new Date(), 5).toISOString(),
    },
];
