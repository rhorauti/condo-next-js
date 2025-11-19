'use client';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { onValidateToken } from '@/http/auth/auth.http';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleX } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IRedirectProps {
  searchParams: { token: string };
}

export default function Redirect({ searchParams }: IRedirectProps) {
  const token = searchParams.token;
  const [message, setMessage] = useState('');
  const [isValidationOk, setIsValidationOk] = useState(false);
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setMessage('Erro: Token não encontrado na URL.');
        setIsValidationOk(false);
        return;
      }
      const response = await onValidateToken(token);
      setMessage(response.message);
      setIsValidationOk(response.status);
    };
    validateToken();
  }, [token]);

  return (
    <>
      <Card>
        <CardHeader>
          {isValidationOk ? (
            <CircleCheck
              size={40}
              className="self-center text-green-600 dark:text-green-400"
            />
          ) : (
            <CircleX size={40} className="self-center text-destructive" />
          )}
          <h1 className="text-center text-lg">
            {message}E-mail validado com sucesso.
          </h1>
        </CardHeader>
        <CardFooter className={cn('flex justify-center')}>
          <Button variant={'default'}>
            <Link href="/login">Ir para Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
