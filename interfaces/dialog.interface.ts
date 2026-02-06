import { AskDialogIconType } from '@/components/dialog/ask-dialog';

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
