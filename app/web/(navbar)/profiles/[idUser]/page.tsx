'use client';

import ProfileForm from '@/components/form/profile-form';
import { Button } from '@/components/ui/button';
import { WEB_ROUTES } from '@/enum/web/routes.enum';
import { onGetUser } from '@/http/web/auth/auth.http';
import { IUserDetail } from '@/interfaces/user.interface';
import useAuthStore from '@/store/web/auth.store';
import { ArrowLeftCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const previousUrl = WEB_ROUTES.PROFILES;
  const authStore = useAuthStore();
  const [userData, setUserData] = useState<IUserDetail>();

  useEffect(() => {}, []);

  const getUser = async (): Promise<void> => {
    const user = await onGetUser(authStore.credential.idUser);
  };

  return (
    <div className="flex flex-col gap-4 w-[75rem] mb-4">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="text-center md:text-2xl text-lg font-semibold">
          Informações do usuário
        </h1>
        <Button
          onClick={() => router.push(previousUrl)}
          variant={'outline'}
          className="flex sm:w-auto gap-2"
        >
          <ArrowLeftCircle />
          <span className="hidden xs:inline">Voltar</span>
        </Button>
      </div>
      <ProfileForm userData={authStore.credential} previousUrl={previousUrl} />
    </div>
  );
}
