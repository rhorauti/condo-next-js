'use client';

import { useId, useState, useEffect, useMemo } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { POST_TYPE, translatePostToString } from '@/enum/post.enum';
import useAuthStore from '@/store/auth.store';
import ControlledTextArea from '../text-area/controlled.text-area';
import { ControlledSelect } from '../select/controlled-select';
import { CarouselForm } from '../carousel/carousel-form';

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
        'São permitidos somente arquivos no formato .jpg, .png, e .webp.'
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
  const [postTypeList, setPostTypeList] = useState<string[]>([]);
  const authStore = useAuthStore((state) => state);

  const fallbackName = useMemo(() => {
    authStore.onSetFallbackName();
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
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;

  const description = watch('description');
  const postType = watch('postType');

  useEffect(() => {
    authStore.onSetFallbackName();
    setPostTypeList(setPostTypeStringList());
  }, []);

  const setPostTypeStringList = (): string[] => {
    const numberList = Object.values(POST_TYPE).filter(
      (v): v is POST_TYPE => typeof v === 'number'
    );
    return numberList.map((number) => translatePostToString(number));
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
    onCloseDialog();
  };

  return (
    <Dialog open={showDialog} onOpenChange={onHandleClose}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="bg-transparent border-none shadow-none"
      >
        <Card className="w-full border-borde max-h-[80vh] overflow-auto">
          <DialogHeader className="px-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <DialogTitle className={cn('text-start')}>
                  {postInfo?.idPost || 0 > 0 ? 'Editar Post' : 'Criar Post'}
                </DialogTitle>
                <DialogDescription
                  className={cn('text-sm text-start text-secondary-foreground')}
                ></DialogDescription>
              </div>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className={cn('h-6 w-6 rounded-full')}
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
              <ControlledTextArea
                control={form.control}
                name="description"
                placeholder="O que você está pensando?"
              />
              <ControlledSelect<PostFormValues>
                name="postType"
                control={form.control}
                options={postTypeList}
                placeholder="Selecione um tipo de postagem"
              />
              <CarouselForm name="media" control={form.control} />
            </form>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center pt-2 px-auto pb-6">
            <Button
              onClick={onCloseDialog}
              variant={'outline'}
              type="button"
              form={`post-form-close-btn-${formId}`}
              className="w-full sm:w-[6rem] font-semibold"
            >
              Fechar
            </Button>

            <Button
              type="submit"
              form={`form-${formId}`}
              className="w-full sm:w-[6rem] font-semibold"
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
