'use client';

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
import { getPostCommentList } from '@/http/post/posts.http';
import { set } from 'date-fns';
import { toast } from 'sonner';
import { comment } from 'postcss';
import { cp } from 'fs';
import { Alert, AlertDescription } from '../ui/alert';
import Link from 'next/link';

const commentsTest: IPostComment[] = [
  {
    idUser: 145,
    idPost: 1,
    idComment: 564,
    profileUrl: '/teste1.jpeg',
    name: 'Daniela Nakano',
    mediaList: null,
    fallbackName: 'RH',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçl rem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçl rem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    createdAt: new Date(),
    likesQty: 10,
    isLiked: false,
    subComments: [
      {
        idUser: 147,
        idComment: 1,
        idParent: 564,
        profileUrl: '/teste2.jpeg',
        mediaList: null,
        name: 'Daniela Yukalli Nakano',
        fallbackName: 'RH',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 20,
        isLiked: false,
      },
      {
        idUser: 148,
        idComment: 2,
        idParent: 564,
        profileUrl: '/teste3.jpeg',
        mediaList: ['açslkdjaslçf'],
        name: 'Lucas Ryo Horauti',
        fallbackName: 'DH',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 30,
        isLiked: false,
      },
    ],
  },
  {
    idUser: 145,
    idPost: 1,
    idComment: 565,
    profileUrl: '/teste1.jpeg',
    name: 'Rafael Horauti',
    mediaList: null,
    fallbackName: 'RH',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    createdAt: new Date(),
    likesQty: 10,
    isLiked: false,
    subComments: [
      {
        idUser: 147,
        idComment: 3,
        idParent: 565,
        profileUrl: '/teste2.jpeg',
        mediaList: null,
        name: 'Daniela Yukalli Nakano',
        fallbackName: 'RH',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 20,
        isLiked: false,
      },
      {
        idUser: 148,
        idComment: 4,
        idParent: 565,
        profileUrl: '/teste3.jpeg',
        mediaList: ['açslkdjaslçf'],
        name: 'Lucas Ryo Horauti',
        fallbackName: 'DH',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 30,
        isLiked: false,
      },
    ],
  },
  {
    idUser: 145,
    idPost: 1,
    idComment: 566,
    profileUrl: '/teste1.jpeg',
    name: 'Lucas Horauti',
    mediaList: null,
    fallbackName: 'RH',
    description:
      'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
    createdAt: new Date(),
    likesQty: 10,
    isLiked: false,
    subComments: [
      {
        idUser: 147,
        idComment: 5,
        idParent: 566,
        profileUrl: '/teste2.jpeg',
        mediaList: null,
        name: 'Daniela Yukalli Nakano',
        fallbackName: 'RH',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 20,
        isLiked: false,
      },
      {
        idUser: 148,
        idComment: 6,
        idParent: 566,
        profileUrl: '/teste3.jpeg',
        mediaList: ['açslkdjaslçf'],
        name: 'Lucas Ryo Horauti',
        fallbackName: 'DH',
        description:
          'Post teste lorem ipsulon alçskdjfçaslkj açslkjslçakjfçslakdflça ALSKJÇ ÇLKASJLKSJAÇ açlskdaslç jkasçljd asçlkd fçlsak çljskkj sçkf s',
        createdAt: new Date(),
        likesQty: 30,
        isLiked: false,
      },
    ],
  },
];

interface IProps {
  idPost: number;
  showDialog: boolean;
  onCloseDialog: () => void;
}

