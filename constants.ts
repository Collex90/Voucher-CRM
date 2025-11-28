import { SoftwareModule, User } from './types';

export const YDEA_MODULES: SoftwareModule[] = [
  {
    id: 'core',
    name: 'Ydea CRM Core',
    description: 'Licenza base per utente. Include gestione anagrafiche e attività.',
    price: 350
  },
  {
    id: 'sales',
    name: 'Modulo Sales Force',
    description: 'Gestione opportunità, pipeline e previsioni di vendita.',
    price: 150
  },
  {
    id: 'marketing',
    name: 'Modulo Marketing',
    description: 'Campagne email, gestione lead e integrazione web form.',
    price: 120
  },
  {
    id: 'service',
    name: 'Modulo Customer Service',
    description: 'Gestione ticket, SLA e portale clienti.',
    price: 180
  },
  {
    id: 'bi',
    name: 'Ydea Analytics',
    description: 'Dashboard avanzate e reportistica BI.',
    price: 200
  }
];

// Le password NON sono salvate in chiaro. Sono hash SHA-256.
// Admin Password: admin -> Hash: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
// Staff Password: password -> Hash: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
export const MOCK_USERS: (User & { passwordHash: string })[] = [
  { 
    id: 'u1', 
    username: 'admin', 
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 
    name: 'Amministratore', 
    role: 'admin' 
  },
  { 
    id: 'u2', 
    username: 'staff', 
    passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    name: 'Staff Member', 
    role: 'staff' 
  }
];