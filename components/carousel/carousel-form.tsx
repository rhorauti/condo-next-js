'use client';

import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPath,
} from 'react-hook-form';
import { useEffect, useId, useRef, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Button } from '../ui/button';
import { ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  initialUrls?: string[];
  showDots?: boolean;
  showArrows?: boolean;
};

export function CarouselForm<TFieldValues extends FieldValues>({
  name,
  control,
  initialUrls = [],
  showArrows = true,
  showDots = true,
}: Props<TFieldValues>) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const carouselId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [backendUrls, setBackendUrls] = useState<string[]>(initialUrls);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const files = (field.value as File[] | undefined) ?? [];
        objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        const fileUrls = files.map((file) => {
          const url = URL.createObjectURL(file);
          objectUrlsRef.current.push(url);
          return url;
        });

        const previewUrls = [...backendUrls, ...fileUrls];
        const hasImages = previewUrls.length > 0;

        const handleAddFiles: React.ChangeEventHandler<HTMLInputElement> = (
          e
        ) => {
          const selected = e.target.files ? Array.from(e.target.files) : [];
          if (selected.length === 0) return;
          field.onChange([...files, ...selected]);
          e.target.value = '';
        };

        const removeImage = (indexToRemove: number) => {
          if (indexToRemove < backendUrls.length) {
            setBackendUrls((prev) =>
              prev.filter((_, idx) => idx !== indexToRemove)
            );
            return;
          }
          const fileIndex = indexToRemove - backendUrls.length;
          const updatedFiles = files.filter((_, idx) => idx !== fileIndex);
          field.onChange(updatedFiles);
        };

        return (
          <div className="flex flex-col gap-2">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAddFiles}
            />

            <div className="border rounded-lg p-3 flex items-center justify-between shadow-sm dark:border-white">
              <span className="text-sm font-semibold text-secondary-foreground cursor-default">
                Adicione fotos/vídeos
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:bg-blue-800 hover:text-white"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {hasImages && (
              <div className="rounded-md border p-4 dark:border-white">
                <Carousel
                  setApi={setApi}
                  opts={{ align: 'start', slidesToScroll: 1 }}
                  className="w-full max-w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {previewUrls.map((url, index) => (
                      <CarouselItem
                        key={`${carouselId}-${index}`}
                        className="pl-2 md:pl-4 basis-full md:basis-1/3 relative"
                      >
                        <img
                          src={url}
                          alt="Image Post"
                          className="object-cover w-full aspect-square rounded-md"
                        />
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {previewUrls.length > 3 && showArrows && (
                    <>
                      <CarouselPrevious
                        type="button"
                        className={cn('left-1')}
                      />
                      <CarouselNext type="button" className={cn('right-1')} />
                    </>
                  )}
                </Carousel>

                {previewUrls.length > 1 && showDots && (
                  <div className="md:hidden flex justify-center gap-2 pt-4">
                    {previewUrls.map((_, index) => (
                      <button
                        type="button"
                        key={index}
                        className={cn(
                          'h-2 w-2 rounded-full transition-all',
                          index === current - 1
                            ? 'bg-primary w-6'
                            : 'bg-muted-foreground/50'
                        )}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {fieldState.error && (
              <p className="text-destructive text-sm">
                {fieldState.error.message as string}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
