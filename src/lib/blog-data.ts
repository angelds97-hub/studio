
import type { BlogPost } from './types';
import { subDays } from 'date-fns';
import { PlaceHolderImages } from './placeholder-images';

const reusImage = PlaceHolderImages.find(p => p.id === 'reus-city');
const tarragonaPortImage = PlaceHolderImages.find(p => p.id === 'tarragona-port');
const truckHighwayImage = PlaceHolderImages.find(p => p.id === 'truck-highway');

// This file is now a mock/backup. The data is fetched from Firestore.
export const blogPosts: BlogPost[] = [
    {
        id: 'optimizant-rutes',
        title: 'Optimizant Rutes: Claus per a un Transport Més Eficient',
        content: `
<p>L'optimització de rutes és un dels pilars fonamentals per a qualsevol empresa de transport que busqui millorar la seva eficiència, reduir costos i minimitzar el seu impacte mediambiental. En un món cada cop més competitiu, cada minut i cada quilòmetre compten.</p>

<h3>Tecnologia al Servei de la Logística</h3>
<p>Avui dia, disposem d'eines tecnològiques avançades que ens permeten analitzar variables en temps real, com el trànsit, les condicions meteorològiques o les restriccions de circulació. L'ús de software especialitzat en la planificació de rutes permet a les empreses dissenyar trajectes més intel·ligents, evitar embussos i garantir els lliuraments en els terminis acordats.</p>

<h3>Més enllà del Camí Més Curt</h3>
<p>Optimitzar una ruta no sempre significa triar el camí més curt. Cal tenir en compte factors com:</p>
<ul>
    <li><strong>El consum de combustible:</strong> Evitar pendents pronunciats o zones de trànsit dens pot estalviar una quantitat significativa de combustible.</li>
    <li><strong>Els horaris de lliurament:</strong> Planificar les rutes per adaptar-se a les finestres de lliurament dels clients és crucial per a la satisfacció del servei.</li>
    <li><strong>La seguretat:</strong> Prioritzar carreteres en bon estat i evitar zones conflictives millora la seguretat tant del conductor com de la mercaderia.</li>
</ul>

<h3>Un Benefici per a Tothom</h3>
<p>Una bona optimització de rutes no només beneficia l'empresa de transport. Els clients reben les seves mercaderies més ràpid, es redueixen les emissions de CO2 i, en general, es contribueix a una mobilitat més sostenible i eficient per a tota la societat.</p>
        `,
        category: 'Eficiència',
        imageUrl: truckHighwayImage?.imageUrl ?? 'https://picsum.photos/seed/truck-sunset/800/600',
        imageHint: 'truck sunset highway',
        excerpt: 'Descobreix com la tecnologia i una planificació intel·ligent poden transformar les operacions de transport, estalviant temps i diners.',
        authorId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'reus-transport-catalunya',
        title: 'Reus: El Cor Logístic del Sud de Catalunya',
        content: `
<p>Reus, més enllà de ser coneguda pel seu modernisme i el seu dinamisme comercial, s'ha erigit com una peça fonamental en el tauler logístic de Catalunya. La seva ubicació estratègica i una xarxa d'infraestructures de primer nivell la converteixen en el motor del transport de mercaderies al sud del país.</p>

<img src="/20240712.jpg" alt="Mapa estratègic de Reus" class="rounded-lg my-6" data-ai-hint="mapa reus" />

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
        imageUrl: reusImage?.imageUrl ?? 'https://picsum.photos/seed/reus-city/800/600',
        imageHint: 'reus city center',
        excerpt: 'Descobreix per què la ubicació i les infraestructures de Reus la converteixen en un punt clau per al transport de mercaderies a Catalunya.',
        authorId: 'user-1', 
        createdAt: subDays(new Date(), 5).toISOString(),
        updatedAt: subDays(new Date(), 5).toISOString(),
    },
];
