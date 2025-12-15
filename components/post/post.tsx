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
import { IPost } from '@/interfaces/post.interface';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PostFormDialog } from './post-form-dialog';
import { PostCommentsDialog } from './post-comments-dialog';
import { onGetPostComments } from '@/http/auth/posts.http';
import { comment } from 'postcss';

interface IProps {
  postInfo: IPost;
}

export default function Post({ postInfo }: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [showToggle, setShowToggle] = useState(false);
  const [postData, setPostData] = useState<IPost>({
    idPost: 0,
    type: 0,
    profileFallback: '',
    profileUrl: '',
    name: '',
    description: '',
    mediaList: [],
    createdAt: new Date(),
    likesQty: 0,
    isLiked: false,
    isSaved: false,
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(postInfo.isLiked);
  const [isPostSaved, setIsPostSaved] = useState(postInfo.isSaved);
  const [isCommentDialogActive, setIsCommentDialogActive] = useState(false);
  const [comments, setComments] = useState<IPost[]>();

  useEffect(() => {
    const textRef = descriptionRef.current;
    if (textRef) {
      if (isExpanded || textRef.scrollHeight > textRef.clientHeight) {
        setShowToggle(true);
      } else {
        setShowToggle(false);
      }
    }
  }, [isExpanded, postInfo.description]);

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

  const formatTimePassed = (pastDate: Date | string): string => {
    const date = pastDate instanceof Date ? pastDate : new Date(pastDate);
    const diffInMs = new Date().getTime() - date.getTime();

    if (diffInMs < 0) {
      return 'Future';
    }

    const MS_PER_MINUTE = 60 * 1000;
    const MS_PER_HOUR = MS_PER_MINUTE * 60;
    const MS_PER_DAY = MS_PER_HOUR * 24;

    if (diffInMs < MS_PER_MINUTE) {
      const seconds = Math.floor(diffInMs / 1000);
      return seconds < 10 ? 'Agora' : `${seconds}s`;
    } else if (diffInMs < MS_PER_HOUR) {
      const minutes = Math.floor(diffInMs / MS_PER_MINUTE);
      return `${minutes}m`;
    } else if (diffInMs < MS_PER_DAY) {
      const hours = Math.floor(diffInMs / MS_PER_HOUR);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInMs / MS_PER_DAY);
      if (days >= 365) {
        const years = Math.floor(days / 365);
        return `${years}y`;
      }
      return `${days}d`;
    }
  };

  const onToogleText = () => {
    setIsExpanded(!isExpanded);
  };

  const mediaList = useMemo(() => {
    if (postInfo.mediaList == null || postInfo.mediaList == undefined)
      return [];
    else if (Array.isArray(postInfo.mediaList)) return postInfo.mediaList;
    else return [postInfo.mediaList];
  }, [postInfo.mediaList]);

  const onToggleHeartButton = () => {};

  const onToggleSaveButton = () => {};

  const onShowProfile = () => {};

  const onDeletePost = () => {};

  const onShowCommentsDialog = async (idPost: number): Promise<void> => {
    const comments = await onGetPostComments(idPost);
    setComments(comments);
    setIsCommentDialogActive(true);
  };

  const onShowEditPostDialog = (): void => {
    setPostData(postInfo);
    setShowEditDialog(true);
  };

  return (
    <article className="flex flex-col items-center gap-2 max-w-[32.5rem] w-full justify-start border border-gray-400 rounded-md p-4">
      <header className="flex gap-3 w-full">
        <Avatar
          onClick={() => onShowProfile()}
          className="h-12 w-12 rounded-full cursor-pointer"
        >
          <AvatarImage src={postInfo.profileUrl} alt="Profile Image" />
          <AvatarFallback className="rounded-lg">
            {postInfo.profileFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-4 pr-4">
              <span
                onClick={() => onShowProfile()}
                className="font-semibold cursor-pointer hover:underline"
              >
                {postInfo.name}
              </span>
              <span className="text-gray-600">
                {formatTimePassed(postInfo.createdAt)}
              </span>
              <Badge variant="default">Avisos</Badge>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="Open menu" size="sm">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => onShowEditPostDialog()}>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onDeletePost()}>
                    <Trash2 />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <p
              ref={descriptionRef}
              className={`transition-all duration-300 text-base ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}
            >
              {postInfo.description ?? ''}
            </p>
            {showToggle && (
              <button onClick={onToogleText} className="text-gray-400">
                {isExpanded ? 'menos' : 'mais'}
              </button>
            )}
          </div>
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
            onClick={() => onShowCommentsDialog(postInfo.idPost)}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500 flex justify-center"
          >
            <MessageCircle />
            <span>{comments?.length || 0}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heart"
            aria-label="Toggle heart"
            onClick={() => onToggleHeartButton}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 flex justify-center"
          >
            <HeartIcon fill="red" stroke="red" />
            <span>{postInfo.likesQty}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bookmark"
            aria-label="Toggle bookmark"
            onClick={() => onToggleSaveButton}
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
        description="Description test for Post page"
        onCloseDialog={() => setIsCommentDialogActive(false)}
      />

      <PostFormDialog
        showDialog={showEditDialog}
        postInfo={postData}
        onCloseDialog={() => setShowEditDialog(false)}
      />
    </article>
  );
}
