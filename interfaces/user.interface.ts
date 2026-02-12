import { IMedia } from './media.interface';
import { IAddress } from './address.interface';
import { USER_ROLES } from '@/enum/role.enum';

export interface IUserDetail {
  idUser: number;
  createdAt: string;
  name: string;
  birthDate: string;
  email: string;
  phone?: string | null;
  isWhatsapp?: boolean;
  mediaObject?: IMedia | null;
  fallbackName: string;
  isActive: boolean;
  role?: USER_ROLES;
  address?: IAddress[];
}

export interface IUser {
  idUser: number;
  name: string;
  email: string;
  mediaObject?: IMedia | null;
  role: USER_ROLES;
  fallbackName: string;
  isActive: boolean;
}
