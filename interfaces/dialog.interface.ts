import { AskDialogIconType } from '@/components/dialog/ask-dialog';
import { IAddressDetail } from './address.interface';

export type InfoDialogType = 'danger' | 'success' | 'info';

export interface IInfoDialog {
  isActive: boolean;
  title: string;
  type?: InfoDialogType;
  description?: string;
  isActionOk: boolean;
}

export interface IAskDialog {
  isActive: boolean;
  title: string;
  type?: AskDialogIconType;
  description: string;
}

export interface IDeleteDialog {
  isActive: boolean;
  title: string;
  registerName: string;
}

export interface IAddressFormDialog {
  isActive: boolean;
  idAddress: number;
  idUser?: number;
  idCondo?: number;
}
