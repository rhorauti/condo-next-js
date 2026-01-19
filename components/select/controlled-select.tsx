'use client';

import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPath,
} from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '../ui/select';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type ControlledSelectProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  options: string[];
  placeholder?: string;
  label?: string;
  className?: string;
};

export function ControlledSelect<TFieldValues extends FieldValues>({
  name,
  control,
  options,
  placeholder = 'Selecione uma opção',
  label,
  className,
}: ControlledSelectProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          {label && (
            <label className="text-sm font-medium" htmlFor={name}>
              {label}
            </label>
          )}

          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              className={cn(
                'focus-visible:shadow-none w-full dark:border-white',
                fieldState.invalid && 'border-destructive',
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((opt, index) => (
                  <SelectItem key={index} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {fieldState.error && (
            <p className="text-destructive text-sm">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
