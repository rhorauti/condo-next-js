import { useEffect, useState } from 'react';
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
import { IPostComment } from '@/interfaces/post.interface';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import { Textarea } from '../ui/textarea';
import { PostTime } from './post-time';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { FileText, HeartIcon, X } from 'lucide-react';
import PostResponseBox from './post-response-box';
import PostDescription from './post-description';

interface IProps {
  showDialog: boolean;
  description: string;
  comments: IPostComment[] | null;
  onCloseDialog: () => void;
}

export function PostCommentsDialog({
  showDialog,
  onCloseDialog,
  comments,
}: IProps) {
  const router = useRouter();
  const authStore = useAuthStore((state) => state);

  return (
    <Dialog open={showDialog} onOpenChange={onCloseDialog}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[42rem] max-h-[85%] flex flex-col"
      >
        <DialogHeader>
          <div className={cn('flex justify-between')}>
            <div>
              <DialogTitle className={cn('text-start')}>
                Comentários do Post
              </DialogTitle>
              <DialogDescription></DialogDescription>
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

        {comments?.length == 0 ? (
          <div className="flex flex-col gap-2 items-center">
            <FileText />
            <span>Não existem comentários ainda.</span>
          </div>
        ) : (
          <div className="mt-2 flex-1 overflow-auto">
            {comments?.map((comment, index) => (
              <div className="flex flex-col items-start gap-1" key={index}>
                <div className="flex justify-start-start gap-2">
                  <Avatar
                    onClick={() => router.push(`/profiles/${comment.idUser}`)}
                    className="h-8 w-8 rounded-full cursor-pointer"
                  >
                    <AvatarImage src={comment.profileUrl} alt="Profile Image" />
                    <AvatarFallback className="rounded-lg">
                      {authStore.credential.fallbackName}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-1 bg-secondary px-2 py-1 rounded-lg">
                      <p
                        onClick={() =>
                          router.push(`/profiles/${comment.idUser}`)
                        }
                        className="font-semibold text-sm cursor-pointer hover:underline"
                      >
                        {comment.name}
                      </p>
                      <PostDescription description={comment.description} />
                    </div>
                    <div className="text-xs flex gap-2 items-center">
                      <PostTime createdAt={comment.createdAt} />
                      <ToggleGroup
                        type="multiple"
                        variant="default"
                        className={cn('justify-evenly')}
                        size="sm"
                      >
                        <ToggleGroupItem
                          value="heart"
                          aria-label="Toggle heart"
                          // onClick={onToggleHeartButton}
                          className={cn(
                            'p-1 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 flex justify-center'
                          )}
                        >
                          <HeartIcon
                            fill="red"
                            stroke={`${comment.isLiked ? 'red' : ''}`}
                          />
                          <span className="font-normal">
                            {comment.likesQty}
                          </span>
                        </ToggleGroupItem>
                      </ToggleGroup>
                      <span className="hover:bg-secondary p-1 cursor-pointer">
                        Responder
                      </span>
                    </div>
                  </div>
                </div>

                {comment.comments?.map((subComment) => (
                  <div key={subComment.idUser} className="ml-10">
                    <div className="flex justify-start-start gap-2">
                      <Avatar
                        onClick={() =>
                          router.push(`/profiles/${subComment.idUser}`)
                        }
                        className="h-8 w-8 rounded-full cursor-pointer"
                      >
                        <AvatarImage
                          src={subComment.profileUrl}
                          alt="Profile Image"
                        />
                        <AvatarFallback className="rounded-lg">
                          {authStore.credential.fallbackName}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex flex-col gap-1 bg-secondary  px-2 py-1 rounded-lg">
                          <p
                            onClick={() =>
                              router.push(`/profiles/${subComment.idUser}`)
                            }
                            className="font-semibold text-sm cursor-pointer hover:underline"
                          >
                            {subComment.name}
                          </p>
                          <PostDescription
                            description={subComment.description}
                          />
                        </div>
                        <div className="text-xs flex gap-2 items-center">
                          <PostTime createdAt={subComment.createdAt} />
                          <ToggleGroup
                            type="multiple"
                            variant="default"
                            className={cn('justify-evenly')}
                            size="sm"
                          >
                            <ToggleGroupItem
                              value="heart"
                              aria-label="Toggle heart"
                              // onClick={onToggleHeartButton}
                              className={cn(
                                'p-1 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 flex justify-center'
                              )}
                            >
                              <HeartIcon
                                fill="red"
                                stroke={`${subComment.isLiked ? 'red' : ''}`}
                              />
                              <span className="font-normal">
                                {subComment.likesQty}
                              </span>
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <PostResponseBox />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
