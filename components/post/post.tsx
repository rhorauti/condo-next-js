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
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import useAuthStore from '@/store/auth.store';
import PostDescription from './post-description';
import { PostTime } from './post-time';
import PostCarousel from './post-carousel';
import { translatePostToString } from '@/enum/post.enum';
import { useRouter } from 'next/navigation';

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
  const [isPostLiked, setIsPostLiked] = useState(postInfo.isLiked);
  const [isPostSaved, setIsPostSaved] = useState(postInfo.isSaved);
  const authStore = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    authStore.onSetFallbackName();
    setPostTypeTranslated(translatePostToString(postInfo.type || 0));
  }, []);

  const onLikePost = () => {
    setIsPostLiked(!isPostLiked);
  };

  const onSavePost = () => {
    setIsPostSaved(!isPostSaved);
  };

  return (
    <article className="flex flex-col items-center gap-2 max-w-[32.5rem] w-full justify-start border border-gray-400 rounded-md p-4">
      <header className="flex gap-3 w-full">
        <Avatar
          onClick={() => router.push(`/profiles/${postInfo.idUser}`)}
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
                onClick={() => router.push(`/profiles/${postInfo.idUser}`)}
                className="font-semibold cursor-pointer hover:underline"
              >
                {postInfo.name}
              </span>
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
              className={`dark:text-white ${isPostLiked ? 'fill-red-500 text-transparent' : 'fill-transparent text-black'}`}
            />
            <span>{postInfo.likesQty}</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bookmark"
            aria-label="Toggle bookmark"
            onClick={onSavePost}
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 flex justify-center"
          >
            <BookmarkIcon
              className={`dark:text-white ${isPostSaved ? 'fill-gray-500 text-transparent' : 'fill-transparent text-black'}`}
            />
            <span>{postInfo.isSaved}</span>
          </ToggleGroupItem>
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
