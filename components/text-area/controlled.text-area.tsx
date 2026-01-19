'use client';

import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type ControlledTextareaProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder: string;
  label?: string;
} & React.ComponentProps<typeof Textarea>;

export default function ControlledTextArea<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  ...textareaProps
}: ControlledTextareaProps<TFieldValues>) {
  const [textAreaValue, setTextAreaValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
  }, [textAreaValue]);

  const textAreaId = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          {label && (
            <label
              htmlFor={`text-area-${textAreaId}`}
              className="text-sm font-medium"
            >
              {label}
            </label>
          )}

          <Textarea
            {...field}
            {...textareaProps}
            id={`text-area-${textAreaId}`}
            ref={textareaRef}
            className={cn(
              'min-h-[0px] focus-visible:ring-0 dark:border-white focus-visible:ring-transparent resize-none bg-transparent text-sm overflow-hidden rounded-lg',
              fieldState.error && 'border-destructive'
            )}
            value={textAreaValue}
            onChange={(e) => {
              setTextAreaValue(e.target.value);
              field.onChange(e);
            }}
            placeholder={placeholder}
            rows={1}
          />

          {fieldState.error && (
            <span className="text-xs text-destructive">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
