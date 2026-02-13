import type { UserProfile, Notification, ActiveTransport, WithId } from './types';
import { Truck, Users, CheckCircle, Bell } from 'lucide-react';
import { subDays, addDays } from 'date-fns';


// THIS FILE CONTAINS MOCK DATA.
// This data can be used for fallback or for pages not yet connected to a live data source.


export const mainUser: WithId<UserProfile> = {
  id: 'admin-user',
  firstName: 'Admin',
  lastName: 'User',
  email: 'adomen11@xtec.cat',
  role: 'administrador',
  creationDate: new Date().toISOString(),
  avatarUrl: '/user-avatar.png',
  password: '123456', // IMPORTANT: This is for demo purposes only.
};

// The 'users' array is now deprecated as user data is fetched from an external API.
// It is kept here for potential fallback or reference purposes.
export const users: WithId<UserProfile>[] = [
  mainUser,
  { id: 'user-1', firstName: 'Joan', lastName: 'Puig', email:'joan@test.com', role: 'client/proveidor', creationDate: new Date().toISOString(), avatarUrl: 'https://picsum.photos/seed/user1/100/100', password: 'password1' },
  { id: 'user-2', firstName: 'Maria', lastName: 'Llopis', email:'maria@test.com', role: 'client/proveidor', creationDate: new Date().toISOString(), avatarUrl: 'https://picsum.photos/seed/user2/100/100', password: 'password2' },
  { id: 'user-3', firstName: 'Carles', lastName: 'Sancho', email:'carles@test.com', role: 'client/proveidor', creationDate: new Date().toISOString(), avatarUrl: 'https://picsum.photos/seed/user3/100/100', password: 'password3' },
  { id: 'user-4', firstName: 'Laura', lastName: 'Molins', email:'laura@test.com', role: 'client/proveidor', creationDate: new Date().toISOString(), avatarUrl: 'https://picsum.photos/seed/user4/100/100', password: 'password4' },
  { id: 'user-5', firstName: 'Sergi', lastName: 'Brianso', email:'sergibrianso@gmail.com', role: 'treballador', creationDate: new Date().toISOString(), avatarUrl: 'https://picsum.photos/seed/user5/100/100', password: '123sergi' },
];

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
