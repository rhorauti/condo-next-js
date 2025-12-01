'use client';

import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface IMessage {
  profileSrc: string;
  profileFallback: string;
  profileUrl: string;
  name: string;
  description: string | null;
  media: string[] | null;
  timestamp: Date;
  likes: number;
  isSaved: boolean;
}

interface IProps {
  user: IMessage;
  comments?: IMessage[];
}

export default function Message({ user, comments }: IProps) {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <Avatar className="h-12 w-12 rounded-full">
            <AvatarImage src="/avatars/acdhns.jpg" alt="Profile Image" />
            <AvatarFallback className="rounded-lg">RH</AvatarFallback>
          </Avatar>
          <div className="flex justify-between">
            <span>{user.name}</span>
            <span>{user.timestamp.toISOString()}</span>
          </div>
        </div>
        <p>{user.description ?? ''}</p>
      </div>
    </>
  );
}
