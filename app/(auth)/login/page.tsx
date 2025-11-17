'use client';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
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
import { toast } from 'sonner';
import { onLoginUser } from '@/http/auth/auth.http';
import { ILogin } from '@/interfaces/auth.interface';

const loginSchema = z.object({
  email: z.email('Por favor, insira um email válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  agreedWithTerms: z.boolean(
    'Os termos devem ser aceitos antes de realizar o login'
  ),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const formId = useId();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      agreedWithTerms: false,
    } as ILogin,
  });

  const { isSubmitting } = form.formState;

  async function onSubmitForm(values: LoginFormValues) {
    const toastId = toast.loading('Aguarde o login ser realizado.');
    try {
      const response = await onLoginUser(values);
      toast.success('Login efetuado com sucesso!', {
        id: toastId,
        action: {
          label: 'Fechar',
          onClick: () => console.log('Fechar'),
        },
      });
    } catch (error: any) {
      const errorMessage =
        typeof error === 'string' ? error : 'Ocorreu um erro.';
      toast.error(errorMessage, {
        id: toastId,
        action: {
          label: 'Fechar',
          onClick: () => console.log('Fechar'),
        },
      });
    }
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
                <Field>
                  <FieldLabel htmlFor={`login-email-${formId}`}>
                    E-mail
                  </FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id={`login-email-${formId}`}
                    disabled={isSubmitting}
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
                <Field>
                  <FieldLabel htmlFor={`login-password-${formId}`}>
                    Senha
                  </FieldLabel>
                  <PasswordInput
                    id={`login-password-${formId}`}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
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
          <Button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            variant={'default'}
            size={'sm'}
          >
            {isSubmitting ? (
              <span className="animate-spin mr-2">⏳</span> // Or use a Loader Icon
            ) : (
              <LogIn className="mr-1" />
            )}
            <span>{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default LoginForm;
