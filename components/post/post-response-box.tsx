'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/components/ui/emoji-picker';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { SendHorizontal, Smile, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/web/auth.store';
import { buildWebDinamicRoute, WEB_ROUTES } from '@/enum/web/routes.enum';

interface IProps {
  idPost: number;
  idParent?: number | null;
  isResponse: boolean;
  className?: string;
}

export default function PostResponseBox({
  idPost: number,
  idParent = null,
  isResponse = false,
  className,
}: IProps) {
  const [textAreaValue, setTextAreaValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();
  const authStore = useAuthStore((state) => state);
  const pageId = useId();

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
  }, [textAreaValue]);

  const onSubmitComment = (): void => {};

  return (
    <div className={cn('flex gap-2 w-full bg-background', className)}>
      <Avatar
        onClick={() =>
          router.push(
            buildWebDinamicRoute(
              WEB_ROUTES.PROFILES,
              authStore.credential.idUser
            )
          )
        }
        className="h-8 w-8 rounded-full cursor-pointer"
      >
        <AvatarImage src={authStore.credential.photoUrl} alt="Profile Image" />
        <AvatarFallback className="rounded-lg">
          {authStore.credential.fallbackName}
        </AvatarFallback>
      </Avatar>
      <form onSubmit={onSubmitComment} className="flex flex-col w-full">
        <Textarea
          id={pageId}
          ref={textareaRef}
          className={cn(
            'min-h-[0px] focus-visible:ring-0 dark:border-white focus-visible:ring-transparent resize-none bg-transparent text-sm overflow-hidden border-b-0 rounded-t-lg rounded-b-none'
          )}
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          rows={1}
          placeholder={
            isResponse ? 'Responda o comentário ' : 'Escreva um novo comentário'
          }
        />

        <div className="flex flex-none justify-between dark:border-white border-x border-b rounded-b-lg items-center gap-1 pb-1 px-1 w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="start"
              sideOffset={8}
              className={cn('p-0 min-w-[8rem] max-h-[14rem]')}
            >
              <EmojiPicker
                className={cn('p-0 min-w-[8rem] max-h-[14rem]')}
                onEmojiSelect={({ emoji }) =>
                  setTextAreaValue((prev) => prev + emoji)
                }
              >
                <EmojiPickerContent />
              </EmojiPicker>
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant={'ghost'}
            size="sm"
            disabled={!textAreaValue.trim()}
            className={cn('shrink-0 text-primary')}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
