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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { onSendRecoveryEmail } from '@/http/web/auth/auth.http';
import { WEB_ROUTES } from '@/enum/web/routes.enum';

const passwordRecoverySchema = z.object({
  email: z.email('Por favor, insira um email válido.'),
});

export type PasswordRecoveryValues = z.infer<typeof passwordRecoverySchema>;

const PasswordRecovery = () => {
  const formId = useId();
  const router = useRouter();

  const form = useForm<PasswordRecoveryValues>({
    resolver: zodResolver(passwordRecoverySchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmitForm(values: PasswordRecoveryValues) {
    const toastId = toast.loading('Aguarde...');
    try {
      const response = await onSendRecoveryEmail(values);
      if (response && response.status) {
        toast.success(response.message, {
          id: toastId,
          action: {
            label: 'Fechar',
            onClick: () => '',
          },
        });
        router.push(WEB_ROUTES.LOGIN);
      } else {
        toast.error(response.message, {
          id: toastId,
          action: {
            label: 'Fechar',
            onClick: () => '',
          },
        });
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message, {
          id: toastId,
          action: {
            label: 'Fechar',
            onClick: () => '',
          },
        });
      } else {
        console.log(error);
      }
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
          <CardTitle className="text-center">Recuperação de senha</CardTitle>
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
            <Field>
              <div className="flex justify-center gap-2">
                <span>Já possui conta?</span>
                <Link
                  href={WEB_ROUTES.LOGIN}
                  className="underline text-primary"
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
            <span>{isSubmitting ? 'Entrando...' : 'Enviar'}</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default PasswordRecovery;
