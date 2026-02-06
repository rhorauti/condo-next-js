import { IMedia } from './admin/media.interface';
import { IAddress } from './web/address.interface';

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
  role?: IRole;
  address?: IAddress;
}

export interface IRole {
  idRole: number;
  name: string;
  description?: string | null;
}
