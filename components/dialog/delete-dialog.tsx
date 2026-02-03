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
import { Trash } from 'lucide-react';
import { Input } from '../ui/input';
import { useEffect, useId, useState } from 'react';

export interface IAskDialogProps {
  isActive: boolean;
  title: string;
  registerName: string;
  onActionNok: () => void;
  onActionOk: () => void;
}

export function DeleteDialog({
  isActive = false,
  title,
  registerName,
  onActionNok,
  onActionOk,
}: IAskDialogProps) {
  const deleteDialogId = useId();
  const [isNameOk, setIsNameOk] = useState(true);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setIsNameOk(true);
  }, [isActive]);

  const onConfirm = (): void => {
    if (registerName.trim() == inputValue.trim()) {
      setIsNameOk(true);
      setInputValue('');
      onActionOk();
    } else {
      setIsNameOk(false);
    }
  };

  return (
    <Dialog open={isActive}>
      <DialogContent className="sm:max-w-[30rem]" showCloseButton={false}>
        <DialogHeader className="flex flex-col items-center gap-2">
          <Trash className="bg-destructive h-10 w-10 p-2 text-white rounded-full text-foreground" />
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="flex flex-col gap-4">
            <span>
              Escreva o seguinte nome na caixa abaixo para excluir:{' '}
              <span className="font-bold">{registerName}</span>
            </span>
            <Input
              value={inputValue}
              id={deleteDialogId}
              onInput={(e) =>
                setInputValue((e.target as HTMLInputElement).value)
              }
            />
            {!isNameOk && (
              <span className="text-destructive font-normal">
                O nome não bate com o que foi digitado.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onActionNok} variant="secondary">
              Fechar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onConfirm} variant="default">
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
