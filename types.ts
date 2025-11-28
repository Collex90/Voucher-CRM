export enum RequestStatus {
  DRAFT = 'BOZZA',
  PENDING = 'DA APPROVARE',
  APPROVED = 'APPROVATO',
  REJECTED = 'RIFIUTATO'
}

export interface SoftwareModule {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface SelectedModule extends SoftwareModule {
  quantity: number;
}

export interface PartnerInfo {
  partnerName: string; // Ragione Sociale Partner
  contactName: string; // Nome e Cognome referente
  customerName: string; // Ragione Sociale Cliente
  customerVat: string; // Partita IVA Cliente
}

export interface VoucherRequest {
  id: string;
  submissionDate: string;
  status: RequestStatus;
  partnerInfo: PartnerInfo;
  modules: SelectedModule[];
  totalValue: number;
  approvedBy?: string; // User ID of approver
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  name: string;
}