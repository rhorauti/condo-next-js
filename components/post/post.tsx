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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface IProps {
  user: IPost;
}

export default function Post({ user }: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [showToggle, setShowToggle] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(user.isLiked);
  const [isPostSaved, setIsPostSaved] = useState(user.isSaved);

  useEffect(() => {
    const textRef = descriptionRef.current;
    if (textRef) {
      if (isExpanded || textRef.scrollHeight > textRef.clientHeight) {
        setShowToggle(true);
      } else {
        setShowToggle(false);
      }
    }
  }, [isExpanded, user.description]);

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
    if (user.mediaList == null || user.mediaList == undefined) return [];
    else if (Array.isArray(user.mediaList)) return user.mediaList;
    else return [user.mediaList];
  }, [user.mediaList]);

  const onCommentButtonClick = () => {};

  const onToggleHeartButton = () => {};

  const onToggleSaveButton = () => {};

  const onShowProfile = () => {};

  const onDeletePost = () => {};

  return (
    <article className="flex flex-col items-center gap-2 max-w-[32.5rem] w-full justify-start border border-gray-400 rounded-md p-4">
      <header className="flex gap-3 w-full">
        <Avatar
          onClick={() => onShowProfile()}
          className="h-12 w-12 rounded-full cursor-pointer"
        >
          <AvatarImage src={user.profileUrl} alt="Profile Image" />
          <AvatarFallback className="rounded-lg">
            {user.profileFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 pr-4">
              <span
                onClick={() => onShowProfile()}
                className="font-semibold cursor-pointer hover:underline"
              >
                {user.name}
              </span>
              <span className="text-gray-600">
                {formatTimePassed(user.timestamp)}
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
                  <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
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
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New File</DialogTitle>
                  <DialogDescription>
                    Provide a name for your new file. Click create when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="pb-3">
                  <Field>
                    <FieldLabel htmlFor="filename">File Name</FieldLabel>
                    <Input
                      id="filename"
                      name="filename"
                      placeholder="document.txt"
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <p
              ref={descriptionRef}
              className={`transition-all duration-300 text-base ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}
            >
              {user.description ?? ''}
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
            <div>
              <CarouselPrevious />
              <CarouselNext />
            </div>
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
            onClick={() => onCommentButtonClick}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500 flex justify-center"
          >
            <MessageCircle />
            <span>{user.commentsQty}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heart"
            aria-label="Toggle heart"
            onClick={() => onToggleHeartButton}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 flex justify-center"
          >
            <HeartIcon fill="red" stroke="red" />
            <span>{user.likesQty}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bookmark"
            aria-label="Toggle bookmark"
            onClick={() => onToggleSaveButton}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 flex justify-center"
          >
            <BookmarkIcon
              fill={user.isSaved ? 'gray' : ''}
              stroke={user.isSaved ? 'gray' : ''}
            />
            <span>{user.isSaved}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </footer>
    </article>
  );
}
