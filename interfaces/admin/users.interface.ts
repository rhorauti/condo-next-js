import { IAdminCondoUserHome } from './condo.interface';

export interface IAdminUsersHome {
  condo: IAdminCondoUserHome;
  users: IAdminUserHome[];
}

export interface IAdminUserHome {
  idUser: number;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  fallbackName: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  accessLevel: number;
  isWhatsapp: boolean;
  address: {
    idAddress: number;
    block: string;
    lot: string;
  };
}

export interface IAdminUserDetail {
  idUser: number;
  createdAt: string;
  name: string;
  birthDate: Date;
  email: string;
  phone: string;
  isWhatsapp: boolean;
  photoUrl: string;
  fallbackName: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  accessLevel: number;
  address: {
    idAddress: number;
    type: string;
    street: string;
    number: string;
    city: string;
    state: string;
    blockType: string;
    block: string;
    lotType: string;
    lot: string;
  };
}
