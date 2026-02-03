'use client';

import ProfileForm from '@/components/form/profile-form';
import { Button } from '@/components/ui/button';
import { IUserDetail } from '@/interfaces/user.interface';
import { ArrowLeftCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userDetailsMock } from './user-mock';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const idCondoParams = Number(params.idCondo);
  const idUserParams = Number(params.idUser);
  const [userInfo, setUserInfo] = useState<IUserDetail>();

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
          {userInfo && userInfo?.idUser > 0
            ? 'Editar usuário'
            : 'Cadastro de novo usuário'}
        </h1>
        <Button
          onClick={() => router.push(`/admin/condo/${idCondoParams}/users`)}
          variant={'default'}
          className="flex sm:w-auto gap-2"
        >
          <ArrowLeftCircle />
          <span className="hidden xs:inline">Voltar</span>
        </Button>
      </div>
      <ProfileForm
        userData={userInfo}
        previousUrl={`/admin/condo/${idCondoParams}/users`}
      />
    </div>
  );
}
