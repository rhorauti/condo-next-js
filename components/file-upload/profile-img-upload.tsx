'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { IMedia } from '@/interfaces/admin/media.interface';

type ImageUploadProps<T extends FieldValues> = {
  control: Control<T>;
  fileName: FieldPath<T>;
  setValue: UseFormSetValue<T>;
  mediaObject: FieldPath<T>;
  isDisabled?: boolean;
};

export function ProfileImgUpload<T extends FieldValues>({
  control,
  fileName,
  mediaObject,
  setValue,
  isDisabled = false,
}: ImageUploadProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const file = useWatch({ control, name: fileName });
  const urlObj = useWatch({ control, name: mediaObject }) as IMedia | null;
  const url = urlObj?.mediaUrl ?? null;

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const imageUrl = URL.createObjectURL(file as File);
      setPreview(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }

    if (!file && typeof url == 'string' && url) {
      setPreview(url);
    }

    if (!file && !url) {
      setPreview(null);
    }
  }, [file, urlObj]);

  return (
    <div className="flex items-center flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        disabled={isDisabled}
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (!selected) return;
          setValue(fileName, selected as any, {
            shouldDirty: true,
          });
          setValue(mediaObject, null as any);
          e.target.value = '';
        }}
      />

      {!preview && (
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-[8rem] h-[8rem] md:w-[9rem] md:h-[9rem] bg-transparent border border-border',
            isDisabled
              ? 'text-gray-400 cursor-default hover:bg-transparent'
              : 'text-foreground hover:bg-gray-100 hover:dark:bg-gray-900'
          )}
        >
          Upload da foto
        </Button>
      )}

      {preview && (
        <div className="relative flex justify-center">
          <Avatar
            className={cn(
              'border border-gray-400 w-[8rem] h-[8rem] md:w-[9rem] md:h-[9rem] font-semibold',
              isDisabled ? 'opacity-60' : ''
            )}
          >
            <AvatarImage src={preview} className={cn('mx-auto')} />
          </Avatar>
          {!isDisabled && (
            <Button
              variant={'destructive'}
              type="button"
              onClick={() => {
                setPreview(null);
                setValue(fileName, null as any, { shouldDirty: true });
                setValue(mediaObject, null as any, {
                  shouldDirty: true,
                });
              }}
              className={cn(
                'absolute h-6 w-6 -top-1 -right-1 p-1 rounded-full',
                isDisabled ? 'opacity-60' : ''
              )}
            >
              <X className={cn('text-white')} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
