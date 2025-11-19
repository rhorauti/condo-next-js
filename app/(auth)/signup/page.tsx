'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input/input';
import { PasswordInput } from '@/components/ui/input/password-input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import RequirementItem from '@/components/ui/requirement-item';
import { onCreateUser } from '@/http/auth/auth.http';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Calendar as CalendarIcon,
  ChevronDownIcon,
  UserRoundPlus,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const PATTERNS = {
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  symbol: /[^a-zA-Z0-9]/,
};

const signUpSchema = z.object({
  name: z.string().nonempty('O nome é obrigatório.'),
  password: z
    .string()
    .min(6, 'Must be at least 6 characters')
    .regex(PATTERNS.uppercase, 'A senha deve ter pelo menos 1 letra maiúscula.')
    .regex(PATTERNS.number, 'A senha deve ter pelo menos 1 número')
    .regex(PATTERNS.symbol, 'A senha deve ter pelo menos 1 símbolo.'),
  email: z
    .email('Formato de e-mail inválido.')
    .nonempty('O email é obrigatório'),
  birthDate: z
    .date('Data inválida')
    .max(eighteenYearsAgo, { message: 'Você deve ter pelo menos 18 anos.' }),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const formId = useId();
  const [open, setOpen] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      password: '',
      email: '',
      birthDate: undefined,
    },
  });

  const passwordValue = useWatch({
    control: form.control,
    name: 'password',
    defaultValue: '',
  });

  const check = (regex: RegExp) => regex.test(passwordValue);
  const isLengthValid = passwordValue.length >= 6;

  const onSubmitForm = async (data: SignUpValues): Promise<void> => {
    const toastId = toast.loading('Validando os dados...');
    try {
      const response = await onCreateUser(data);
      if (response.status) {
        toast.success(response.message, {
          id: toastId,
          action: {
            label: 'Fechar',
            onClick: () => '',
          },
        });
      } else {
        toast.error(response.message, {
          id: toastId,
          action: {
            label: 'Fechar',
            onClick: () => '',
          },
        });
      }
    } catch (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : 'Ocorreu um erro ao criar o usuário.';
      toast.error(errorMessage, {
        id: toastId,
        action: {
          label: 'Fechar',
          onClick: () => '',
        },
      });
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
          <CardTitle className={cn('text-center')}>Novo usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form id={formId} onSubmit={form.handleSubmit(onSubmitForm)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={`signup-name-${formId}`}>
                      Nome
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`signup-name-${formId}`}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                      autoComplete="name"
                      className={cn(
                        fieldState.invalid &&
                          'border-destructive focus-visible:shadow-none'
                      )}
                    ></Input>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              ></Controller>
              <Controller
                name="birthDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={`signup-birthDate-${formId}`}>
                      Data de nascimento
                    </FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger
                        asChild
                        className={cn(
                          fieldState.invalid &&
                            'border-destructive focus-visible:shadow-none'
                        )}
                      >
                        <Button
                          variant="outline"
                          id={`signup-birthDate-${formId}`}
                          disabled={isSubmitting}
                          className={cn(`w-48 justify-between font-normal`)}
                        >
                          {field.value ? (
                            field.value.toLocaleDateString()
                          ) : (
                            <span
                              className={
                                fieldState.invalid ? 'text-destructive' : ''
                              }
                            >
                              Selecione uma data
                            </span>
                          )}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          defaultMonth={field.value}
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={`signup-email-${formId}`}>
                      E-mail
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`signup-email-${formId}`}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                      autoComplete="email"
                      className={cn(
                        fieldState.invalid &&
                          'border-destructive focus-visible:shadow-none'
                      )}
                    ></Input>
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
                    <FieldLabel htmlFor={`signup-password-${formId}`}>
                      Senha
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id={`signup-password-${formId}`}
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
              {isSubmitting ? 'Aguarde...' : 'Criar usuário'}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
