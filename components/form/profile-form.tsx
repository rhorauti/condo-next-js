'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  ArrowLeftCircle,
  ChevronDownIcon,
  Pencil,
  Plus,
  Save,
  Trash,
  UserCheck,
  UserLock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatDateTime, onRemoveMask } from '@/utils/misc';
import { Switch } from '@/components/ui/switch';
import { ProfileImgUpload } from '@/components/file-upload/profile-img-upload';
import { IUserDetail } from '@/interfaces/user.interface';
import {
  IAddressFormDialog,
  IAskDialog,
  IDeleteDialog,
} from '@/interfaces/dialog.interface';
import { DeleteDialog } from '../dialog/delete-dialog';
import { toast } from 'sonner';
import { IMaskInput } from 'react-imask';
import { WEB_ROUTES } from '@/enum/web/routes.enum';
import { USER_ROLES } from '@/enum/role.enum';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { AddressFormDialog } from '../dialog/address-form-dialog';
import { onUpdateUser } from '@/http/web/user/user.http';
import { AskDialog } from '../dialog/ask-dialog';
import { ProfileFormLoading } from '../../app/web/profiles/[idUser]/profile-form-loading';
import Image from 'next/image';

interface ProfileProps {
  previousUrl?: string;
  userData: IUserDetail;
}

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const userSchema = z.object({
  createdAt: z.date().optional(),
  name: z
    .string()
    .nonempty('O nome não pode estar vazio.')
    .refine(
      (value: string) => {
        const parts = value.trim().split(/\s+/);
        if (parts.length < 2) return false;
        if (parts[0].length < 2) return false;
        return true;
      },
      {
        message:
          'Informe nome e sobrenome, com o primeiro nome tendo pelo menos 2 letras.',
      }
    ),
  birthDate: z
    .date('Data inválida.')
    .max(eighteenYearsAgo, { message: 'Você deve ter pelo menos 18 anos.' }),
  email: z
    .email('Formato de e-mail inválido.')
    .nonempty('O email é obrigatório.'),
  phone: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v || !v.trim()) return true;
        const digits = v.replace(/[\D]/g, '');
        return digits.length == 12 || digits.length == 13;
      },
      {
        message: 'Número de telefone incompleto.',
      }
    ),
  isWhatsapp: z.boolean(),
  mediaFile: z.instanceof(File).nullable().optional(),
  mediaObject: z
    .object({
      idMedia: z.number().nullable(),
      mediaUrl: z.string(),
    })
    .nullable(),
  isActive: z.boolean(),
  role: z.enum(USER_ROLES),
});

export type UserDetailSchema = z.infer<typeof userSchema>;