export function PostCommentsDialog({
  idPost,
  showDialog,
  onCloseDialog,
}: IProps) {
  const router = useRouter();
  const authStore = useAuthStore((state) => state);
  const [comments, setCommments] = useState<IPostComment[]>();
  const [isResponseBoxActive, setIsResponseBoxActive] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    onGetComments(idPost);
  }, []);

  const onGetComments = async (idPost: number): Promise<void> => {
    // const commentList = await getPostCommentList(idPost);
    // setCommments(commentList.data);
    setCommments(commentsTest);
  };

  const onLikeComment = (idComment: number): void => {
    const next = !comments?.find((comment) => comment.idComment == idComment)
      ?.isLiked;
    setCommments((prev) => {
      if (!prev) return prev;
      return prev.map((comment) => {
        if (comment.idComment != idComment) return comment;
        else
          return {
            ...comment,
            isLiked: next,
            likesQty: next ? comment.likesQty + 1 : comment.likesQty - 1,
          };
      });
    });
    if (next) {
      toast.success('Comentário curtido.', {
        duration: 2000,
        action: {
          label: 'Fechar',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } else {
      toast.success('Curtida removida.', {
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

  const onLikeSubComment = (idComment: number, idSubComment: number): void => {
    let currentValue = false;
    const targetComment = comments?.find(
      (comment) => comment.idComment == idComment
    );
    if (targetComment) {
      currentValue =
        (targetComment.subComments || []).find(
          (subComment) => subComment && subComment.idComment == idSubComment
        )?.isLiked ?? false;
    }
    const next = !currentValue;
    setCommments((prev) => {
      if (!prev) return prev;

      return prev.map((comment) => {
        if (comment.idComment !== idComment) return comment;

        return {
          ...comment,
          subComments: (comment.subComments || []).map((sub) => {
            if (sub.idComment !== idSubComment) return sub;

            return {
              ...sub,
              isLiked: next,
              likesQty: next ? sub.likesQty + 1 : sub.likesQty - 1,
            };
          }),
        };
      });
    });
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
      toast.success('Post removido!', {
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

  const onShowResponseBox = (idComment: number): void => {
    const comment = comments?.find(
      (comment) => (comment.idComment || 0) == idComment
    );
    if (comment) {
      setName(comment.name);
      setIsResponseBoxActive(true);
    }
  };

  const onCloseResponseBox = (): void => {
    setName('');
    setIsResponseBoxActive(false);
  };

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
          <div className="flex flex-col gap-3 mt-2 overflow-auto">
            {comments?.map((comment, index) => (
              <div
                className="flex flex-col items-start gap-1"
                key={'comment' + index}
              >
                <div className="flex justify-start-start gap-2">
                  <Link href={`/profiles/${comment.idUser}`}>
                    <Avatar className="h-8 w-8 rounded-full cursor-pointer">
                      <AvatarImage
                        src={comment.profileUrl || ''}
                        alt="Profile Image"
                      />
                      <AvatarFallback className="rounded-lg">
                        {authStore.credential.fallbackName}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-1 bg-secondary px-2 py-1 rounded-lg">
                      <Link
                        href={`/profiles/${comment.idUser}`}
                        className="font-semibold text-sm cursor-pointer hover:underline"
                      >
                        {comment.name}
                      </Link>
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
                          onClick={() => onLikeComment(comment.idComment || 0)}
                          className={cn('p-1 flex justify-center')}
                        >
                          <HeartIcon
                            className={` ${comment.isLiked ? 'fill-red-500 text-red-500' : 'fill-transparent text-black dark:text-white'}`}
                          />
                          <span className="font-normal">
                            {comment.likesQty}
                          </span>
                        </ToggleGroupItem>
                      </ToggleGroup>
                      <span
                        onClick={() =>
                          onShowResponseBox(comment.idComment || 0)
                        }
                        className="hover:bg-secondary p-1 cursor-pointer"
                      >
                        Responder
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-3">
                  {comment.subComments?.map((subComment, index) => (
                    <div
                      key={'subComment' + index}
                      className="flex flex-col items-start gap-2 ml-10"
                    >
                      <div className="flex justify-start gap-2 ">
                        <Link href={`/profiles/${subComment.idUser}`}>
                          <Avatar className="h-8 w-8 rounded-full cursor-pointer">
                            <AvatarImage
                              src={subComment.profileUrl || ''}
                              alt="Profile Image"
                            />
                            <AvatarFallback className="rounded-lg">
                              {authStore.credential.fallbackName}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex flex-col">
                          <div className="flex flex-col gap-1 bg-secondary  px-2 py-1 rounded-lg">
                            <Link
                              href={`/profiles/${subComment.idUser}`}
                              className="font-semibold text-sm cursor-pointer hover:underline"
                            >
                              {subComment.name}
                            </Link>
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
                                onClick={() =>
                                  onLikeSubComment(
                                    comment.idComment || 0,
                                    subComment.idComment || 0
                                  )
                                }
                                className={cn('p-1 flex justify-center')}
                              >
                                <HeartIcon
                                  className={` ${subComment.isLiked ? 'fill-red-500 text-red-500' : 'fill-transparent text-black dark:text-white'}`}
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
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <div className="flex flex-col gap-2 w-full">
            <Alert
              className={cn(
                ' bg-secondary overflow-hidden border transition-[max-height] duration-500 ease-out',
                isResponseBoxActive
                  ? 'max-h-[80px] p-3'
                  : 'max-h-0 p-0 border-transparent'
              )}
            >
              {isResponseBoxActive && (
                <div className="flex justify-between">
                  <AlertDescription>
                    <p>
                      Respondendo a <span className="font-medium">{name}</span>
                    </p>
                  </AlertDescription>
                  <Button
                    onClick={onCloseResponseBox}
                    variant="destructive"
                    size="icon"
                    className={cn('h-5 w-5 rounded-full')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Alert>
            <PostResponseBox idPost={idPost} isResponse={isResponseBoxActive} />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
