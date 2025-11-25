'use client';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { onValidateEmail } from '@/http/auth/auth.http';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleX } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Redirect() {
  const searchParams = useSearchParams();
  const jwtToken = searchParams.get('token');
  const [message, setMessage] = useState('');
  const [isValidationOk, setIsValidationOk] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!jwtToken) {
          setMessage('Erro ao solicitar o JWT token de acesso.');
          setIsValidationOk(false);
          return;
        }
        const jwtTokenResponse = await onValidateEmail(jwtToken);
        setMessage(jwtTokenResponse.message);
        setIsValidationOk(jwtTokenResponse.status);
      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          console.log('Error: ', error);
        }
      }
    };
    validateToken();
  }, [jwtToken]);

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
          <h1 className="text-center text-lg">{message}</h1>
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
