'use client';

import {
  onGetAdminUserInfo,
  onSendEmailToCreateUser,
} from '@/http/admin/auth/users-admin.http';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatDateTime, onRemoveMask } from '@/utils/misc';
import { Switch } from '@/components/ui/switch';
import { ProfileImgUpload } from '@/components/file-upload/profile-img-upload';
import { IUserDetail } from '@/interfaces/user.interface';
import { getAddressFromCep } from '@/http/web/third-part/third-part.http';
import { AskDialog } from '../dialog/ask-dialog';
import { IAskDialog, IDeleteDialog } from '@/interfaces/modal.interface';
import { DeleteDialog } from '../dialog/delete-dialog';
import { toast } from 'sonner';
import { IMaskInput } from 'react-imask';

interface ProfileProps {
  previousUrl: string;
  userData?: IUserDetail;
}

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const adminUserSchema = z.object({
  idUser: z.number(),
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
  mediaFile: z.instanceof(File).optional().nullable(),
  mediaObject: z
    .object({
      idMedia: z.number().nullable(),
      mediaUrl: z.string(),
    })
    .nullable(),
  isActive: z.boolean(),
  isEmailConfirmed: z.boolean().optional(),
  accessLevel: z.number().optional(),
  address: z.object({
    idAddress: z.number().optional(),
    postalCode: z
      .string()
      .nullable()
      .refine(
        (v) => {
          if (!v || !v.trim()) return true;
          const digits = v.replace(/[\D]/g, '').trim();
          return digits.length == 8;
        },
        {
          message: 'CEP incompleto.',
        }
      ),
    type: z.string().nullable().optional(),
    street: z.string().nullable(),
    number: z.string().nullable(),
    district: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    blockType: z.string().nullable().optional(),
    block: z.string().nullable(),
    lotType: z.string().nullable().optional(),
    lot: z.string().nullable(),
  }),
});

export type AdminUserSchema = z.infer<typeof adminUserSchema>;

