import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface IProps {
  showDialog: boolean;
  description: string;
  onCloseDialog: () => void;
}

export function MediaUploadDialog({ showDialog, onCloseDialog }: IProps) {
  return (
    <Dialog open={showDialog} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Faça o updload da sua mídia abaixo</DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Postar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
