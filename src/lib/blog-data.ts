import type { BlogPost } from './types';
import { subDays } from 'date-fns';

export const blogPosts: BlogPost[] = [
    {
        id: 'reus-transport-catalunya',
        title: 'Reus: Un Nus Estratègic per al Transport de Mercaderies a Catalunya',
        content: `
<p>Reus, coneguda històricament pel seu dinamisme comercial i la producció d'aiguardent, s'ha consolidat en les darreres dècades com un punt clau en el mapa logístic de Catalunya. La seva ubicació privilegiada, a prop del Port de Tarragona i de l'aeroport, juntament amb una xarxa de comunicacions terrestres de primer nivell, la converteixen en un enclavament estratègic per al transport de mercaderies.</p>
<h3>Una Posició Geogràfica Privilegiada</h3>
<p>Situada al cor del Camp de Tarragona, Reus gaudeix d'accés directe a importants eixos viaris com l'AP-7, que connecta tot el corredor mediterrani, i l'A-27, que facilita la comunicació amb l'interior de la península. Aquesta connectivitat permet a les empreses de transport optimitzar les seves rutes, reduir costos i garantir lliuraments més ràpids i eficients.</p>
<h3>Infraestructures al Servei de la Logística</h3>
<p>L'àrea d'influència de Reus compta amb infraestructures modernes que donen suport a l'activitat logística:</p>
<ul>
    <li><strong>El Port de Tarragona:</strong> Un dels ports més importants de la Mediterrània, especialitzat en productes químics, agroalimentaris i càrrega general.</li>
    <li><strong>L'Aeroport de Reus:</strong> Facilita el transport aeri de mercaderies urgents i d'alt valor afegit.</li>
    <li><strong>Polígons Industrials:</strong> Com el CIM Camp, dissenyat específicament per a activitats logístiques i de transport, oferint espais i serveis adaptats a les necessitats del sector.</li>
</ul>
<h3>El Futur del Transport a Reus</h3>
<p>Amb projectes com el desenvolupament de noves zones logístiques i la millora contínua de les infraestructures, Reus està preparada per afrontar els reptes del futur. La ciutat no només és un punt de pas, sinó un veritable centre de valor afegit on la logística i el transport són motors de creixement econòmic per a tota la regió.</p>
        `,
        category: 'Logística',
        imageUrl: 'https://images.unsplash.com/photo-1604724911072-0453f41ab5a3?q=80&w=800&h=600&auto=format&fit=crop',
        imageHint: 'Reus church',
        excerpt: 'Descobreix per què la ubicació i les infraestructures de Reus la converteixen en un punt clau per al transport de mercaderies a Catalunya.',
        authorId: 'user-1', // Albert Domenech (Fundador)
        createdAt: subDays(new Date(), 5).toISOString(),
        updatedAt: subDays(new Date(), 5).toISOString(),
    },
];
