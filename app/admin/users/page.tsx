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
import { IAdminUserHome } from '@/interfaces/admin/admin-users.interface';
import { IAskDialog } from '@/interfaces/dialog.interface';
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
import { useEffect, useId, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ITableHeaders } from '@/interfaces/admin/admin-table.interface';
import { usersTableHeaders } from './tableHeaders';
import { IAdminCondoUserHome } from '@/interfaces/admin/admin-condo.interface';
import { formatTelephoneNumber } from '@/utils/misc';
import Image from 'next/image';
import Link from 'next/link';
import { EmailSendDialog } from '@/components/dialog/email-send.dialog';
import { response } from './mock';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ADMIN_ROUTES,
  buildAdminDinamicRoute,
} from '@/enum/admin/admin-routes.enum';
import { onSendEmailToCreateUser } from '@/http/admin/auth/users-admin.http';
import { USER_ROLES } from '@/enum/role.enum';

export default function Page() {
  const adminUserPageId = useId();
  const pathName = usePathname();
  const router = useRouter();
  const qtyPerPage = 8;
  const searchParams = useSearchParams();
  const pageQueryParams = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBarValue, setSearchBarValue] = useState<string>();
  const [tableHeaders, setTableHeaders] =
    useState<ITableHeaders[]>(usersTableHeaders);
  const [condoInfo, setCondoInfo] = useState<IAdminCondoUserHome>();
  const [condoList, setCondoList] = useState<IAdminCondoUserHome[]>([]);
  const [initialUserList, setInitialUserList] = useState<IAdminUserHome[]>();
  const [userList, setUserList] = useState<IAdminUserHome[]>();
  const [userData, setUserData] = useState<IAdminUserHome>();
  const [askDialog, setAskDialog] = useState<IAskDialog>({
    description: '',
    isActive: false,
    title: '',
    type: 'info',
  });
  const [isEmailSendDialogActive, setIsEmailSendDialogActive] = useState(false);
  const centeredTextHeaders = ['Id', 'Foto', 'Ações'];
  const gridColsLayout = 'md:grid-cols-[1fr_1fr_4fr_4fr_4fr_1fr_1fr_3fr]';
  const [tableSort, setTableSort] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    fetchPageInfo();
  }, []);

  useEffect(() => {
    const pageFromQuery = Number(pageQueryParams);
    setCurrentPage(!pageFromQuery || pageFromQuery < 1 ? 1 : pageFromQuery);
  }, [pageQueryParams]);

  const fetchPageInfo = async (): Promise<void> => {
    // const response = await onGetAdminUsersPageInfo(Number(idCondo));
    if (response && response.data) {
      setInitialUserList(response.data.users);
      setUserList(response.data.users);
      setCondoInfo(response.data.condo);
      setCondoList(response.data.condoList);
      if (response.data.condo) {
        setTableHeaders(
          usersTableHeaders.map((header) => {
            if (header.idTableHeader === 5) {
              return {
                ...header,
                name: response.data?.condo.blockUnit ?? 'Bloco',
              };
            }
            if (header.idTableHeader === 6) {
              return {
                ...header,
                name: response.data?.condo?.lotUnit ?? 'Unidade',
              };
            }
            return header;
          })
        );
      }
    }
  };

  const startSlicedItem = useMemo(() => {
    if (currentPage == 1) return 0;
    return (currentPage - 1) * qtyPerPage;
  }, [currentPage, qtyPerPage]);

  const lastSlicedItem = useMemo(() => {
    return currentPage * qtyPerPage;
  }, [currentPage, qtyPerPage]);

  const onFilter = (list: IAdminUserHome[]): void => {
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
    router.push(`${pathName}?${1}`);
  };

  const onKeyDownSearchBar = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      onFilter(initialUserList ?? []);
    } else if (e.key === 'Escape') {
      setSearchBarValue('');
      setUserList(initialUserList);
    }
  };

  const onShowAskDialog = (user: IAdminUserHome): void => {
    setUserData(user);
    setAskDialog((prev) => {
      if (user.isActive) {
        return {
          ...prev,
          title: 'Desativar usuário',
          type: 'danger',
          description: `Deseja desativar o usuário ${user.name}`,
          isActive: true,
        };
      } else {
        return {
          ...prev,
          title: 'Ativar usuário',
          type: 'info',
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

  const onSetCondoInfo = (idCondo: number): void => {
    const condo = condoList.find((condo) => condo.idCondo == idCondo);
    setCondoInfo(condo);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:justify-between">
        <h1 className="font-medium md:text-2xl text-center">
          Usuários do condomínio {condoInfo?.name}
        </h1>
        <Select
          value={condoInfo ? condoInfo?.idCondo.toString() : ''}
          onValueChange={(idCondo) => onSetCondoInfo(Number(idCondo))}
        >
          <SelectTrigger
            id={`admin-user-select-${adminUserPageId}`}
            className="w-auto"
          >
            <SelectValue placeholder="Selecione o condominio" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {response.data?.condoList.map((condo, index) => (
                <SelectItem key={index} value={condo.idCondo.toString()}>
                  {condo.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-2 h-full overflow-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onKeyDown={onKeyDownSearchBar}
            onInputText={(value) => setSearchBarValue(value)}
            onClick={() => onFilter(initialUserList ?? [])}
          />
        </div>
        <Button
          onClick={() => setIsEmailSendDialogActive(true)}
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
                'flex justify-center md:justify-start items-center gap-2 text-sm text-wrap break-words text-center md:text-start',
                user.isActive ? '' : 'opacity-40'
              )}
            >
              <span>{formatTelephoneNumber(user.phone)}</span>
              {user.isWhatsapp && user.isActive && (
                <Link href={`https://wa.me/${user.phone}`}>
                  <Image
                    src="/whatsapp.png"
                    alt="whatsapp image"
                    width={18}
                    height={18}
                    className="cursor-pointer w-[18px] h-[18px] object-contain"
                  />
                </Link>
              )}
              {user.isWhatsapp && !user.isActive && (
                <Image
                  src="/whatsapp.png"
                  alt="whatsapp image"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain"
                />
              )}
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
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onShowAskDialog(user)}
                      variant="default"
                      size={'icon'}
                      className={`${user.isActive ? 'bg-green-800 hover:bg-green-700' : 'bg-red-800 hover:bg-red-700'}`}
                    >
                      {user.isActive ? <UserCheck /> : <UserLock />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.isActive ? 'Desativar' : 'Ativar'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() =>
                      router.push(
                        buildAdminDinamicRoute(ADMIN_ROUTES.USERS, user.idUser)
                      )
                    }
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
        type={askDialog.type}
        onActionNok={() =>
          setAskDialog((prev) => {
            return { ...prev, isActive: false };
          })
        }
        onActionOk={onChangeUserActiveState}
      />
      <EmailSendDialog
        isActive={isEmailSendDialogActive}
        role={USER_ROLES.USER}
        onActionNok={() => setIsEmailSendDialogActive(false)}
      />
    </div>
  );
}
