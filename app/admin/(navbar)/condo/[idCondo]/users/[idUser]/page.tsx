'use client';

import ProfileForm from '@/components/form/profile-form';
import { Button } from '@/components/ui/button';
import { IUserDetail } from '@/interfaces/user.interface';
import { ArrowLeftCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userDetailsMock } from './user-mock';

export const initialUserInfo = {
  idUser: 0,
  createdAt: '',
  name: '',
  birthDate: new Date('1984-02-22'),
  email: '',
  phone: '',
  mediaObject: {
    idMedia: 0,
    mediaUrl: '',
  },
  fallbackName: '',
  isActive: true,
  isEmailConfirmed: false,
  isWhatsapp: true,
  accessLevel: 0,
  address: {
    idAddress: 0,
    postalCode: '',
    type: '',
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    blockType: '',
    block: '',
    lotType: '',
    lot: '',
  },
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const idCondoParams = Number(params.idCondo);
  const idUserParams = Number(params.idUser);
  const [userInfo, setUserInfo] = useState<IUserDetail>(initialUserInfo);
  const previousUrl = `/admin/condo/${idCondoParams}/users`;

  useEffect(() => {
    const idUserParams = Number(params.idUser);
    onGetUserInfo(idCondoParams, idUserParams);
  }, [idUserParams, idCondoParams]);

  const onGetUserInfo = async (
    idCondo: number,
    idUser: number
  ): Promise<void> => {
    // const user = await onGetAdminUserInfo(idCondo, idUser);
    // if (user) {
    //   setUserInfo(user.data);
    // }
    setUserInfo(userDetailsMock);
  };
  return (
    <div className="flex flex-col gap-4 w-[75rem] mb-4">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="text-center md:text-2xl text-lg font-semibold">
          Editar Usuário
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
      <ProfileForm userData={userInfo} previousUrl={previousUrl} />
    </div>
  );
}
