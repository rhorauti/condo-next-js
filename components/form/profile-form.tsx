'use client';

import { onGetAdminUserInfo } from '@/http/admin/auth/users-admin.http';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatDateTime } from '@/utils/misc';
import { Switch } from '@/components/ui/switch';
import { InputMask, format } from '@react-input/mask';
import { ProfileImgUpload } from '@/components/file-upload/profile-img-upload';
import { IUserDetail } from '@/interfaces/user.interface';

interface ProfileProps {
  userData?: IUserDetail;
}

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const adminUserSchema = z.object({
  idUser: z.number().optional(),
  createdAt: z.date().optional(),
  name: z.string().nonempty(),
  birthDate: z
    .date('Data inválida.')
    .max(eighteenYearsAgo, { message: 'Você deve ter pelo menos 18 anos.' }),
  email: z
    .email('Formato de e-mail inválido.')
    .nonempty('O email é obrigatório.'),
  phone: z
    .string()
    .min(10, 'Número de telefone inválido')
    .refine((v) => v.replace(/\D/g, '').length >= 10, {
      message: 'Número de telefone incompleto.',
    }),
  mediaFile: z.instanceof(File).optional().nullable(),
  mediaUrl: z
    .object({
      idMedia: z.number().optional().nullable(),
      mediaUrl: z.string,
    })
    .nullable(),
  photoFile: z.any().optional(),
  isActive: z.boolean(),
  isEmailConfirmed: z.boolean(),
  accessLevel: z.number(),
  address: z.object({
    idAddress: z.number().optional(),
    postalCode: z.string().optional(),
    type: z.string().nullable(),
    street: z.string().nullable(),
    number: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    blockType: z.string().nullable(),
    block: z.string().nullable(),
    lotType: z.string().nullable(),
    lot: z.string().nullable(),
  }),
});

export type AdminUserSchema = z.infer<typeof adminUserSchema>;

export default function ProfileForm({ userData }: ProfileProps) {
  const adminUserPageId = useId();
  const [open, setOpen] = useState(false);
  const form = useForm<AdminUserSchema>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      idUser: 0,
      createdAt: new Date('2026-01-26'),
      name: '',
      birthDate: new Date('1984-02-28'),
      email: '',
      phone: '',
      mediaUrl: null,
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
        city: '',
        state: '',
        blockType: '',
        block: '',
        lotType: '',
        lot: '',
      },
    },
  });

  const { reset, setValue, control, formState, watch } = form;
  const isActive = watch('isActive');

  useEffect(() => {
    if (!userData) return;

    const maskOptions = {
      mask: '+__ (__) _____-____',
      replacement: { _: /\d/ },
    };

    reset({
      idUser: userData.idUser,
      createdAt: new Date(userData.createdAt),
      name: userData.name,
      birthDate: new Date(userData.birthDate),
      email: userData.email,
      phone: format(userData.phone ?? '', maskOptions),
      mediaUrl: userData.media ?? null,
      mediaFile: null,
      photoFile: null,
      isActive: userData.isActive,
      isEmailConfirmed: userData.isEmailConfirmed,
      accessLevel: userData.accessLevel,
      address: {
        idAddress: userData.address.idAddress,
        type: userData.address.type,
        street: userData.address.street,
        number: userData.address.number,
        city: userData.address.city,
        state: userData.address.state,
        blockType: userData.address.blockType,
        block: userData.address.block,
        lotType: userData.address.lotType,
        lot: userData.address.lot,
      },
    });
  }, [userData, reset]);

  const onSubmit = (): void => {};

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
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field className="md:grow-[4]">
                    <FieldLabel
                      htmlFor={`admin-user-input-phone-${adminUserPageId}`}
                    >
                      Telefone
                    </FieldLabel>

                    <InputMask
                      mask="+__ (__) _____-____"
                      replacement={{ _: /\d/ }}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={formState.isSubmitting || !isActive}
                      component={Input}
                      id={`admin-user-input-phone-${adminUserPageId}`}
                      autoComplete="tel"
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
            urlName="mediaUrl"
          />
        </div>
        <div className="flex justify-between bg-slate-700 text-white rounded-md w-full px-2 py-1">
          <p className="font-medium md:text-lg">Endereço</p>
        </div>
        <div className="flex flex-col gap-2 grow">
          <div className="flex flex-col md:flex-row gap-2">
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
            <Controller
              name="address.postalCode"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor={`admin-user-input-postal-code-${adminUserPageId}`}
                  >
                    Cep
                  </FieldLabel>
                  <InputMask
                    mask="_____-___"
                    replacement={{ _: /\d/ }}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={formState.isSubmitting || !isActive}
                    component={Input}
                    id={`admin-user-input-postal-code-${adminUserPageId}`}
                    autoComplete="postalCode"
                  />
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
                    Endereço
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
          <Button variant={'destructive'} className="w-full sm:w-auto">
            Excluir
          </Button>
          <Button variant={'outline'} className="w-full sm:w-auto">
            Enviar e-mail de cadastro
          </Button>
          <Button variant={'default'} className="w-full sm:w-auto">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
