'use client';

import ProfileForm from '@/components/form/profile-form';
import { Button } from '@/components/ui/button';
import { WEB_ROUTES } from '@/enum/web/routes.enum';
import { onGetDetailedAuthUser } from '@/http/web/auth/auth.http';
import { IUserDetail } from '@/interfaces/user.interface';
import { ArrowLeftCircle } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const initialUserData = {
  idUser: 0,
  name: '',
  birthDate: '',
  createdAt: '',
  email: '',
  fallbackName: '',
  isActive: false,
  isWhatsapp: false,
  mediaObject: null,
  phone: '',
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const idUser = params.idUser ?? 0;
  const previousUrl = WEB_ROUTES.PROFILES;
  const [userData, setUserData] = useState<IUserDetail>(initialUserData);

  useEffect(() => {
    console.log('me', idUser);
    if (idUser == 'me') {
      getAuthUser();
    }
  }, [idUser]);

  const getAuthUser = async (): Promise<void> => {
    const user = await onGetDetailedAuthUser();
    if (user) {
      setUserData(user.data ?? initialUserData);
    }
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
      <ProfileForm userData={userData} previousUrl={previousUrl} />
    </div>
  );
}
