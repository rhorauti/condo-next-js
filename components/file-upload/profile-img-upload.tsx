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

type ImageUploadProps<T extends FieldValues> = {
  control: Control<T>;
  fileName: FieldPath<T>;
  setValue: UseFormSetValue<T>;
  urlName: FieldPath<T>;
};

export function ProfileImgUpload<T extends FieldValues>({
  control,
  fileName,
  urlName,
  setValue,
}: ImageUploadProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const file = useWatch({ control, name: fileName });
  const urlObj = useWatch({ control, name: urlName }) as any;
  const url = urlObj?.mediaUrl;

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }

    if (!file && typeof url == 'string' && url) {
      setPreview(url);
      console.log('url', url);
    }

    if (!file && !url) {
      setPreview(null);
    }
  }, [file, url]);

  return (
    <div className="flex items-center flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (!selected) return;
          setValue(fileName, selected as any, {
            shouldDirty: true,
          });
          setValue(urlName, null as any);
          e.target.value = '';
        }}
      />

      {!preview && (
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-[8rem] h-[8rem] md:w-[9rem] md:h-[9rem] bg-transparent hover:bg-gray-100 hover:dark:bg-gray-900 text-foreground border border-border"
        >
          Upload da foto
        </Button>
      )}

      {preview && (
        <div className="relative flex justify-center">
          <Avatar
            className={cn(
              'border border-gray-400 w-[8rem] h-[8rem] md:w-[9rem] md:h-[9rem] font-semibold'
            )}
          >
            <AvatarImage src={preview} className={cn('mx-auto')} />
          </Avatar>
          <Button
            variant={'destructive'}
            type="button"
            onClick={() => {
              setValue(fileName, null as any);
              setValue(urlName, null as any);
            }}
            className="absolute h-6 w-6 -top-1 -right-1 p-1 rounded-full"
          >
            <X className="text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
