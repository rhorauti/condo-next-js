import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface IProps {
  showDialog: boolean;
  description: string;
  onCloseDialog: () => void;
}

export function PostCommentsDialog({ showDialog, onCloseDialog }: IProps) {
  return (
    <Dialog open={showDialog} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comentários do Post</DialogTitle>
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
