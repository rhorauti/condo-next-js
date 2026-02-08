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
import { PasswordInput } from '@/components/input/password-input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ILoginRequest } from '@/interfaces/auth.interface';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { onLoginUser } from '@/http/web/auth/auth.http';
import { WEB_ROUTES } from '@/enum/web/routes.enum';

const loginSchema = z.object({
  email: z.email('Por favor, insira um email válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const formId = useId();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    } as ILoginRequest,
  });

  const { isSubmitting } = form.formState;
  const isLoading = isSubmitting || isRedirecting;

  async function onSubmitForm(values: LoginFormValues) {
    const toastId = toast.loading('Aguarde o login ser realizado.');
    try {
      const response = await onLoginUser(values);
      if (response && response.status) {
        setIsRedirecting(true);
        const redirectDelay = 2000;
        const timer = setTimeout(() => {
          router.push(WEB_ROUTES.REPORTS);
        }, redirectDelay);
        toast.success('Login efetuado com sucesso!', {
          id: toastId,
          duration: redirectDelay,
          action: {
            label: 'Fechar',
            onClick: () => {
              clearTimeout(timer);
              router.push(WEB_ROUTES.REPORTS);
            },
          },
        });
      } else {
        throw new Error(response?.message || 'Erro ao fazer o login');
      }
    } catch (error: unknown) {
      toast.error((error as Error).message, {
        id: toastId,
        action: {
          label: 'Fechar',
          onClick: () => '',
        },
      });
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center p-1">
      <Card
        className={cn(
          ' w-full sm:w-[30rem] bg-slate-700 border-none shadow-lg text-white'
        )}
      >
        <CardHeader className={cn('flex flex-col gap-4')}>
          {/* <Image
            className="self-center w-auto h-auto"
            src="/Logo_fundo_branco.jpg"
            alt="Logo"
            width={140}
            height={100}
            priority
          /> */}
          <div className="bg-gradient-to-r w-36 mx-auto h-12 from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:from-blue-700 group-hover:to-blue-800 transition">
            <span className="font-bold text-lg">ConectaCondo</span>
          </div>
          <CardTitle className="text-center">Login de administrador</CardTitle>
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
                    autoComplete="email"
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
                    autoComplete="current-password"
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
            <Field>
              <div className="flex justify-center gap-2">
                <span>Esqueceu a senha?</span>
                <Link
                  href="web/password-recovery"
                  className="underline text-primary-foreground"
                >
                  Clique aqui.
                </Link>
              </div>
            </Field>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            type="submit"
            form={formId}
            disabled={isLoading}
            variant={'default'}
            size={'sm'}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              <LogIn className="mr-1" />
            )}
            <span>{isLoading ? 'Entrando...' : 'Entrar'}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
