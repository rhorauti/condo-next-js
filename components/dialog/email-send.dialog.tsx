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
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { zodResolver } from '@hookform/resolvers/zod';

const adminEmailUserSchema = z.object({
  email: z
    .email('Formato de e-mail inválido.')
    .nonempty('O email é obrigatório.'),
});

export type AdminEmailUserSchema = z.infer<typeof adminEmailUserSchema>;

export interface IAskDialogProps {
  isActive: boolean;
  onActionNok: () => void;
  onActionOk: () => void;
}

export function EmailSendDialog({
  isActive = false,
  onActionNok,
  onActionOk,
}: IAskDialogProps) {
  const emailUserDialogId = useId();

  const form = useForm<AdminEmailUserSchema>({
    resolver: zodResolver(adminEmailUserSchema),
    defaultValues: {
      email: '',
    },
  });

  const { control, formState } = form;

  const onSubmit = (data: AdminEmailUserSchema): void => {
    onActionOk();
  };

  return (
    <Dialog open={isActive} onOpenChange={(open) => !open && onActionNok()}>
      <DialogContent className="sm:max-w-[30rem]" showCloseButton={true}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <DialogHeader className="flex flex-col items-center gap-2">
            <DialogTitle>Novo Cadastro</DialogTitle>
            <DialogDescription>
              Informe o e-mail para enviar o link de cadastro.
            </DialogDescription>
          </DialogHeader>

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <FieldLabel
                  htmlFor={`admin-user-input-email-${emailUserDialogId}`}
                >
                  E-mail
                </FieldLabel>
                <Input
                  {...field}
                  disabled={formState.isSubmitting || !isActive}
                  autoComplete="email"
                  id={`admin-user-input-email-${emailUserDialogId}`}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter className="flex md:gap-4 gap-2">
            <Button
              type="submit"
              variant="default"
              disabled={formState.isSubmitting}
            >
              Enviar e-mail de cadastro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