export default function ProfileForm({ userData, previousUrl }: ProfileProps) {
  const adminUserPageId = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isInputPostalCodeLoading, setIsInputPostalCodeLoading] =
    useState(false);
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
  const form = useForm<AdminUserSchema>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      idUser: 0,
      createdAt: new Date('2026-01-26'),
      name: '',
      birthDate: new Date('1984-02-28'),
      email: '',
      phone: '',
      mediaObject: {
        idMedia: 0,
        mediaUrl: '',
      },
      mediaFile: null,
      isActive: false,
      isEmailConfirmed: false,
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
    },
  });

  const { reset, setValue, getValues, control, formState, watch } = form;
  const isActive = watch('isActive');

  useEffect(() => {
    if (!userData) return;
    reset({
      idUser: userData.idUser,
      createdAt: new Date(userData.createdAt),
      name: userData.name,
      birthDate: new Date(userData.birthDate),
      email: userData.email,
      phone: userData.phone ?? '',
      mediaObject: userData.mediaObject ?? null,
      mediaFile: null,
      isActive: userData.isActive,
      isEmailConfirmed: userData.isEmailConfirmed,
      accessLevel: userData.accessLevel,
      address: {
        idAddress: userData.address.idAddress,
        type: userData.address.type,
        street: userData.address.street,
        postalCode: userData.address.postalCode,
        number: userData.address.number,
        district: userData.address.district,
        city: userData.address.city,
        state: userData.address.state,
        blockType: userData.address.blockType,
        block: userData.address.block,
        lotType: userData.address.lotType,
        lot: userData.address.lot,
      },
    });
  }, [userData, reset]);

  const onSetAddressViaCEPValues = async (): Promise<void> => {
    setIsInputPostalCodeLoading(true);
    try {
      const postalCode = getValues('address.postalCode');
      if (!postalCode || onRemoveMask(postalCode).length != 8) {
        return;
      }
      const response = await getAddressFromCep(postalCode ?? '');
      if (response) {
        setValue('address.street', response.logradouro);
        setValue('address.district', response.bairro);
        setValue('address.city', response.localidade);
        setValue('address.state', response.uf);
      }
    } catch (error) {
      console.log('Erro ao buscar o CEP');
    } finally {
      setIsInputPostalCodeLoading(false);
    }
  };

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
    router.push(previousUrl);
  };

  const onCloseAskDialogForSendSignUpEmail = (): void => {
    setAskDialogForSendSignUpEmail((prev) => {
      return { ...prev, isActive: false };
    });
  };

  const onSendSignUpEmail = (): void => {
    onSendEmailToCreateUser(getValues('email'));
    toast.success('Login efetuado com sucesso!', {
      duration: 2000,
      action: {
        label: 'Fechar',
        onClick: () => {},
      },
    });
  };

  const finalData: AdminUserSchema = {
    idUser: 0,
    name: '',
    birthDate: new Date('2026-01-28'),
    email: '',
    phone: '',
    mediaObject: {
      idMedia: 0,
      mediaUrl: '',
    },
    isActive: false,
    address: {
      idAddress: 0,
      postalCode: '',
      street: '',
      number: '',
      district: '',
      city: '',
      state: '',
      block: '',
      lot: '',
    },
  };

  const setFinalData = () => {
    finalData.idUser = getValues('idUser');
    finalData.name = getValues('name');
    finalData.birthDate = new Date(getValues('birthDate'));
    finalData.email = getValues('email');
    finalData.phone = onRemoveMask(getValues('phone') ?? '');
    finalData.isActive = getValues('isActive');
    finalData.mediaObject = getValues('mediaObject');
    finalData.address.idAddress = getValues('address.idAddress') ?? 0;
    finalData.address.postalCode = onRemoveMask(
      getValues('address.postalCode') ?? ''
    );
    finalData.address.street = getValues('address.street') ?? '';
    finalData.address.number = getValues('address.number') ?? '';
    finalData.address.district = getValues('address.district') ?? '';
    finalData.address.city = getValues('address.city') ?? '';
    finalData.address.state = getValues('address.state') ?? '';
    finalData.address.block = getValues('address.block') ?? '';
    finalData.address.lot = getValues('address.lot') ?? '';
  };

  const onSubmit = (): void => {
    setFinalData();
    console.log('finalData', finalData);
    console.log('mediaFile', getValues('mediaFile'));
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        id={adminUserPageId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex justify-between gap-2 bg-slate-700 text-white rounded-md w-full px-2 py-1">
          <p className="font-medium md:text-lg">Dados Cadastrais</p>
          <Controller
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </div>
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-4">
          <div className="flex flex-col gap-2 grow">
            <div className="flex flex-col md:flex-row gap-2">
              {getValues('idUser') > 0 && (
                <>
                  <Controller
                    name="idUser"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className={cn('md:shrink')}>
                        <FieldLabel
                          htmlFor={`admin-user-input-id-user-${adminUserPageId}`}
                        >
                          Id
                        </FieldLabel>
                        <Input
                          {...field}
                          disabled={formState.isSubmitting || !isActive}
                          readOnly
                          id={`admin-user-input-id-user-${adminUserPageId}`}
                        />
                      </Field>
                    )}
                  />
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
              )}
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
                          variant="outline"
                          id={`admin-user-button-birth-date-${adminUserPageId}`}
                          disabled={formState.isSubmitting || !isActive}
                          className={cn(`w-48 justify-between font-normal`)}
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
                      disabled={formState.isSubmitting || !isActive}
                      autoComplete="email"
                      id={`admin-user-input-email-${adminUserPageId}`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="md:grow-[4]">
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
        <div className="flex justify-between bg-slate-700 text-white rounded-md w-full px-2 py-1">
          <p className="font-medium md:text-lg">Endereço</p>
        </div>
        <div className="flex flex-col gap-2 grow">
          <div className="flex flex-col md:flex-row gap-2">
            {(getValues('address.idAddress') ?? 0) > 0 && (
              <Controller
                name="address.idAddress"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className={cn('md:shrink')}>
                    <FieldLabel
                      htmlFor={`admin-user-input-id-address-${adminUserPageId}`}
                    >
                      Id
                    </FieldLabel>
                    <Input
                      {...field}
                      disabled={formState.isSubmitting || !isActive}
                      readOnly
                      id={`admin-user-input-id-address-${adminUserPageId}`}
                    />
                  </Field>
                )}
              />
            )}

            <Controller
              name="address.postalCode"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="relative">
                  <FieldLabel
                    htmlFor={`admin-user-input-postal-code-${adminUserPageId}`}
                  >
                    Cep
                  </FieldLabel>
                  <div className="relative">
                    <IMaskInput
                      mask="00000-000"
                      definitions={{ '0': /[0-9]/ }}
                      value={field.value ?? ''}
                      onAccept={(value) => field.onChange(value)}
                      onBlur={() => {
                        field.onBlur();
                        onSetAddressViaCEPValues();
                      }}
                      disabled={formState.isSubmitting || !isActive}
                      id={`admin-user-input-postal-code-${adminUserPageId}`}
                      autoComplete="postal-code"
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        fieldState.invalid && 'border-destructive'
                      )}
                    />

                    {isInputPostalCodeLoading && (
                      <span className="pointer-events-none absolute top-3 right-3 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground font-extrabold" />
                      </span>
                    )}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
            <Controller
              name="address.street"
              control={control}
              render={({ field, fieldState }) => (
                <Field className={'md:grow-[4]'}>
                  <FieldLabel
                    htmlFor={`admin-user-input-street-${adminUserPageId}`}
                  >
                    Logradouro
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={formState.isSubmitting || !isActive}
                    id={`admin-user-input-street-${adminUserPageId}`}
                    value={field.value || ''}
                  />
                </Field>
              )}
            />
            <Controller
              name="address.number"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor={`admin-user-input-number-${adminUserPageId}`}
                  >
                    Número
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={formState.isSubmitting || !isActive}
                    value={field.value || ''}
                    id={`admin-user-input-number-${adminUserPageId}`}
                  />
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-col gap-1 grow">
              <Controller
                name="address.blockType"
                control={control}
                render={({ field, fieldState }) => (
                  <span className="text-sm font-medium">
                    {field.value || ''}:{' '}
                  </span>
                )}
              />
              <Controller
                name="address.block"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Input
                      {...field}
                      disabled={formState.isSubmitting || !isActive}
                      value={field.value || ''}
                      id={`admin-user-input-block-${adminUserPageId}`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="flex flex-col gap-1 grow">
              <Controller
                name="address.lotType"
                control={control}
                render={({ field, fieldState }) => (
                  <span className="text-sm font-medium">
                    {field.value || ''}:{' '}
                  </span>
                )}
              />
              <Controller
                name="address.lot"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Input
                      {...field}
                      disabled={formState.isSubmitting || !isActive}
                      value={field.value || ''}
                      id={`admin-user-input-lot-${adminUserPageId}`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="address.district"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grow-[2]">
                  <FieldLabel
                    htmlFor={`admin-user-input-district-${adminUserPageId}`}
                  >
                    Bairro
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={formState.isSubmitting || !isActive}
                    id={`admin-user-input-district-${adminUserPageId}`}
                    value={field.value || ''}
                  />
                </Field>
              )}
            />
            <Controller
              name="address.city"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grow-[2]">
                  <FieldLabel
                    htmlFor={`admin-user-input-city-${adminUserPageId}`}
                  >
                    Cidade
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={formState.isSubmitting || !isActive}
                    id={`admin-user-input-city-${adminUserPageId}`}
                    value={field.value || ''}
                  />
                </Field>
              )}
            />
            <Controller
              name="address.state"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="grow">
                  <FieldLabel
                    htmlFor={`admin-user-input-state-${adminUserPageId}`}
                  >
                    UF
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={formState.isSubmitting || !isActive}
                    id={`admin-user-input-state-${adminUserPageId}`}
                    value={field.value || ''}
                  />
                </Field>
              )}
            />
          </div>
        </div>
        <div className="flex justify-between bg-slate-700 text-white rounded-md w-full px-2 py-1">
          <p className="font-medium md:text-lg">Ações</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {!getValues('isEmailConfirmed') && (
            <Button
              onClick={onSendSignUpEmail}
              variant={'outline'}
              className="w-full sm:w-auto"
              disabled={formState.isSubmitting || !isActive}
            >
              Enviar e-mail de cadastro
            </Button>
          )}
          <Button
            onClick={onShowAskDialogForDeleteProfile}
            variant={'destructive'}
            className="w-full sm:w-auto"
            disabled={formState.isSubmitting || !isActive}
          >
            Excluir
          </Button>
          <Button
            type="submit"
            variant={'default'}
            className="w-full sm:w-auto"
            disabled={formState.isSubmitting}
          >
            Salvar
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
    </div>
  );
}
