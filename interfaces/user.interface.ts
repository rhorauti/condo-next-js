import { IMedia } from './admin/media.interface';

export interface IUserDetail {
  idUser: number;
  createdAt: string;
  name: string;
  birthDate: Date;
  email: string;
  phone: string;
  isWhatsapp: boolean;
  media: IMedia | null;
  fallbackName: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  accessLevel: number;
  address: {
    idAddress: number;
    postalCode: string | null;
    type: string | null;
    street: string | null;
    number: string | null;
    city: string | null;
    state: string | null;
    blockType: string | null;
    block: string | null;
    lotType: string | null;
    lot: string | null;
  };
}
