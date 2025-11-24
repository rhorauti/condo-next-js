'use client';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { onGetCSRFToken, onValidateToken } from '@/http/auth/auth.http';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleX } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import authStore from '@/store/auth.store';
import { toast } from 'sonner';

export default function Redirect() {
  const searchParams = useSearchParams();
  const jwtToken = searchParams.get('token');
  const [message, setMessage] = useState('');
  const [isValidationOk, setIsValidationOk] = useState(false);
  const setCSRFfToken = authStore((state) => state.setCSRFToken);

  useEffect(() => {
    const validateToken = async () => {
      const csrfTokenResponse = await onGetCSRFToken();
      const csrfToken = csrfTokenResponse.data?.csrfToken || '';
      if (!csrfTokenResponse || !csrfToken) {
        setMessage('Erro ao solicitar o CSRF token de acesso.');
        return;
      }
      setCSRFfToken(csrfTokenResponse.data?.csrfToken || '');
      if (!jwtToken) {
        setMessage('Erro ao solicitar o JWT token de acesso.');
        setIsValidationOk(false);
        return;
      }
      const jwtTokenResponse = await onValidateToken(csrfToken, jwtToken);
      console.log('jwtTokenResponse', jwtTokenResponse);
      setMessage(jwtTokenResponse.message);
      setIsValidationOk(jwtTokenResponse.status);
    };
    validateToken();
  }, [jwtToken, setCSRFfToken]);

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
