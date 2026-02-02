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
