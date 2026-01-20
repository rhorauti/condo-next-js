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

interface DialogProps {
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
}: DialogProps) {
  return (
    <Dialog open={isActive} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-2">
          {isDialogFailure ? (
            <CircleX className="text-destructive rounded-full" size={30} />
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
