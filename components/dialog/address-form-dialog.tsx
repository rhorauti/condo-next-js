'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { CircleArrowLeft, Loader2, Save, Send } from 'lucide-react';
import { Input } from '../ui/input';
import { useEffect, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { IMaskInput } from 'react-imask';
import { onRemoveMask } from '@/utils/misc';
import { getAddressFromCep } from '@/http/web/third-part/third-part.http';
import { IAddressDetail } from '@/interfaces/address.interface';
import { onGetAddress, onSaveAddress } from '@/http/web/address/address.http';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const addressSchema = z.object({
  idAddress: z.number(),
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
  type: z.string().nullable(),
  street: z.string().nullable(),
  number: z.string().nullable(),
  district: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  blockType: z.string().nullable(),
  block: z.string().nullable(),
  lotType: z.string().nullable(),
  lot: z.string().nullable(),
});

const defaultValues: IAddressDetail = {
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
};

export type AddressSchema = z.infer<typeof addressSchema>;

export interface IAddressFormProps {
  isActive: boolean;
  idAddress: number;
  idUser?: number;
  idCondo?: number;
  onCloseDialog: () => void;
}

export function AddressFormDialog({
  isActive = false,
  idAddress,
  idCondo,
  idUser,
  onCloseDialog,
}: IAddressFormProps) {
  const addressFormDialogId = useId();
  const [isInputPostalCodeLoading, setIsInputPostalCodeLoading] =
    useState(false);

  const form = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues,
  });

  const typeList = ['Casa', 'Apartamento'];

  const { control, formState, setValue, getValues, reset } = form;

  const resetValues = (addressData: IAddressDetail): void => {
    reset({
      idAddress: addressData.idAddress,
      type: addressData.type,
      street: addressData.street,
      postalCode: addressData.postalCode,
      number: addressData.number,
      district: addressData.district,
      city: addressData.city,
      state: addressData.state,
      blockType: addressData.blockType ?? 'Bloco',
      block: addressData.block,
      lotType: addressData.lotType ?? 'Lote',
      lot: addressData.lot,
    });
  };

  useEffect(() => {
    if (idAddress && idAddress > 0) {
      onGetDetailedAddress(idAddress);
    }
  }, [idAddress]);

  const onGetDetailedAddress = async (idAddress: number): Promise<void> => {
    const address = await onGetAddress(idAddress);
    if (!address) return;
    resetValues(address.data ?? defaultValues);
  };

  const onSetAddressViaCEPValues = async (): Promise<void> => {
    setIsInputPostalCodeLoading(true);
    try {
      const postalCode = getValues('postalCode');
      if (!postalCode || onRemoveMask(postalCode).length != 8) {
        return;
      }
      const response = await getAddressFromCep(postalCode ?? '');
      if (response) {
        setValue('street', response.logradouro);
        setValue('district', response.bairro);
        setValue('city', response.localidade);
        setValue('state', response.uf);
      }
    } catch (error) {
      console.log('Erro ao buscar o CEP');
    } finally {
      setIsInputPostalCodeLoading(false);
    }
  };

  const onSubmit = async (address: AddressSchema): Promise<void> => {
    try {
      onSaveAddress(address);
      toast.success(`Endereço salvo com sucesso.`, {
        duration: 3000,
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      });
      resetValues(defaultValues);
      onCloseDialog();
    } catch (error: any) {
      toast.error(error.message, {
        duration: 5000,
        action: {
          label: 'Fechar',
          onClick: () => {},
        },
      });
    }
  };

  const onKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key == 'Enter') {
      onSubmit(form.getValues());
    }
  };

  return (
    <Dialog open={isActive} onOpenChange={(open) => !open && onCloseDialog()}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[60rem]"
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle className="w-full">
            <p className="font-medium md:text-lg bg-slate-700 text-white rounded-md w-full p-2">
              {' '}
              {getValues('idAddress') > 0 ? 'Editar endereço' : 'Novo Endereço'}
            </p>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2 grow">
            <div className="flex flex-col md:flex-row gap-2 items-end">
              {(getValues('idAddress') ?? 0) > 0 && (
                <Controller
                  name="idAddress"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field className={cn('md:shrink')}>
                      <FieldLabel
                        htmlFor={`admin-user-input-id-address-${addressFormDialogId}`}
                      >
                        Id
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value}
                        disabled={formState.isSubmitting || !isActive}
                        readOnly
                        id={`admin-user-input-id-address-${addressFormDialogId}`}
                      />
                    </Field>
                  )}
                />
              )}

              <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className={cn('md:grow')}>
                    <FieldLabel
                      htmlFor={`address-input-id-${addressFormDialogId}`}
                    >
                      Tipo de moradia
                    </FieldLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={`address-input-select-${addressFormDialogId}`}
                        className="text-start"
                      >
                        <SelectValue placeholder="Selecione o condominio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {typeList.map((type, index) => (
                            <SelectItem key={index} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                name="postalCode"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="relative grow">
                    <FieldLabel
                      htmlFor={`address-input-postal-code-${addressFormDialogId}`}
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
                        id={`address-input-postal-code-${addressFormDialogId}`}
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
              <div className="flex flex-col gap-1">
                <Controller
                  name="blockType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <span className="text-sm font-medium">
                      {field.value || 'Bloco'}
                    </span>
                  )}
                />
                <Controller
                  name="block"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <Input
                        {...field}
                        onKeyDown={onKeyDown}
                        value={field.value || ''}
                        disabled={formState.isSubmitting || !isActive}
                        id={`address-input-block-${addressFormDialogId}`}
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
                  name="lotType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <span className="text-sm font-medium">
                      {field.value || 'Lote'}
                    </span>
                  )}
                />
                <Controller
                  name="lot"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <Input
                        {...field}
                        onKeyDown={onKeyDown}
                        value={field.value || ''}
                        disabled={formState.isSubmitting || !isActive}
                        id={`address-input-lot-${addressFormDialogId}`}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Controller
                name="street"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className={'md:grow-[4]'}>
                    <FieldLabel
                      htmlFor={`address-input-street-${addressFormDialogId}`}
                    >
                      Logradouro
                    </FieldLabel>
                    <Input
                      {...field}
                      onKeyDown={onKeyDown}
                      value={field.value ?? ''}
                      disabled={formState.isSubmitting || !isActive}
                      id={`address-input-street-${addressFormDialogId}`}
                    />
                  </Field>
                )}
              />
              <Controller
                name="number"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      htmlFor={`address-input-number-${addressFormDialogId}`}
                    >
                      Número
                    </FieldLabel>
                    <Input
                      {...field}
                      onKeyDown={onKeyDown}
                      value={field.value || ''}
                      disabled={formState.isSubmitting || !isActive}
                      id={`address-input-number-${addressFormDialogId}`}
                    />
                  </Field>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Controller
                name="district"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="grow-[2]">
                    <FieldLabel
                      htmlFor={`address-input-district-${addressFormDialogId}`}
                    >
                      Bairro
                    </FieldLabel>
                    <Input
                      {...field}
                      onKeyDown={onKeyDown}
                      value={field.value || ''}
                      disabled={formState.isSubmitting || !isActive}
                      id={`address-input-district-${addressFormDialogId}`}
                    />
                  </Field>
                )}
              />
              <Controller
                name="city"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="grow-[2]">
                    <FieldLabel
                      htmlFor={`address-input-city-${addressFormDialogId}`}
                    >
                      Cidade
                    </FieldLabel>
                    <Input
                      {...field}
                      onKeyDown={onKeyDown}
                      value={field.value || ''}
                      disabled={formState.isSubmitting || !isActive}
                      id={`address-input-city-${addressFormDialogId}`}
                    />
                  </Field>
                )}
              />
              <Controller
                name="state"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="grow">
                    <FieldLabel
                      htmlFor={`address-input-state-${addressFormDialogId}`}
                    >
                      UF
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ''}
                      disabled={formState.isSubmitting || !isActive}
                      id={`address-input-state-${addressFormDialogId}`}
                    />
                  </Field>
                )}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button
              onClick={onCloseDialog}
              type="button"
              variant="outline"
              disabled={formState.isSubmitting}
            >
              <CircleArrowLeft />
              <span>Fechar</span>
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="animate-spin mr-2">⏳</span>
              ) : (
                <Save />
              )}
              <span>
                {form.formState.isSubmitting ? 'Enviando...' : 'Salvar'}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
