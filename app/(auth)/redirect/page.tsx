import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleX } from 'lucide-react';
import Link from 'next/link';

interface IRedirectProps {
  message: string;
  isOk: boolean;
}

export default function Redirect({ message, isOk = true }: IRedirectProps) {
  return (
    <>
      <Card>
        <CardHeader>
          {isOk ? (
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
