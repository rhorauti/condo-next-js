import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
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
      <DialogContent className="sm:max-w-[42rem]">
        <DialogHeader>
          <DialogTitle>Comentários do Post</DialogTitle>
        </DialogHeader>
        {comments?.map((comment) => (
          <div className="flex items-start gap-2">
            <Avatar
              onClick={() =>
                router.push(`/profiles/${authStore.credential.idUser}`)
              }
              className="h-8 w-8 rounded-full cursor-pointer"
            >
              <AvatarImage src={comment.profileUrl} alt="Profile Image" />
              <AvatarFallback className="rounded-lg">
                {authStore.credential.fallbackName}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 bg-slate-200 p-3 rounded-lg">
              <p
                onClick={() => router.push(`/profiles/${comment.idUser}`)}
                className="font-semibold text-sm cursor-pointer hover:underline"
              >
                {comment.name}
              </p>
              <p>{comment.description}</p>
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
