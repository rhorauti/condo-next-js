'use client';

import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import {
  BookmarkIcon,
  Ellipsis,
  HeartIcon,
  MessageCircle,
  Pencil,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { IPost, IPostComment } from '@/interfaces/post.interface';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PostCommentsDialog } from './post-comments-dialog';
import { onGetPostComments } from '@/http/auth/posts.http';
import useAuthStore from '@/store/auth.store';
import PostDescription from './post-description';
import { PostTime } from './post-time';

interface IProps {
  postInfo: IPost;
  onShowPostDialog?: () => void;
  onDeletePost?: () => void;
}

export default function Post({
  postInfo,
  onShowPostDialog,
  onDeletePost,
}: IProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isCommentDialogActive, setIsCommentDialogActive] = useState(false);
  const [comments, setComments] = useState<IPostComment[]>();
  const authStore = useAuthStore((state) => state);

  useEffect(() => {
    authStore.onSetFallbackName();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const mediaList = useMemo(() => {
    if (postInfo.mediaList == null) return [];
    else if (Array.isArray(postInfo.mediaList)) return postInfo.mediaList;
    else return [postInfo.mediaList];
  }, [postInfo.mediaList]);

  const onToggleHeartButton = () => {};

  const onToggleSaveButton = () => {};

  const onShowProfile = () => {};

  const onShowCommentsDialog = async (
    comments: IPostComment[]
  ): Promise<void> => {
    setComments(comments);
    setIsCommentDialogActive(true);
  };

  return (
    <article className="flex flex-col items-center gap-2 max-w-[32.5rem] w-full justify-start border border-gray-400 rounded-md p-4">
      <header className="flex gap-3 w-full">
        <Avatar
          onClick={onShowProfile}
          className="h-12 w-12 rounded-full cursor-pointer"
        >
          <AvatarImage src={postInfo.profileUrl} alt="Profile Image" />
          <AvatarFallback className="rounded-lg">
            {authStore.credential.fallbackName}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap sm:gap-4 gap-2 pr-4">
              <span
                onClick={onShowProfile}
                className="font-semibold cursor-pointer hover:underline"
              >
                {postInfo.name}
              </span>
              <PostTime createdAt={postInfo.createdAt} />
              <Badge variant="default" className={cn('bg-slate-700')}>
                Avisos
              </Badge>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="Open menu" size="sm">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={onShowPostDialog}>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={onDeletePost}>
                    <Trash2 />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <PostDescription description={postInfo.description} />
        </div>
      </header>
      {mediaList.length > 0 && (
        <section className="p-1">
          <Carousel setApi={setApi} className="max-w-[27rem]">
            <CarouselContent>
              {mediaList.map((media, index) => (
                <CarouselItem key={index}>
                  <img
                    src={media}
                    alt="Image Post"
                    className="object-cover w-full h-full rounded-md"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {count > 1 && (
              <div>
                <CarouselPrevious />
                <CarouselNext />
              </div>
            )}
          </Carousel>
          {count > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: count }).map((_, index) => (
                <button
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
        </section>
      )}
      <footer>
        <ToggleGroup
          type="multiple"
          variant="default"
          className={cn('justify-evenly')}
          size="sm"
        >
          <ToggleGroupItem
            value="post"
            aria-label="Toggle post"
            onClick={() => onShowCommentsDialog(postInfo.comments || [])}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500 flex justify-center"
          >
            <MessageCircle />
            <span>{comments?.length || 0}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heart"
            aria-label="Toggle heart"
            onClick={onToggleHeartButton}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 flex justify-center"
          >
            <HeartIcon fill="red" stroke="red" />
            <span>{postInfo.likesQty}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bookmark"
            aria-label="Toggle bookmark"
            onClick={onToggleSaveButton}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 flex justify-center"
          >
            <BookmarkIcon
              fill={postInfo.isSaved ? 'gray' : ''}
              stroke={postInfo.isSaved ? 'gray' : ''}
            />
            <span>{postInfo.isSaved}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </footer>

      <PostCommentsDialog
        showDialog={isCommentDialogActive}
        comments={comments ?? null}
        description="Description test for Post page"
        onCloseDialog={() => setIsCommentDialogActive(false)}
      />
    </article>
  );
}
