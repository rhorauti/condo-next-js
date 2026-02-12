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
import { CircleArrowLeft, Send, Trash } from 'lucide-react';
import { Input } from '../ui/input';
import { useEffect, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { onSendEmailToCreateUser } from '@/http/admin/auth/users-admin.http';
import { toast } from 'sonner';
import { USER_ROLES } from '@/enum/role.enum';

const adminEmailUserSchema = z.object({
  email: z
    .email('Formato de e-mail inválido.')
    .nonempty('O email é obrigatório.'),
  name: z
    .string()
    .nonempty('O nome não pode estar vazio.')
    .refine(
      (value: string) => {
        const parts = value.trim().split(/\s+/);
        if (parts.length < 2) return false;
        if (parts[0].length < 2) return false;
        return true;
      },
      {
        message:
          'Informe nome e sobrenome, com o primeiro nome tendo pelo menos 2 letras.',
      }
    ),
  role: z.enum(USER_ROLES),
});

export type AdminEmailUserSchema = z.infer<typeof adminEmailUserSchema>;

export interface IEmailSendgProps {
  isActive: boolean;
  role: USER_ROLES;
  onActionNok: () => void;
}

export function EmailSendFormDialog({
  isActive = false,
  role,
  onActionNok,
}: IEmailSendgProps) {
  const emailUserDialogId = useId();

  const form = useForm<AdminEmailUserSchema>({
    resolver: zodResolver(adminEmailUserSchema),
    defaultValues: {
      email: '',
      name: '',
      role: role,
    },
  });

  const { control, formState, setValue } = form;

  const onSubmit = async (data: AdminEmailUserSchema): Promise<void> => {
    try {
      onSendEmailToCreateUser(data);
      toast.success(
        `E-mail enviado para ${data?.email}. Verifique sua caixa de mensagem.`,
        {
          duration: 5000,
          action: {
            label: 'Fechar',
            onClick: () => {},
          },
        }
      );
      setValue('email', '');
      setValue('name', '');
      onActionNok();
    } catch (error: any) {
      toast.error(error.message, {
        duration: 5000,
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      });
    }
  };

  const onKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key == 'Enter') {
      onSubmit(form.getValues());
    }
  };

  return (
    <Dialog open={isActive} onOpenChange={(open) => !open && onActionNok()}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[30rem]"
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle>Novo Cadastro</DialogTitle>
          <DialogDescription>
            Informe o e-mail para enviar o link de cadastro.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <FieldLabel
                  htmlFor={`admin-email-send-name-${emailUserDialogId}`}
                >
                  Nome
                </FieldLabel>
                <Input
                  {...field}
                  onKeyDown={onKeyDown}
                  disabled={formState.isSubmitting || !isActive}
                  autoComplete="email"
                  id={`admin-email-send-name-${emailUserDialogId}`}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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
                  onKeyDown={onKeyDown}
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

          <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button
              onClick={onActionNok}
              type="button"
              variant="outline"
              disabled={formState.isSubmitting}
            >
              <CircleArrowLeft />
              <span>Fechar</span>
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="animate-spin mr-2">⏳</span>
              ) : (
                <Send />
              )}
              <span>
                {form.formState.isSubmitting
                  ? 'Enviando...'
                  : 'Enviar e-mail de cadastro'}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
