'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/input/password-input';
import RequirementItem from '@/components/ui/requirement-item';
import { onSetNewPassword } from '@/http/auth/auth.http';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRoundPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const PATTERNS = {
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  symbol: /[^a-zA-Z0-9]/,
};

const newPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Must be at least 6 characters')
    .regex(PATTERNS.uppercase, 'A senha deve ter pelo menos 1 letra maiúscula.')
    .regex(PATTERNS.number, 'A senha deve ter pelo menos 1 número')
    .regex(PATTERNS.symbol, 'A senha deve ter pelo menos 1 símbolo.'),
});

export type NewPasswordValues = z.infer<typeof newPasswordSchema>;

export default function NewPassword() {
  const formId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jwtToken = searchParams.get('token');

  const form = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const passwordValue = useWatch({
    control: form.control,
    name: 'password',
    defaultValue: '',
  });

  const check = (regex: RegExp) => regex.test(passwordValue);
  const isLengthValid = passwordValue.length >= 6;

  const onSubmitForm = async (data: NewPasswordValues): Promise<void> => {
    const toastId = toast.loading('Validando os dados...');
    try {
      if (jwtToken != null) {
        const response = await onSetNewPassword(jwtToken, data);
        if (response.status) {
          toast.success(response.message, {
            id: toastId,
            action: {
              label: 'Fechar',
              onClick: () => '',
            },
          });
          router.push('/login');
        } else {
          toast.error(response.message, {
            id: toastId,
            action: {
              label: 'Fechar',
              onClick: () => '',
            },
          });
        }
      }
    } catch (error) {
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
  };

  const { isSubmitting } = form.formState;

  return (
    <>
      <Card>
        <CardHeader className={cn('gap-2')}>
          <Image
            className="self-center w-auto h-auto"
            src="/Logo_fundo_branco.jpg"
            alt="Logo"
            width={140}
            height={100}
            priority
          />
          <CardTitle className={cn('text-center')}>Nova senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form id={formId} onSubmit={form.handleSubmit(onSubmitForm)}>
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={`new-password-${formId}`}>
                      Senha
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id={`new-password-${formId}`}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      className={cn(
                        fieldState.invalid &&
                          'border-destructive focus-visible:shadow-none'
                      )}
                    ></PasswordInput>
                    <div className="space-y-1.5">
                      {fieldState.invalid && (
                        <ul className="space-y-1">
                          <RequirementItem
                            isValid={isLengthValid}
                            label="A senha deve ter pelo menos 6 caracteres"
                          />
                          <RequirementItem
                            isValid={check(PATTERNS.uppercase)}
                            label="A senha deve ter pelo menos 1 letra maiúscula"
                          />
                          <RequirementItem
                            isValid={check(PATTERNS.number)}
                            label="A senha deve ter pelo menos 1 número"
                          />
                          <RequirementItem
                            isValid={check(PATTERNS.symbol)}
                            label="A senha deve ter pelo menos 1 símbolo"
                          />
                        </ul>
                      )}
                    </div>
                  </Field>
                )}
              ></Controller>
              <Field>
                <p className="flex gap-2 justify-center items-center">
                  <span>Já possui conta?</span>
                  {!isSubmitting ? (
                    <Link href="/login" className="underline text-primary">
                      Clique aqui
                    </Link>
                  ) : (
                    <span className="underline text-primary">Clique aqui</span>
                  )}
                </p>
              </Field>
            </FieldGroup>
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
              <UserRoundPlus className="mr-1" />
            )}
            <span className="text-base">
              {isSubmitting ? 'Aguarde...' : 'Atualizar senha'}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
