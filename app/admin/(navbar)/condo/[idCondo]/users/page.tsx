'use client';

import { PaginationComponent } from '@/components/pagination/pagination.component';
import SearchBar from '@/components/search-bar/search-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Mail, Pencil, Plus, UserCheck, UserLock, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const pageInfo = {
  condo: {
    idCondo: 1,
    name: 'Horto Florestal 1',
  },
  users: [
    {
      idUser: 1,
      createdAt: new Date(),
      name: 'Rafael Horauti 1',
      email: 'rafael_h44@hotmail.com',
      photoUrl: 'https://github.com/shadcn.png',
      fallbackName: 'RH',
      isActive: true,
      isEmailConfirmed: true,
      phone: '11941221211',
      accessLevel: 1,
      address: {
        idAddress: 1,
        block: '10',
        lot: '26',
      },
    },
    {
      idUser: 2,
      createdAt: new Date(),
      name: 'Rafael Horauti 2 asdfas fasd asf as fas d',
      email: 'rafael_h44@hotmail.com',
      photoUrl: 'https://github.com/shadcn.png',
      fallbackName: 'RH',
      isActive: false,
      isEmailConfirmed: true,
      phone: '11941221211',
      accessLevel: 1,
      address: {
        idAddress: 1,
        block: '10',
        lot: '26',
      },
    },
    {
      idUser: 3,
      createdAt: new Date(),
      name: 'Rafael Horauti 3',
      email: 'rafael_h44@hotmail.com',
      photoUrl: 'https://github.com/shadcn.png',
      fallbackName: 'RH',
      isActive: true,
      isEmailConfirmed: true,
      phone: '11941221211',
      accessLevel: 1,
      address: {
        idAddress: 1,
        block: '10',
        lot: '26',
      },
    },
    {
      idUser: 4,
      createdAt: new Date(),
      name: 'Rafael Horauti 4',
      email: 'rafael_h44@hotmail.com',
      photoUrl: 'https://github.com/shadcn.png',
      isActive: true,
      isEmailConfirmed: true,
      phone: '11941221211',
      accessLevel: 1,
      address: {
        idAddress: 1,
        block: '10',
        lot: '26',
      },
    },
    {
      idUser: 1,
      createdAt: new Date(),
      name: 'Rafael Horauti 1',
      email: 'rafael_h44@hotmail.com',
      photoUrl: 'https://github.com/shadcn.png',
      fallbackName: 'RH',
      isActive: true,
      isEmailConfirmed: true,
      phone: '11941221211',
      accessLevel: 1,
      address: {
        idAddress: 1,
        block: '10',
        lot: '26',
      },
    },
    {
      idUser: 2,
      createdAt: new Date(),
      name: 'Rafael Horauti 2 asdfas fasd asf as fas d',
      email: 'rafael_h44@hotmail.com',
      photoUrl: 'https://github.com/shadcn.png',
      fallbackName: 'RH',
      isActive: false,
      isEmailConfirmed: true,
      phone: '11941221211',
      accessLevel: 1,
      address: {
        idAddress: 1,
        block: '10',
        lot: '26',
      },
    },
    {
      idUser: 3,
      createdAt: new Date(),
      name: 'Rafael Horauti 3',
      email: 'rafael_h44@hotmail.com',
      photoUrl: 'https://github.com/shadcn.png',
      fallbackName: 'RH',
      isActive: true,
      isEmailConfirmed: true,
      phone: '11941221211',
      accessLevel: 1,
      address: {
        idAddress: 1,
        block: '10',
        lot: '26',
      },
    },
    {
      idUser: 4,
      createdAt: new Date(),
      name: 'Rafael Horauti 4',
      email: 'rafael_h44@hotmail.com',
      photoUrl: 'https://github.com/shadcn.png',
      isActive: true,
      isEmailConfirmed: true,
      phone: '11941221211',
      accessLevel: 1,
      address: {
        idAddress: 1,
        block: '10',
        lot: '26',
      },
    },
  ],
};

