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
import { Button } from '../ui/button';
import { Info } from 'lucide-react';

export interface IAskDialogProps {
  isActive: boolean;
  title: string;
  description: string;
  onActionNok: () => void;
  onActionOk: () => void;
}

export function AskDialog({
  isActive = false,
  title,
  description,
  onActionNok,
  onActionOk,
}: IAskDialogProps) {
  return (
    <Dialog open={isActive}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader className="flex flex-col items-center gap-2">
          <Info className="text-blue-800 dark:text-blue-500 h-6 w-6" />
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onActionNok} variant="secondary">
              Fechar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onActionOk} variant="default">
              Sim
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
