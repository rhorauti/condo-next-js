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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { PasswordInput } from '@/components/input/password-input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import RequirementItem from '@/components/requirement-item/requirement-item';
import { onCreateUser } from '@/http/auth/auth.http';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { ChevronDownIcon, UserRoundPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const PATTERNS = {
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  symbol: /[^a-zA-Z0-9]/,
};

export const FORM_ERRORS = {
  name: 'O nome é obrigatório.',
  password: {
    min: 'A senha deve ter pelo menos 6 caracteres.',
    uppercase: 'A senha deve ter pelo menos 1 letra maiúscula.',
    number: 'A senha deve ter pelo menos 1 número.',
    symbol: 'A senha deve ter pelo menos 1 símbolo.',
  },
  email: {
    invalid: 'Formato de e-mail inválido.',
    required: 'O email é obrigatório.',
  },
  birthDate: {
    invalid: 'Data inválida.',
    minAge: 'Você deve ter pelo menos 18 anos.',
  },
  terms: 'Os termos devem ser aceitos antes de realizar o login.',
};

const signUpSchema = z.object({
  name: z.string().nonempty(FORM_ERRORS.name),
  password: z
    .string()
    .min(6, FORM_ERRORS.password.min)
    .regex(PATTERNS.uppercase, FORM_ERRORS.password.uppercase)
    .regex(PATTERNS.number, FORM_ERRORS.password.number)
    .regex(PATTERNS.symbol, FORM_ERRORS.password.symbol),
  email: z
    .email('Formato de e-mail inválido.')
    .nonempty('O email é obrigatório.'),
  birthDate: z
    .date('Data inválida.')
    .max(eighteenYearsAgo, { message: 'Você deve ter pelo menos 18 anos.' }),
  agreedWithTerms: z.boolean().refine((checked) => checked == true, {
    error: 'Os termos devem ser aceitos antes de realizar o login.',
  }),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      password: '',
      email: '',
      birthDate: undefined,
      agreedWithTerms: false,
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
      if (response && response.status) {
        toast.success(response.message, {
          id: toastId,
          action: {
            label: 'Fechar',
            onClick: () => '',
          },
        });
        router.push('/login');
      } else {
        throw new Error(response?.message || 'Erro ao criar usuário');
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
  };

  const { isSubmitting } = form.formState;

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
                      placeholder="Digite seu nome"
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
                      placeholder="Digite seu e-mail"
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
                            label={FORM_ERRORS.password.min}
                          />
                          <RequirementItem
                            isValid={check(PATTERNS.uppercase)}
                            label={FORM_ERRORS.password.uppercase}
                          />
                          <RequirementItem
                            isValid={check(PATTERNS.number)}
                            label={FORM_ERRORS.password.number}
                          />
                          <RequirementItem
                            isValid={check(PATTERNS.symbol)}
                            label={FORM_ERRORS.password.symbol}
                          />
                        </ul>
                      )}
                    </div>
                  </Field>
                )}
              ></Controller>
              <Controller
                name="agreedWithTerms"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-top space-x-2">
                      <Checkbox
                        id={`login-agreedWithTerms-${formId}`}
                        checked={field.value}
                        aria-label="Agree with terms"
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                        className={cn(
                          fieldState.invalid
                            ? 'border-destructive'
                            : 'border-none bg-white'
                        )}
                      />
                      <div className="grid gap-1.5">
                        <label
                          htmlFor={`login-agreedWithTerms-${formId}`}
                          className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Li e aceito os{' '}
                          <Link
                            href="/terms"
                            className="underline"
                            target="_blank"
                          >
                            Termos de Uso
                          </Link>{' '}
                          e{' '}
                          <Link
                            href="/privacy"
                            className="underline "
                            target="_blank"
                          >
                            Política de Privacidade
                          </Link>
                          .
                        </label>
                      </div>
                    </div>

                    {/* Error Message */}
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </div>
                )}
              />
              <Field>
                <p className="flex gap-2 justify-center items-center font-medium">
                  <span className="font-normal">Já possui conta?</span>
                  {!isSubmitting ? (
                    <Link href="/login" className="underline">
                      Clique aqui
                    </Link>
                  ) : (
                    <span className="underline">Clique aqui</span>
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
              <span className="animate-spin mr-2">⏳</span>
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
