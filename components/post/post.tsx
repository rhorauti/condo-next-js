'use client';

import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useEffect, useMemo, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import {
  BookmarkIcon,
  Ellipsis,
  HeartIcon,
  MessageCircle,
  Pencil,
  Share2,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { PostCommentsDialog } from './post-comments-dialog';
import useAuthStore from '@/store/auth.store';
import PostDescription from './post-description';
import { PostTime } from './post-time';
import PostCarousel from './post-carousel';
import { translatePostToString } from '@/enum/post.enum';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

interface IProps {
  isMyPosts: boolean;
  postInfo: IPost;
  onShowPostDialog?: () => void;
  onDeletePost?: () => void;
}

export default function Post({
  isMyPosts = false,
  postInfo,
  onShowPostDialog,
  onDeletePost,
}: IProps) {
  const [isCommentDialogActive, setIsCommentDialogActive] = useState(false);
  const [postTypeTranslated, setPostTypeTranslated] = useState('');
  const [isPostLiked, setIsPostLike] = useState(postInfo.isLiked);
  const [likeQty, setLikeQty] = useState(postInfo.likesQty);
  const authStore = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    authStore.onSetFallbackName();
    setPostTypeTranslated(translatePostToString(postInfo.type || 0));
  }, []);

  const onLikePost = () => {
    const next = !isPostLiked;

    setIsPostLike(next);
    setLikeQty((prev) => prev + (next ? 1 : -1));

    if (next) {
      toast.success('Post curtido!', {
        duration: 2000,
        action: {
          label: 'Fechar',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } else {
      toast.success('Curtida removida!', {
        duration: 2000,
        action: {
          label: 'Fechar',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  };

  const onSharePost = () => {};

  return (
    <article className="flex flex-col items-center gap-2 max-w-[32.5rem] w-full justify-start border border-gray-400 rounded-md p-4">
      <header className="flex gap-3 w-full">
        <Link href={`/profiles/${postInfo.idUser}`}>
          <Avatar className="h-12 w-12 rounded-full cursor-pointer">
            <AvatarImage src={postInfo.profileUrl || ''} alt="Profile Image" />
            <AvatarFallback className="rounded-lg">
              {authStore.credential.fallbackName}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap sm:gap-4 gap-2 pr-4">
              <Link
                href={`/profiles/${postInfo.idUser}`}
                className="font-semibold cursor-pointer hover:underline"
              >
                {postInfo.name}
              </Link>
              <PostTime createdAt={postInfo.createdAt} />
              <Badge variant="default" className={cn('bg-slate-700')}>
                {postTypeTranslated}
              </Badge>
            </div>
            {isMyPosts && (
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
            )}
          </div>
          <PostDescription description={postInfo.description} />
        </div>
      </header>
      <section>
        <PostCarousel mediaListProp={postInfo.mediaList} />
      </section>
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
            onClick={() => setIsCommentDialogActive(true)}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500 flex justify-center"
          >
            <MessageCircle />
            <span>{postInfo.commentsQty || 0}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heart"
            aria-label="Toggle heart"
            onClick={onLikePost}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 flex justify-center"
          >
            <HeartIcon
              className={` ${isPostLiked ? 'fill-red-500 text-red-500' : 'fill-transparent text-black dark:text-white'}`}
            />
            <span>{likeQty}</span>
          </ToggleGroupItem>
          {/* <ToggleGroupItem
            value="share"
            aria-label="Share post"
            onClick={onSharePost}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 flex justify-center"
          >
            <Share2 />
          </ToggleGroupItem> */}
        </ToggleGroup>
      </footer>

      <PostCommentsDialog
        idPost={postInfo.idPost}
        showDialog={isCommentDialogActive}
        onCloseDialog={() => setIsCommentDialogActive(false)}
      />
    </article>
  );
}
