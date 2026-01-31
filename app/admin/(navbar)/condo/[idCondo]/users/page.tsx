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
import {
  IAdminUser,
  IAdminUsersPageInfo,
  ICondoInfo,
} from '@/interfaces/admin/users.interface';
import { IAskDialog } from '@/interfaces/modal.interface';
import { cn } from '@/lib/utils';
import {
  Check,
  CircleAlert,
  Pencil,
  Plus,
  UserCheck,
  UserLock,
} from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { pageInfo } from './mock';
import { toast } from 'sonner';
import { ITableHeaders } from '@/interfaces/admin/table.interface';
import { usersTableHeaders } from './tableHeaders';

export default function Page() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const qtyPerPage = 8;
  const searchParams = useSearchParams();
  const pageQueryParams = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBarValue, setSearchBarValue] = useState<string>();
  const [tableHeaders, setTableHeaders] =
    useState<ITableHeaders[]>(usersTableHeaders);
  const [idCondo, setIdCondo] = useState('');
  const [condoInfo, setCondoInfo] = useState<ICondoInfo>();
  const [initialUserList, setInitialUserList] = useState<IAdminUser[]>();
  const [userList, setUserList] = useState<IAdminUser[]>();
  const [userData, setUserData] = useState<IAdminUser>();
  const [askDialog, setAskDialog] = useState<IAskDialog>({
    description: '',
    isActive: false,
    title: '',
  });
  const centeredTextHeaders = ['Id', 'Foto', 'Ações'];
  const gridColsLayout = 'md:grid-cols-[1fr_1fr_4fr_4fr_4fr_1fr_1fr_1fr_4fr]';
  const [tableSort, setTableSort] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const pageFromQuery = Number(pageQueryParams);
    setCurrentPage(!pageFromQuery || pageFromQuery < 1 ? 1 : pageFromQuery);
  }, [pageQueryParams]);

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
      setInitialUserList(pageInfo.users);
      setUserList(pageInfo.users);
      setCondoInfo(pageInfo.condo);
      setTableHeaders(
        usersTableHeaders.map((header) => {
          if (header.idTableHeader === 5) {
            return { ...header, name: pageInfo.condo.blockUnit ?? 'Bloco' };
          }
          if (header.idTableHeader === 6) {
            return { ...header, name: pageInfo.condo.lotUnit ?? 'Unidade' };
          }
          return header;
        })
      );
    }
  };

  const startSlicedItem = useMemo(() => {
    if (currentPage == 1) return 0;
    return (currentPage - 1) * qtyPerPage;
  }, [currentPage, qtyPerPage]);

  const lastSlicedItem = useMemo(() => {
    return currentPage * qtyPerPage;
  }, [currentPage, qtyPerPage]);

  const onFilter = (list: IAdminUser[]): void => {
    const term = searchBarValue?.toLocaleLowerCase().trim() ?? '';

    if (!term) {
      setUserList(list);
      return;
    }

    const removeAccents = (str: string): string =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const normalizedTerm = removeAccents(term);

    const filtered = list.filter((user) => {
      const idUser = removeAccents(user.idUser.toString());
      const name = removeAccents(user.name.toLocaleLowerCase().trim());
      const email = removeAccents(user.email.toLocaleLowerCase().trim());
      const phone = removeAccents(user.phone.toLocaleLowerCase().trim());
      const block = removeAccents(
        user.address.block.toLocaleLowerCase().trim()
      );
      const lot = removeAccents(user.address.lot.toLocaleLowerCase().trim());

      return (
        idUser.includes(normalizedTerm) ||
        name.includes(normalizedTerm) ||
        email.includes(normalizedTerm) ||
        phone.includes(normalizedTerm) ||
        block.includes(normalizedTerm) ||
        lot.includes(normalizedTerm)
      );
    });

    setUserList(filtered);
    router.push(`${pathname}?${1}`);
  };

  const onKeyDownSearchBar = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      onFilter(initialUserList ?? []);
    } else if (e.key === 'Escape') {
      setSearchBarValue('');
      setUserList(initialUserList);
    }
  };

  const onShowAskDialog = (user: IAdminUser): void => {
    setUserData(user);
    setAskDialog((prev) => {
      if (user.isActive) {
        return {
          ...prev,
          title: 'Desativar usuário',
          description: `Deseja desativar o usuário ${user.name}`,
          isActive: true,
        };
      } else {
        return {
          ...prev,
          title: 'Ativar usuário',
          description: `Deseja ativar o usuário ${user.name}`,
          isActive: true,
        };
      }
    });
  };

  const onChangeUserActiveState = (): void => {
    setInitialUserList((prev) => {
      if (!prev) return;
      return {
        ...prev,
        users: prev?.map((user) => {
          if (user.idUser != userData?.idUser) {
            return user;
          } else {
            return {
              ...user,
              isActive: !user.isActive,
            };
          }
        }),
      };
    });
    setAskDialog((prev) => {
      return { ...prev, isActive: false };
    });
    toast.success(
      `Usuário ${userData?.name} ${userData?.isActive ? 'desativado' : 'ativado'} com sucesso!`,
      {
        duration: 2000,
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <h1 className="font-medium md:text-2xl text-center">
        Usuários do condomínio {condoInfo?.name}
      </h1>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-2 h-full overflow-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onKeyDown={onKeyDownSearchBar}
            onInputText={(value) => setSearchBarValue(value)}
            onClick={() => onFilter(initialUserList ?? [])}
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
              gridColsLayout
            )}
          >
            {tableHeaders?.map((header, index) => (
              <div
                key={'header-' + index}
                className={cn(
                  'border-gray-400 w-full',
                  centeredTextHeaders.includes(header.name)
                    ? 'text-center'
                    : 'text-start'
                )}
              >
                {' '}
                <span>{header.name}</span>
              </div>
            ))}
          </div>
        </div>
        {userList?.slice(startSlicedItem, lastSlicedItem).map((user, index) => (
          <div
            key={'user-' + index}
            className={cn(
              'grid grid-cols-1 items-center gap-1 md:gap-5 border border-gray-400 sm:p-1 rounded',
              gridColsLayout
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
              <span className="md:hidden">E-mail validado?</span>
              {user.isEmailConfirmed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Check className="bg-green-800 rounded-full p-1 text-white" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Validado</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleAlert className="bg-red-700 rounded-full p-1 text-white" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Não validado</p>
                  </TooltipContent>
                </Tooltip>
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
                        onClick={() => onShowAskDialog(user)}
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
                        onClick={() => onShowAskDialog(user)}
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
        <PaginationComponent
          dataLength={userList?.length ?? 1}
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
