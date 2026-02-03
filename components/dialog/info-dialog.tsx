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
import { Check, CircleX } from 'lucide-react';
import { Button } from '../ui/button';

export interface IInfoDialogProps {
  isActive: boolean;
  title: string;
  isDialogFailure: boolean;
  description: string;
  onOpenChange: () => void;
}

export function InfoDialog({
  isActive = false,
  isDialogFailure = true,
  title,
  description,
  onOpenChange,
}: IInfoDialogProps) {
  return (
    <Dialog open={isActive} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[30rem]">
        <DialogHeader className="flex flex-col items-center gap-2">
          {isDialogFailure ? (
            <CircleX className="h-10 w-10 p-2 bg-destructive text-white rounded-full" />
          ) : (
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
            <Button variant="secondary">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
