import { USER_ROLES } from '@/enum/role.enum';
import { IAdminCondoUserHome } from './admin-condo.interface';

export interface IAdminUsersHome {
  idUser: number;
  condoList: IAdminCondoUserHome[];
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
  role: USER_ROLES;
  isActive: boolean;
  isWhatsapp: boolean;
  address: {
    idAddress: number;
    block: string;
    lot: string;
  };
}
