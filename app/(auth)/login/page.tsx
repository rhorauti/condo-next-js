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
import { ILoginRequest } from '@/interfaces/auth.interface';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { onLoginUser } from '@/http/web/auth/auth.http';
import { WEB_ROUTES } from '@/enum/web/routes.enum';
import { IInfoDialog } from '@/interfaces/dialog.interface';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.email('Por favor, insira um email válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const formId = useId();
  const router = useRouter();
  const [infoDialog, setInfoDialog] = useState<IInfoDialog>({
    isActive: false,
    title: '',
    type: 'success',
    description: '',
    isActionOk: false,
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    } as ILoginRequest,
  });

  const { isSubmitting } = form.formState;

  async function onSubmitForm(values: LoginFormValues) {
    const toastId = toast.loading('Validando os dados...');
    try {
      const session = await onLoginUser(values);

      if (session) {
        toast.success('Login efetuado com sucesso.', {
          id: toastId,
          action: {
            label: 'Fechar',
            onClick: () => '',
          },
        });
        router.push(WEB_ROUTES.REPORTS);
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
    <>
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
                    autoComplete="email"
                    placeholder="exemplo@provedor.com"
                    className={cn(
                      'text-foreground',
                      fieldState.invalid &&
                        'border-destructive focus-visible:shadow-none'
                    )}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-red-400"
                    />
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
                      'text-foreground',
                      fieldState.invalid &&
                        'border-destructive focus-visible:shadow-none'
                    )}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-red-400"
                    />
                  )}
                </Field>
              )}
            ></Controller>
            <Field>
              <div className="flex justify-center gap-2">
                <span>Esqueceu a senha?</span>
                <Link
                  href={WEB_ROUTES.PASSWORD_RECOVERY}
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
            disabled={isSubmitting}
            variant={'default'}
            size={'sm'}
          >
            {isSubmitting ? (
              <span className="animate-spin mr-2">⏳</span>
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
