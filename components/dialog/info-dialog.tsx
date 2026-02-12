'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, CircleX, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { InfoDialogType } from '@/interfaces/dialog.interface';

export interface IInfoDialogProps {
  isActive: boolean;
  title: string;
  type: InfoDialogType;
  description: string;
  onCloseDialog: () => void;
}

export function InfoDialog({
  isActive = false,
  type = 'info',
  title,
  description,
  onCloseDialog,
}: IInfoDialogProps) {
  return (
    <Dialog open={isActive}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[30rem]"
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          {type == 'info' && (
            <Info className="h-10 w-10 p-2 bg-destructive text-white rounded-full" />
          )}
          {type == 'danger' && (
            <CircleX className="h-10 w-10 p-2 bg-destructive text-white rounded-full" />
          )}
          {type == 'success' && (
            <Check
              className="bg-success text-success-foreground p-1 rounded-full"
              size={30}
            />
          )}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onCloseDialog} variant="secondary">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
