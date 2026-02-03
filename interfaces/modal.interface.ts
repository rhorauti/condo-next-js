import { AskDialogIconType } from '@/components/dialog/ask-dialog';

export interface IInfoDialog {
  isActive: boolean;
  title: string;
  description: string;
  isDialogFailure: boolean;
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
