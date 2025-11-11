'use client';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState } from 'react';
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { PasswordInput } from '@/components/ui/input/password-input';
import { cn } from '@/lib/utils';
import { ModalInfo } from '@/components/ui/modal/modal-info';
import { IModalInfo } from '@/interfaces/modal-info.interface';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.email('Por favor, insira um email válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const emailId = useId();
  const passwordId = useId();
  const formId = useId();
  const [modal, setModal] = useState<IModalInfo>({
    isActive: false,
    title: '',
    description: '',
    isDialogFailure: false,
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmitForm(values: LoginFormValues) {
    toast.success('Login efetuado com sucesso!');
    // setModal((state) => ({
    //   isActive: true,
    //   description: 'Login efetuado com sucesso',
    //   title: 'Login',
    //   isDialogFailure: true,
    // }));
    console.log('Logged in:', values);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Image
            className="self-center w-auto h-auto"
            src="/logo-ttsteel.jpg"
            alt="Logo"
            width={120}
            height={80}
            priority
          />
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-4 w-full"
          >
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={emailId}>E-mail</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id={emailId}
                    aria-invalid={fieldState.invalid}
                    placeholder="exemplo@provedor.com"
                    className={cn(
                      fieldState.invalid &&
                        'border-destructive focus-visible:shadow-none'
                    )}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
                  <PasswordInput
                    id={passwordId}
                    aria-invalid={fieldState.invalid}
                    {...field}
                    className={cn(
                      fieldState.invalid &&
                        'border-destructive focus-visible:shadow-none'
                    )}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button type="submit" form={formId} variant={'default'} size={'sm'}>
            <LogIn />
            <span>Entrar</span>
          </Button>
        </CardFooter>
      </Card>
      <ModalInfo
        isDialogFailure={modal.isDialogFailure}
        isActive={modal.isActive}
        title={modal.title}
        description={modal.description}
        onOpenChange={() =>
          setModal((state) => ({ ...state, isActive: false }))
        }
      ></ModalInfo>
    </>
  );
};

export default LoginForm;
