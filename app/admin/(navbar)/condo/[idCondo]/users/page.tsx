'use client';

import { AskDialog } from '@/components/dialog/ask-dialog';
import { PaginationComponent } from '@/components/pagination/pagination.component';
import SearchBar from '@/components/search-bar/search-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { onGetAdminUsersPageInfo } from '@/http/admin/users.http';
import { IAdminUsersPageInfo } from '@/interfaces/admin/users.interface';
import { IAskDialog } from '@/interfaces/modal.interface';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/utils/misc';
import {
  Check,
  CircleAlert,
  Mail,
  Pencil,
  Plus,
  UserCheck,
  UserLock,
  Users,
} from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { pageInfo } from './mock';

export default function Page() {
  const params = useParams();
  const qtyPerPage = 5;
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBarValue, setSearchBarValue] = useState<string>();
  const [headers, setHeaders] = useState<string[]>([]);
  const [idCondo, setIdCondo] = useState('');
  const [adminUsersPageInfo, setAdminUsersPageInfo] =
    useState<IAdminUsersPageInfo>();
  const [askDialog, setAskDialog] = useState<IAskDialog>({
    description: '',
    isActive: false,
    title: '',
  });

  const gridCols = 'md:grid-cols-[1fr_1fr_4fr_4fr_4fr_1fr_1fr_1fr_4fr]';

  useEffect(() => {
    const page = searchParams.get('page');
    setCurrentPage(Number(page) ?? 1);
  }, [searchParams]);

  useEffect(() => {
    const id = (params.idCondo as string) ?? '';
    setIdCondo(id);
    if (!id) return;
    fetchPageInfo();
  }, [params.idCondo]);

  const fetchPageInfo = async (): Promise<void> => {
    // const pageInfo = await onGetAdminUsersPageInfo(Number(idCondo));
    if (pageInfo) {
      // setAdminUsersPageInfo(pageInfo.data);
      setAdminUsersPageInfo(pageInfo);
      setHeaders([
        'Id',
        'Foto',
        'Nome',
        'E-mail',
        'Telefone',
        pageInfo.condo.blockUnit,
        pageInfo.condo.lotUnit,
        // adminUsersPageInfo ? adminUsersPageInfo.condo.blockUnit : '',
        // adminUsersPageInfo ? adminUsersPageInfo.condo.lotUnit : '',
        'E-mail confirmado?',
        'Ações',
      ]);
    }
  };

  const startSlicedItem = useMemo(() => {
    console.log('startSlicedItem', currentPage * qtyPerPage - 1);
    if (currentPage == 1) return 0;
    return (currentPage - 1) * qtyPerPage;
  }, [currentPage, qtyPerPage]);

  const lastSlicedItem = useMemo(() => {
    console.log('lastSlicedItem', currentPage * qtyPerPage + qtyPerPage);

    return currentPage * qtyPerPage;
  }, [currentPage, qtyPerPage]);

  const onFilter = (): void => {};

  const onShowAskDialog = (name: string): void => {
    setAskDialog((prev) => {
      return {
        ...prev,
        title: 'Desativar usuário',
        description: `Deseja desativar o usuário ${name}`,
        isActive: true,
      };
    });
  };

  const onChangeUserActiveState = (): void => {
    setAskDialog((prev) => {
      return { ...prev, isActive: false };
    });
  };

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
                  header == 'Id' ||
                    header == 'Foto' ||
                    header == 'Criação' ||
                    header == 'Ações'
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
        {pageInfo.users
          .slice(startSlicedItem, lastSlicedItem)
          .map((user, index) => (
            <div
              key={'user-' + index}
              className={cn(
                'grid grid-cols-1 items-center gap-1 md:gap-5 border border-gray-400 sm:p-1 rounded',
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
              <div
                className={cn(
                  'flex justify-center gap-2 text-sm text-wrap break-words text-center md:text-start',
                  user.isActive ? '' : 'opacity-40'
                )}
              >
                <span className="md:hidden">E-mail confirmado?:</span>
                {user.isEmailConfirmed ? (
                  <Check className="bg-green-800 rounded-full p-1 text-white" />
                ) : (
                  <CircleAlert className="bg-red-700 rounded-full p-1 text-white" />
                )}
              </div>
              <div className="flex justify-center gap-3 my-2 md:my-1">
                {/* <Tooltip>
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
              </Tooltip> */}
                <div>
                  {user.isActive ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onShowAskDialog(user.name)}
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
                          Ativar{' '}
                          <span className="font-medium">{user.name}</span>
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
        <PaginationComponent
          dataLength={pageInfo.users.length}
          qtyPerPage={qtyPerPage}
        />
      </div>
      <AskDialog
        isActive={askDialog.isActive}
        description={askDialog.description}
        title={askDialog.title}
        onActionNok={() =>
          setAskDialog((prev) => {
            return { ...prev, isActive: false };
          })
        }
        onActionOk={onChangeUserActiveState}
      />
    </div>
  );
}
