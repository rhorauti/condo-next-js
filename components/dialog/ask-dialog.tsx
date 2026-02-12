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
import { Info, Trash, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type AskDialogIconType = 'info' | 'danger';

export interface IAskDialogProps {
  isActive: boolean;
  title: string;
  description: string;
  showCloseButton?: boolean;
  type?: AskDialogIconType;
  onActionNok: () => void;
  onActionOk: () => void;
}

export function AskDialog({
  isActive = false,
  title,
  description,
  showCloseButton = false,
  type = 'info',
  onActionNok,
  onActionOk,
}: IAskDialogProps) {
  const [dialogType, setDialogType] = useState<AskDialogIconType>('info');
  useEffect(() => {
    setDialogType(type);
  }, [isActive]);

  return (
    <Dialog open={isActive} onOpenChange={onActionNok}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[30rem]"
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          <Info
            className={cn(
              ' text-white h-10 w-10 p-2 rounded-full',
              dialogType == 'info'
                ? 'bg-blue-800 dark:bg-blue-500'
                : 'bg-destructive'
            )}
          />
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onActionNok} variant="secondary">
              Não
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