export default function ProfileForm({ userData, previousUrl }: ProfileProps) {
  const adminUserPageId = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [askDialogForDeleteProfile, setAskDialogForDeleteProfile] =
    useState<IAskDialog>({
      description: '',
      isActive: false,
      type: 'danger',
      title: '',
    });
  const [askDialogForSendSignUpEmail, setAskDialogForSendSignUpEmail] =
    useState<IAskDialog>({
      description: '',
      isActive: false,
      type: 'info',
      title: '',
    });
  const [deleteDialog, setDeleteDialog] = useState<IDeleteDialog>({
    registerName: '',
    isActive: false,
    title: '',
  });
  const [addressFormDialog, setAdressFormDialog] = useState<IAddressFormDialog>(
    {
      isActive: false,
      idAddress: 0,
    }
  );
  const [askDialogUserActiveStatus, setAskDialogUserActiveStatus] =
    useState<IAskDialog>({
      description: '',
      isActive: false,
      title: '',
      type: 'info',
    });

  const form = useForm<UserDetailSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      createdAt: new Date('2026-01-26'),
      name: '',
      birthDate: new Date('1984-02-28'),
      email: '',
      phone: '',
      isWhatsapp: true,
      mediaObject: {
        idMedia: 0,
        mediaUrl: '',
      },
      mediaFile: null,
      isActive: false,
      role: USER_ROLES.USER,
    },
  });

  const { reset, setValue, getValues, control, formState, watch } = form;
  const isActive = watch('isActive');

  useEffect(() => {
    if (!userData) return;
    reset({
      createdAt: new Date(userData.createdAt),
      name: userData.name,
      birthDate: new Date(userData.birthDate),
      email: userData.email,
      phone: userData.phone ?? '',
      mediaObject: userData.mediaObject ?? null,
      isWhatsapp: userData.isWhatsapp,
      mediaFile: null,
      isActive: userData.isActive,
      role: userData.role ?? USER_ROLES.USER,
    });
  }, [userData, reset]);

  const onShowAskDialogForDeleteProfile = (): void => {
    setAskDialogForDeleteProfile((prev) => {
      return {
        ...prev,
        type: 'danger',
        title: `Excluir ${getValues('name')}?`,
        description:
          'Deseja excluir permanentemente este usuário? Todas as publicações deste usuário serão excluidas e não será possível retornar com os dados.',
        isActive: true,
      };
    });
  };

  const onCloseAskDialogForDeleteProfile = (): void => {
    setAskDialogForDeleteProfile((prev) => {
      return {
        ...prev,
        isActive: false,
      };
    });
  };

  const onCloseDeleteDialog = (): void => {
    setDeleteDialog((prev) => {
      return { ...prev, isActive: false };
    });
  };

  const onShowDeleteDialogForDeleteProfile = (): void => {
    onCloseAskDialogForDeleteProfile();
    setDeleteDialog((prev) => {
      return {
        ...prev,
        title: `Excluir ${getValues('name')}?`,
        registerName: getValues('name'),
        isActive: true,
      };
    });
  };

  const onDeleteRegister = (): void => {
    toast.success(`${getValues('name')} excluido com sucesso.`, {
      duration: 2000,
      action: {
        label: 'Fechar',
        onClick: () => {},
      },
    });
    onCloseDeleteDialog();
    router.push(previousUrl ?? WEB_ROUTES.HOME);
  };

  const onCloseAskDialogForSendSignUpEmail = (): void => {
    setAskDialogForSendSignUpEmail((prev) => {
      return { ...prev, isActive: false };
    });
  };

  const onShowAddressDialog = (idAddress?: number): void => {
    setAdressFormDialog((prev) => {
      return {
        ...prev,
        idAddress: idAddress ? idAddress : 0,
        isActive: true,
      };
    });
  };

  const finalData: UserDetailSchema = {
    name: '',
    birthDate: new Date('2026-01-28'),
    email: '',
    phone: '',
    isWhatsapp: true,
    mediaObject: {
      idMedia: 0,
      mediaUrl: '',
    },
    isActive: false,
    role: USER_ROLES.USER,
  };

  const onShowAskDialogUserActiveStatus = (): void => {
    setAskDialogUserActiveStatus((prev) => {
      if (isActive) {
        return {
          ...prev,
          title: 'Desativar usuário',
          type: 'danger',
          description: `Deseja desativar o usuário ${userData.name}`,
          isActive: true,
        };
      } else {
        return {
          ...prev,
          title: 'Ativar usuário',
          type: 'info',
          description: `Deseja ativar o usuário ${userData.name}`,
          isActive: true,
        };
      }
    });
  };

  const onChangeUserActiveState = (): void => {
    setAskDialogUserActiveStatus((prev) => {
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

  const setFinalData = () => {
    finalData.name = getValues('name');
    finalData.birthDate = new Date(getValues('birthDate'));
    finalData.email = getValues('email');
    finalData.phone = onRemoveMask(getValues('phone') ?? '');
    finalData.isActive = getValues('isActive');
    finalData.mediaObject = getValues('mediaObject');
    finalData.isWhatsapp = getValues('isWhatsapp');
  };

  const onSubmit = async (): Promise<void> => {
    setFinalData();
    const formData = new FormData();
    const file = getValues('mediaFile');
    if (file) {
      formData.append('file', file);
    }
    formData.append('data', JSON.stringify(finalData));
    const toastId = toast.loading('Aguarde...');
    try {
      const response = await onUpdateUser(formData);
      if (response && response.status) {
        toast.success(response.message, {
          id: toastId,
          action: {
            label: 'Fechar',
            onClick: () => '',
          },
        });
      } else {
        throw new Error('Erro ao atualizar as informações do usuário.');
      }
    } catch (error: any) {
      toast.error(error.message, {
        id: toastId,
        action: {
          label: 'Fechar',
          onClick: () => '',
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* <Controller
        name="isActive"
        control={control}
        render={({ field, fieldState }) => {
          const isActive = field.value;

          return (
            <Field className={cn('md:shrink')}>
              <div className="flex gap-4 items-center">
                <span>{isActive ? 'Ativo' : 'Não Ativo'}</span>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      /> */}
      <form
        id={adminUserPageId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex justify-between gap-2 bg-slate-700 text-white rounded-md w-full p-3">
          <p className="font-medium sm:text-lg">Dados Cadastrais</p>
          <Button
            type="submit"
            variant="default"
            size={'sm'}
            className={cn('flex gap-2 h-full py-2 sm:py-0')}
          >
            <Save />
            <span className="hidden sm:block">Salvar</span>
          </Button>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:items-center gap-4">
          <div className="flex flex-col gap-2 grow">
            <div className="flex flex-col md:flex-row gap-2">
              <>
                <Controller
                  name="createdAt"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field className={'md:grow'}>
                      <FieldLabel
                        htmlFor={`admin-user-input-created-at-${adminUserPageId}`}
                      >
                        Data da criação
                      </FieldLabel>
                      <Input
                        {...field}
                        disabled={formState.isSubmitting || !isActive}
                        readOnly
                        id={`admin-user-input-created-at-${adminUserPageId}`}
                        value={formatDateTime(field.value ?? '') ?? ''}
                      />
                    </Field>
                  )}
                />
              </>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className={'md:grow-[4]'}>
                    <FieldLabel
                      htmlFor={`admin-user-input-name-${adminUserPageId}`}
                    >
                      Nome
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value}
                      disabled={formState.isSubmitting || !isActive}
                      autoComplete="name"
                      id={`admin-user-input-name-${adminUserPageId}`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Controller
                name="birthDate"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className={'md:grow'}>
                    <FieldLabel
                      htmlFor={`admin-user-input-birth-date-${adminUserPageId}`}
                    >
                      Data de nascimento
                    </FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger
                        asChild
                        className={cn(
                          fieldState.invalid &&
                            'border-destructive focus-visible:shadow-none'
                        )}
                      >
                        <Button
                          onClick={(e) => e.preventDefault()}
                          variant="outline"
                          id={`admin-user-button-birth-date-${adminUserPageId}`}
                          disabled={formState.isSubmitting || !isActive}
                          className={cn(
                            `w-48 justify-between font-normal border-input hover:bg-transparent cursor-default`
                          )}
                        >
                          {field.value ? (
                            formatDateTime(field.value)
                          ) : (
                            <span
                              className={
                                fieldState.invalid ? 'text-destructive' : ''
                              }
                            >
                              Selecione uma data
                            </span>
                          )}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          defaultMonth={field.value}
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className={'md:grow-[4]'}>
                    <FieldLabel
                      htmlFor={`admin-user-input-email-${adminUserPageId}`}
                    >
                      E-mail
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value}
                      disabled={formState.isSubmitting || !isActive}
                      readOnly
                      autoComplete="email"
                      id={`admin-user-input-email-${adminUserPageId}`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="flex gap-2 items-end">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field className="grow">
                      <FieldLabel
                        htmlFor={`admin-user-input-phone-${adminUserPageId}`}
                      >
                        Telefone
                      </FieldLabel>

                      <IMaskInput
                        mask={['+00 (00) 0000-0000', '+00 (00) 00000-0000']}
                        definitions={{
                          '0': /[0-9]/,
                        }}
                        value={field.value ?? ''}
                        onAccept={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        disabled={formState.isSubmitting || !isActive}
                        id={`admin-user-input-phone-${adminUserPageId}`}
                        autoComplete="tel"
                        className={cn(
                          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                          fieldState.invalid && 'border-destructive'
                        )}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="isWhatsapp"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <div className="flex items-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant={'outline'}
                              onClick={() => field.onChange(!field.value)}
                              className="inline-flex items-center justify-center"
                            >
                              <Image
                                src={
                                  field.value
                                    ? '/whatsapp.png'
                                    : '/no-whatsapp.png'
                                }
                                alt="whatsapp image"
                                width={26}
                                height={26}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="w-fit"
                            side="top"
                            align="center"
                          >
                            <p>É whattsapp?</p>
                          </TooltipContent>
                        </Tooltip>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <ProfileImgUpload
            control={control}
            setValue={setValue}
            fileName="mediaFile"
            mediaObject="mediaObject"
            isDisabled={!isActive}
          />
        </div>
        <div className="flex justify-between bg-slate-700 text-white rounded-md w-full p-3">
          <p className="font-medium md:text-lg">
            {userData.address?.length == 0 ? 'Endereço' : 'Endereços'}
          </p>
          <Button
            onClick={() => onShowAddressDialog(0)}
            type="button"
            variant="default"
            size={'sm'}
            className={cn('flex gap-2 h-full py-2 sm:py-0')}
          >
            <Plus />
            <span className="hidden sm:block">Adicionar</span>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {userData.address?.map((address, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2">
              <Field>
                <FieldLabel
                  htmlFor={`admin-user-input-id-address-${adminUserPageId}`}
                >
                  Id
                </FieldLabel>
                <Input
                  value={address.idAddress}
                  readOnly
                  disabled={!isActive}
                  id={`admin-user-input-id-address-${adminUserPageId}`}
                />
              </Field>
              <Field>
                <FieldLabel
                  htmlFor={`admin-user-input-address-type-${adminUserPageId}`}
                >
                  Tipo de moradia
                </FieldLabel>
                <Input
                  value={address.type == 'HOUSE' ? 'Casa' : 'Apartamento'}
                  readOnly
                  disabled={!isActive}
                  id={`admin-user-input-address-type-${adminUserPageId}`}
                />
              </Field>
              <Field className={cn('md:grow')}>
                <FieldLabel
                  htmlFor={`admin-user-input-address-${adminUserPageId}`}
                >
                  Logradouro
                </FieldLabel>
                <Input
                  value={address.street ?? ''}
                  readOnly
                  disabled={!isActive}
                  id={`admin-user-input-address-${adminUserPageId}`}
                />
              </Field>
              <Field>
                <FieldLabel
                  htmlFor={`admin-user-input-address-block-${adminUserPageId}`}
                >
                  {address.blockType ?? 'Bloco'}
                </FieldLabel>
                <Input
                  value={address.block ?? ''}
                  readOnly
                  disabled={!isActive}
                  id={`admin-user-input-address-block-${adminUserPageId}`}
                />
              </Field>
              <Field>
                <FieldLabel
                  htmlFor={`admin-user-input-address-lot-${adminUserPageId}`}
                >
                  {address.blockType ?? 'Lote'}
                </FieldLabel>
                <Input
                  value={address.block ?? ''}
                  readOnly
                  disabled={!isActive}
                  id={`admin-user-input-address-lot-${adminUserPageId}`}
                />
              </Field>
              <div className="flex justify-center items-end gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onShowAddressDialog(address.idAddress)}
                      type="button"
                      variant="default"
                      size={'icon'}
                      disabled={!isActive}
                      className="bg-yellow-700 hover:bg-yellow-600"
                    >
                      <Pencil />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="default"
                      size={'icon'}
                      disabled={!isActive}
                      className="bg-red-700 hover:bg-red-600"
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Excluir</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between bg-slate-700 text-white rounded-md w-full p-3">
          <p className="font-medium md:text-lg">Ações</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            type="button"
            onClick={() => router.push(previousUrl ?? WEB_ROUTES.HOME)}
            variant={'outline'}
            className="w-full sm:w-auto"
          >
            <ArrowLeftCircle />
            <span>Voltar</span>
          </Button>
          <Button
            type="button"
            onClick={onShowAskDialogForDeleteProfile}
            variant={'destructive'}
            className="w-full sm:w-auto"
            disabled={formState.isSubmitting || !isActive}
          >
            <Trash />
            <span>Excluir</span>
          </Button>
          <Button
            type="button"
            onClick={onShowAskDialogUserActiveStatus}
            variant="default"
            className={`w-full sm:w-auto ${isActive ? 'bg-green-800 hover:bg-green-700' : 'bg-red-800 hover:bg-red-700'}`}
          >
            {isActive ? <UserCheck /> : <UserLock />}
            <span className="w-full">{isActive ? 'Desativar' : 'Ativar'}</span>
          </Button>
        </div>
      </form>

      <AskDialog
        isActive={askDialogForDeleteProfile.isActive}
        description={askDialogForDeleteProfile.description}
        title={askDialogForDeleteProfile.title}
        type={askDialogForDeleteProfile.type || 'danger'}
        onActionNok={onCloseAskDialogForDeleteProfile}
        onActionOk={onShowDeleteDialogForDeleteProfile}
      />

      <AskDialog
        isActive={askDialogForSendSignUpEmail.isActive}
        description={askDialogForSendSignUpEmail.description}
        title={askDialogForSendSignUpEmail.title}
        showCloseButton={true}
        onActionNok={onCloseAskDialogForSendSignUpEmail}
        onActionOk={() => {
          form.handleSubmit(onSubmit)();
          onCloseAskDialogForSendSignUpEmail();
        }}
      />

      <DeleteDialog
        isActive={deleteDialog.isActive}
        title={deleteDialog.title}
        registerName={deleteDialog.registerName}
        onActionNok={onCloseDeleteDialog}
        onActionOk={onDeleteRegister}
      />

      {addressFormDialog.isActive && (
        <AddressFormDialog
          isActive={addressFormDialog.isActive}
          idAddress={addressFormDialog.idAddress}
          idUser={userData.idUser}
          onCloseDialog={() =>
            setAdressFormDialog((prev) => {
              return { ...prev, isActive: false };
            })
          }
        />
      )}

      <AskDialog
        isActive={askDialogUserActiveStatus.isActive}
        description={askDialogUserActiveStatus.description}
        title={askDialogUserActiveStatus.title}
        type={askDialogUserActiveStatus.type}
        onActionNok={() =>
          setAskDialogUserActiveStatus((prev) => {
            return { ...prev, isActive: false };
          })
        }
        onActionOk={onChangeUserActiveState}
      />
    </div>
  );
}
