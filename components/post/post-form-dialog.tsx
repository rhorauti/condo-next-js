'use client';

import { useId, useRef, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { IPost } from '@/interfaces/post.interface';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ImageIcon, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { cn } from '@/lib/utils';

interface IProps {
  showDialog: boolean;
  postInfo?: IPost;
  onCloseDialog: () => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const postSchema = z
  .object({
    description: z.string().optional(),
    media: z
      .array(z.instanceof(File))
      .refine(
        (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
        `Cada arquivo só pode ter até no máximo ${Math.ceil(MAX_FILE_SIZE / (1024 * 1024))}Mb.`
      )
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        'São permitidos somente arquivos no formato .jpg, .png, and .webp.'
      )
      .optional(),
  })
  .refine(
    (data) => {
      const hasText = data.description && data.description.trim().length > 0;
      const hasFile = data.media && data.media.length > 0;
      return hasText || hasFile;
    },
    {
      message: 'Escreva um comentário ou adicione uma mídia',
      path: ['description'],
    }
  );

type PostFormValues = z.infer<typeof postSchema>;

export function PostFormDialog({
  showDialog,
  postInfo,
  onCloseDialog,
}: IProps) {
  const formId = useId();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const initialPostData = {
    idPost: 0,
    type: 0,
    profileFallback: '',
    profileUrl: '',
    name: '',
    description: '',
    mediaList: null,
    createdAt: new Date(),
    likesQty: 0,
    isLiked: false,
    isSaved: false,
  };

  const [postData, setPostData] = useState<IPost>(postInfo ?? initialPostData);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      description: '',
      media: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    setPostData(postInfo ?? initialPostData);
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const onHandleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const combinedFiles = [...selectedFiles, ...newFiles];

      setSelectedFiles(combinedFiles);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);

      setValue('media', combinedFiles, { shouldValidate: true });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);

    const updatedFiles = selectedFiles.filter((_, i) => i !== indexToRemove);
    const updatedPreviews = previewUrls.filter((_, i) => i !== indexToRemove);

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    setValue('media', updatedFiles, { shouldValidate: true });
  };

  const onSubmit = async (data: PostFormValues) => {
    const formData = new FormData();
    formData.append('description', data.description || '');

    if (data.media) {
      data.media.forEach((file) => {
        formData.append('files', file);
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success('Post criado com sucesso!');

    onHandleClose();
  };

  const onHandleClose = () => {
    form.reset();
    setSelectedFiles([]);
    setPreviewUrls([]);
    onCloseDialog();
  };

  return (
    <Dialog open={showDialog} onOpenChange={onHandleClose}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[43rem] p-0 gap-0 overflow-hidden bg-transparent border-none shadow-none"
      >
        <Card className="w-full shadow-md border-border/60">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle>
                {postInfo ? 'Editar Post' : 'Criar Post'}
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          <CardHeader className="pb-3 px-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 cursor-pointer hover:opacity-90 transition">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold leading-none">
                  {postData.name}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-2 px-6">
            <form
              id={`form-${formId}`}
              onSubmit={handleSubmit(onSubmit)}
              className={cn('flex flex-col gap-2')}
            >
              <Textarea
                {...register('description')}
                placeholder="O que você está pensando?"
                className={cn(
                  'min-h-[80px] text-lg border-none focus-visible:ring-0 resize-none px-1 py-1 placeholder:text-muted-foreground/70'
                )}
              />

              {previewUrls.length > 0 && (
                <div className="rounded-md border mt-2 p-4">
                  <Carousel
                    setApi={setApi}
                    opts={{
                      align: 'start',
                      slidesToScroll: 1,
                    }}
                    className="w-full max-w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {previewUrls.map((url, index) => (
                        <CarouselItem
                          key={index}
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
                    {previewUrls.length > 3 && (
                      <>
                        <CarouselPrevious
                          type="button"
                          className={cn('left-1')}
                        />
                        <CarouselNext type="button" className={cn('right-1')} />
                      </>
                    )}
                  </Carousel>
                  {previewUrls.length > 1 && (
                    <div className="md:hidden flex justify-center gap-2 pt-4">
                      {previewUrls.map((_, index) => (
                        <button
                          type="button"
                          key={index}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === current - 1
                              ? 'bg-primary w-6'
                              : 'bg-muted-foreground/50'
                          }`}
                          onClick={() => api?.scrollTo(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={(e) => {
                  register('media');
                  fileInputRef.current = e;
                }}
                onChange={onHandleFileChange}
              />

              {errors.description && (
                <p className="text-destructive text-sm mt-2">
                  {errors.description.message}
                </p>
              )}
              {errors.media && (
                <p className="text-destructive text-sm">
                  {errors.media.message as string}
                </p>
              )}
            </form>

            <div className="border rounded-lg p-3 mt-4 flex items-center justify-between shadow-sm">
              <span className="text-sm font-semibold text-muted-foreground cursor-default">
                Adicione fotos/vídeos
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 px-6 pb-6">
            <Button
              type="submit"
              form={`form-${formId}`}
              className="w-full font-semibold"
              disabled={
                isSubmitting ||
                (!watch('description') && selectedFiles.length === 0)
              }
            >
              {isSubmitting ? 'Postando...' : 'Postar'}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
