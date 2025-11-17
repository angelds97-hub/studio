import type { TransportRequest, User, Notification, ActiveTransport, TransportOffer } from './types';
import { Truck, Users, CheckCircle, Bell } from 'lucide-react';
import { subDays, addDays } from 'date-fns';

export const mainUser: User = {
  name: 'Admin',
  avatarUrl: '/user-avatar.png'
};

export const users: { [key: string]: User } = {
  'user-1': { name: 'Joan Puig', avatarUrl: 'https://picsum.photos/seed/user1/100/100' },
  'user-2': { name: 'Maria Llopis', avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
  'user-3': { name: 'Carles Sancho', avatarUrl: 'https://picsum.photos/seed/user3/100/100' },
  'user-4': { name: 'Laura Molins', avatarUrl: 'https://picsum.photos/seed/user4/100/100' },
};

export const transportRequests: TransportRequest[] = [
  {
    id: 'req-1',
    requester: users['user-1'],
    transportType: 'càrrega',
    origin: 'Barcelona',
    destination: 'València',
    dates: { from: new Date(), to: addDays(new Date(), 3) },
    specialRequirements: 'Necessita refrigeració. Palets de fruita.',
    status: 'oberta',
    offersCount: 3,
  },
  {
    id: 'req-2',
    requester: users['user-2'],
    transportType: 'passatgers',
    origin: 'Girona',
    destination: 'Lleida',
    dates: { from: addDays(new Date(), 5), to: addDays(new Date(), 5) },
    specialRequirements: 'Grup de 15 persones. Anada i tornada el mateix dia.',
    status: 'oberta',
    offersCount: 1,
  },
  {
    id: 'req-3',
    requester: users['user-3'],
    transportType: 'càrrega',
    origin: 'Tarragona',
    destination: 'Madrid',
    dates: { from: addDays(new Date(), 10), to: addDays(new Date(), 12) },
    specialRequirements: 'Material fràgil. Assegurança addicional requerida.',
    status: 'assignada',
    offersCount: 5,
  },
  {
    id: 'req-4',
    requester: users['user-4'],
    transportType: 'càrrega',
    origin: 'Sabadell',
    destination: 'Saragossa',
    dates: { from: subDays(new Date(), 2), to: subDays(new Date(), 1) },
    specialRequirements: 'Entrega urgent de paqueteria.',
    status: 'completada',
    offersCount: 2,
  },
];

export const recentRequests = transportRequests.slice(0, 4);

export const activeTransports: ActiveTransport[] = [
    { id: 'tr-1', origin: 'Barcelona', destination: 'València', status: 'en trànsit', progress: 65 },
    { id: 'tr-2', origin: 'Girona', destination: 'Perpinyà', status: 'recollint', progress: 10 },
    { id: 'tr-3', origin: 'Tarragona', destination: 'Madrid', status: 'en trànsit', progress: 80 },
];

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    icon: Truck,
    title: 'Nova oferta rebuda',
    description: 'Transports Velocs ha fet una oferta per la teva sol·licitud BCN-VLC.',
    read: false,
    date: subDays(new Date(), 0),
  },
  {
    id: 'notif-2',
    icon: CheckCircle,
    title: 'Transport completat',
    description: 'El teu transport de Sabadell a Saragossa ha finalitzat.',
    read: false,
    date: subDays(new Date(), 1),
  },
  {
    id: 'notif-3',
    icon: Users,
    title: 'Nou transportista registrat',
    description: 'Logística Global s\'ha unit a la plataforma.',
    read: true,
    date: subDays(new Date(), 2),
  },
    {
    id: 'notif-4',
    icon: Bell,
    title: 'Recordatori de pagament',
    description: 'El pagament per al transport TGN-MAD està pendent.',
    read: true,
    date: subDays(new Date(), 3),
  },
];

export const transportOffers: { [key: string]: TransportOffer[] } = {
  'req-1': [
    {
      id: 'offer-1-1',
      company: { name: 'Transports Velocs', logoUrl: 'https://picsum.photos/seed/logo1/100/100', rating: 4.8 },
      price: 450,
      estimatedArrival: addDays(new Date(), 2),
      vehicle: 'Camió refrigerat Volvo FH',
    },
    {
      id: 'offer-1-2',
      company: { name: 'Logística Global', logoUrl: 'https://picsum.photos/seed/logo2/100/100', rating: 4.5 },
      price: 480,
      estimatedArrival: addDays(new Date(), 2),
      vehicle: 'Iveco Stralis amb control de temperatura',
    },
    {
      id: 'offer-1-3',
      company: { name: 'Càrrega Ràpida', logoUrl: 'https://picsum.photos/seed/logo3/100/100', rating: 4.2 },
      price: 430,
      estimatedArrival: addDays(new Date(), 3),
      vehicle: 'Mercedes-Benz Actros',
    },
  ],
  'req-2': [
     {
      id: 'offer-2-1',
      company: { name: 'Bus & Go', logoUrl: 'https://picsum.photos/seed/logo4/100/100', rating: 4.9 },
      price: 600,
      estimatedArrival: addDays(new Date(), 5),
      vehicle: 'Minibús Mercedes Sprinter (20 places)',
    },
  ]
};
