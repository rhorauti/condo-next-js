'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import EmailInput from '../input/EmailInput';
import { Button } from '../ui/button';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { BiLogIn } from 'react-icons/bi';
import { useId } from 'react';

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  // 3. Criar IDs únicos para acessibilidade
  const emailId = useId();
  const passwordId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema), // 5. Conectar o Zod ao react-hook-form
  });

  async function onSubmit(values: LoginFormValues) {
    // Sua lógica de onSubmit está correta!
    await new Promise((r) => setTimeout(r, 800));
    if (values.email !== 'user@example.com' || values.password !== 'password') {
      // 'setError' para erros pós-submit (como "credenciais inválidas") está perfeito.
      setError('password', {
        type: 'manual',
        message: 'Credenciais inválidas',
      });
      return;
    }
    console.log('Logged in:', values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <Field data-invalid={!!errors.email}>
        {/* 3. Conectar label ao input */}
        <FieldLabel htmlFor={emailId}>E-mail</FieldLabel>
        <EmailInput
          id={emailId} // 3. Adicionar id
          aria-invalid={!!errors.email}
          {...register('email')} // 6. Regras de validação removidas (Zod cuida disso)
        />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Field data-invalid={!!errors.password}>
        {/* 3. Conectar label ao input */}
        <FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
        {/* 2. Usar o componente correto para senha */}
        <EmailInput
          id={passwordId} // 3. Adicionar id
          aria-invalid={!!errors.password}
          {...register('password')} // 6. Regras de validação removidas (Zod cuida disso)
        />
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      <Field>
        <Button variant={'default'} disabled={isSubmitting}>
          <BiLogIn />
          <span className="text-lg">Entrar</span>
        </Button>
      </Field>
    </form>
  );
};

export default LoginForm;
