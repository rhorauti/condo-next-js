'use client';

import { useId, useRef, useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { IPost } from '@/interfaces/post.interface';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { POST_TYPE, translatePostToString } from '@/enum/post.enum';
import useAuthStore from '@/store/auth.store';

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
    postType: z.string().nonempty('Selecione um tipo de postagem'),
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
      message: 'Escreva um comentário',
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
  const [postTypeList, setPostTypeList] = useState<string[]>([]);
  const authStore = useAuthStore((state) => state);

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

  const fallbackName = useMemo(() => {
    authStore.setFallbackName();
    return authStore.credential.fallbackName;
  }, [authStore.credential.name]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      description: '',
      postType: '',
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

  const description = watch('description');
  const postType = watch('postType');

  useEffect(() => {
    setPostData(postInfo ?? initialPostData);
  }, [postInfo]);

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
    authStore.setFallbackName();
    setPostTypeList(setPostTypeStringList());
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const setPostTypeStringList = (): string[] => {
    const numberList = Object.values(POST_TYPE).filter(
      (v): v is POST_TYPE => typeof v === 'number'
    );
    return numberList.map((number) => translatePostToString(number));
  };

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
    console.log('submit', data);
    // const formData = new FormData();
    // formData.append('description', data.description || '');
    // formData.append('postType', data.postType || '');

    // if (data.media) {
    //   data.media.forEach((file) => {
    //     formData.append('files', file);
    //   });
    // }

    // toast.success('Post criado com sucesso!');

    // onHandleClose();
  };

  const onHandleClose = (): void => {
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
          <DialogHeader className="px-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <DialogTitle>
                  {postInfo?.idPost || 0 > 0 ? 'Editar Post' : 'Criar Post'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Compartilhe um texto e/ou mídias com seus seguidores.
                </DialogDescription>
              </div>
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
              <Avatar className="h-10 w-10 cursor-pointer hover:opacity-90 transition border border-gray-400 font-semibold">
                <AvatarImage src={authStore.credential.photoUrl} />
                <AvatarFallback>{fallbackName}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold leading-none">
                  {authStore.credential.name}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-2 px-6">
            <form
              id={`form-${formId}`}
              onSubmit={handleSubmit(onSubmit)}
              className={cn('flex flex-col gap-3')}
            >
              <Textarea
                {...register('description')}
                placeholder="O que você está pensando?"
                className={cn(
                  'min-h-[80px] text-lg focus-visible:ring-0 resize-y px-2 py-1 placeholder:text-muted-foreground/70'
                )}
              />

              {errors.description && (
                <p className="text-destructive text-sm">
                  {errors.description.message}
                </p>
              )}

              <Controller
                control={form.control}
                name="postType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um tipo de postagem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {postTypeList.map((postType, index) => (
                          <SelectItem key={index} value={postType}>
                            {postType}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.postType && (
                <p className="text-destructive text-sm">
                  {errors.postType.message}
                </p>
              )}

              {previewUrls.length > 0 && (
                <div className="rounded-md border p-4">
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

              {errors.media && (
                <p className="text-destructive text-sm">
                  {errors.media.message as string}
                </p>
              )}

              <div className="border rounded-lg p-3 flex items-center justify-between shadow-sm">
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
            </form>
          </CardContent>

          <CardFooter className="pt-2 px-6 pb-6">
            <Button
              type="submit"
              form={`form-${formId}`}
              className="w-full font-semibold"
              disabled={
                isSubmitting || !description?.trim() || !postType?.trim()
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