export default function Page() {
  const params = useParams();
  const [searchBarValue, setSearchBarValue] = useState<string>();
  const [idCondo, setIdCondo] = useState('');

  const headers = [
    'Id',
    'Foto',
    'Nome',
    'E-mail',
    'Telefone',
    'Quadra',
    'Lote',
    'Ações',
  ];

  const gridCols = 'md:grid-cols-[1fr_1fr_4fr_4fr_4fr_2fr_2fr_4fr]';

  useEffect(() => {
    setIdCondo((params.idCondo as string) ?? '');
  }, [params.idCondo]);

  const onFilter = (): void => {};

  return (
    <div className="flex flex-col gap-5 w-full">
      <h1 className="font-medium md:text-2xl text-center">
        Usuários do condomínio {pageInfo.condo.name}
      </h1>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-2 h-full overflow-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onInputText={(value) => setSearchBarValue(value)}
            onClick={onFilter}
          />
        </div>
        <Button
          variant="default"
          size={'sm'}
          className={cn('flex gap-2 h-full py-2 sm:py-0')}
        >
          <Plus />
          <span className="hidden sm:block">Adicionar</span>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <div className="hidden md:grid gap-3 w-full">
          <div
            className={cn(
              'grid grid-cols-1 items-center gap-6 bg-slate-800 text-white font-semibold sm:p-1 rounded',
              gridCols
            )}
          >
            {headers.map((header, index) => (
              <div
                key={'header-' + index}
                className={cn(
                  'border-gray-400 w-full',
                  header == 'Id' || header == 'Foto' || header == 'Ações'
                    ? 'text-center'
                    : 'text-start'
                )}
              >
                {' '}
                {header}
              </div>
            ))}
          </div>
        </div>
        {pageInfo.users.map((user, index) => (
          <div
            key={'user-' + index}
            className={cn(
              'grid grid-cols-1 items-center gap-1 md:gap-6 border border-gray-400 sm:p-1 rounded',
              gridCols
            )}
          >
            <div
              className={cn(
                'text-center justify-self-center border-b border-gray-400 w-full md:border-b-0',
                user.isActive ? '' : 'opacity-40'
              )}
            >
              {user.idUser}
            </div>
            <div className="w-10 h-10 mx-auto mt-2 md:mt-0">
              <Avatar
                className={cn(
                  'h-10 w-10 border font-semibold',
                  user.isActive ? '' : 'opacity-50'
                )}
              >
                <AvatarImage src={user.photoUrl} className={cn('mx-auto')} />
                <AvatarFallback className={cn('mx-auto')}>
                  {user.fallbackName}
                </AvatarFallback>
              </Avatar>
            </div>
            <div
              className={cn(
                'text-wrap break-words text-center md:text-start',
                user.isActive ? '' : 'opacity-40'
              )}
            >
              {user.name}
            </div>
            <div
              className={cn(
                'text-sm text-wrap break-words text-center md:text-start',
                user.isActive ? '' : 'opacity-40'
              )}
            >
              {user.email}
            </div>
            <div
              className={cn(
                'text-sm text-wrap break-words text-center md:text-start',
                user.isActive ? '' : 'opacity-40'
              )}
            >
              {user.phone}
            </div>
            <div
              className={cn(
                'hidden md:block text-sm text-wrap break-words text-center md:text-start',
                user.isActive ? '' : 'opacity-40'
              )}
            >
              {user.address.block}
            </div>
            <div
              className={cn(
                'hidden md:block text-sm text-wrap break-words text-center md:text-start',
                user.isActive ? '' : 'opacity-40'
              )}
            >
              {user.address.lot}
            </div>
            <div
              className={cn(
                'md:hidden text-sm text-wrap break-words text-center md:text-start',
                user.isActive ? '' : 'opacity-40'
              )}
            >
              <span>Quadra: {user.address.block} /</span>
              <span> Lote: {user.address.lot}</span>
            </div>
            <div className="flex justify-center gap-3 my-2 md:my-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!user.isActive}
                    variant="default"
                    size={'icon'}
                  >
                    <Mail />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enviar e-mail para ativar o usuário</p>
                </TooltipContent>
              </Tooltip>
              <div>
                {user.isActive ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size={'icon'}
                        className="bg-green-800 hover:bg-green-700"
                      >
                        <UserCheck />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Desativar{' '}
                        <span className="font-medium">{user.name}</span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size={'icon'}
                        className="bg-red-800 hover:bg-red-700"
                      >
                        <UserLock />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Ativar <span className="font-medium">{user.name}</span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!user.isActive}
                    variant="default"
                    size={'icon'}
                    className="bg-yellow-700 hover:bg-yellow-600"
                  >
                    <Pencil />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
        <PaginationComponent totalQtyUsers={pageInfo.users.length} />
      </div>
    </div>
  );
}
