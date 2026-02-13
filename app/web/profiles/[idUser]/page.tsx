'use client';

import { AddressFormDialog } from '@/components/dialog/address-form-dialog';
import ProfileForm from '@/components/form/profile-form';
import { ProfileFormLoading } from '@/app/web/profiles/[idUser]/profile-form-loading';
import { Button } from '@/components/ui/button';
import { WEB_ROUTES } from '@/enum/web/routes.enum';
import { onGetDetailedAuthUserInfo } from '@/http/web/user/user.http';
import { IAddressFormDialog } from '@/interfaces/dialog.interface';
import { IUserDetail } from '@/interfaces/user.interface';
import { ArrowLeftCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
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
  const previousUrl = WEB_ROUTES.PROFILES;
  const [userData, setUserData] = useState<IUserDetail>();

  useEffect(() => {
    getAuthUser();
  }, []);

  const getAuthUser = async (): Promise<void> => {
    const user = await onGetDetailedAuthUserInfo();
    if (user) {
      setUserData(user.data ?? initialUserData);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full sm:w-[75rem] mb-4">
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
      {!userData ? (
        <ProfileFormLoading />
      ) : (
        <ProfileForm userData={userData} previousUrl={previousUrl} />
      )}
    </div>
  );
}
