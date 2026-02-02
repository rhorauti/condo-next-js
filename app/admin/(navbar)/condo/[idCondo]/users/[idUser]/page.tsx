'use client';

import { onGetAdminUserInfo } from '@/http/admin/auth/users-admin.http';
import { IAdminUserDetail } from '@/interfaces/admin/users.interface';
import { IFetchResponse } from '@/interfaces/response.interface';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { userDetailsMock } from './user-mock';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ArrowLeftCircle, ChevronDownIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatDateTime } from '@/utils/misc';

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const adminUserSchema = z.object({
  idUser: z.number().optional(),
  createdAt: z.date(),
  name: z.string().nonempty(),
  birthDate: z
    .date('Data inválida.')
    .max(eighteenYearsAgo, { message: 'Você deve ter pelo menos 18 anos.' }),
  email: z
    .email('Formato de e-mail inválido.')
    .nonempty('O email é obrigatório.'),
  phone: z.string().nonempty(),
  photoUrl: z.string(),
  isActive: z.boolean(),
  isEmailConfirmed: z.boolean(),
  accessLevel: z.number(),
  address: {
    idAddress: z.number(),
    type: z.string(),
    street: z.string(),
    number: z.string(),
    city: z.string(),
    state: z.string(),
    blockType: z.string(),
    block: z.string(),
    lotType: z.string(),
    lot: z.string(),
  },
});

export type AdminUserSchema = z.infer<typeof adminUserSchema>;

export default function Page() {
  const adminUserPageId = useId();
  const router = useRouter();
  const params = useParams();
  const idCondoParams = Number(params.idCondo);
  const idUserParams = Number(params.idUser);
  const [userInfo, setUserInfo] = useState<IAdminUserDetail>();
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
      photoUrl: '',
      isActive: false,
      isEmailConfirmed: false,
      accessLevel: 0,
      address: {
        idAddress: 0,
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

  const onSubmit = (): void => {};

  return (
    <div className="flex flex-col gap-4 w-[75rem]">
      <div className="flex justify-between">
        <h1 className="text-center text-2xl font-semibold">
          Cadastro de novo usuário
        </h1>
        <Button
          onClick={() => router.push(`/admin/condo/${idCondoParams}/users`)}
          variant={'default'}
          className="flex gap-2"
        >
          <ArrowLeftCircle />
          <span>Voltar</span>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="w-full bg-slate-700 rounded-md px-2 text-lg font-medium">
          Dados Cadastrais
        </p>
        <form id={adminUserPageId} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-4">
            <Controller
              name="idUser"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className={cn('md:shrink')}>
                  <FieldLabel
                    htmlFor={`admin-user-input-id-user-${adminUserPageId}`}
                  >
                    Id
                  </FieldLabel>
                  <Input
                    {...field}
                    readOnly
                    id={`admin-user-input-id-user-${adminUserPageId}`}
                  />
                </Field>
              )}
            />
            <Controller
              name="createdAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className={'md:grow'}>
                  <FieldLabel
                    htmlFor={`admin-user-input-created-at-${adminUserPageId}`}
                  >
                    Data da criação
                  </FieldLabel>
                  <Input
                    {...field}
                    readOnly
                    id={`admin-user-input-created-at-${adminUserPageId}`}
                    value={formatDateTime(field.value) ?? ''}
                  />
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className={'md:grow-[4]'}>
                  <FieldLabel
                    htmlFor={`admin-user-input-name-${adminUserPageId}`}
                  >
                    Nome
                  </FieldLabel>
                  <Input
                    {...field}
                    autoComplete="name"
                    id={`admin-user-input-name-${adminUserPageId}`}
                  />
                </Field>
              )}
            />
            <Controller
              name="birthDate"
              control={form.control}
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
                        disabled={form.formState.isSubmitting}
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
          </div>
        </form>
      </div>
    </div>
  );
}
