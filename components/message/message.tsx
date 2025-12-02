'use client';

import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { BookmarkIcon, HeartIcon, MessageCircle } from 'lucide-react';

interface IMessage {
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
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <>
      <article className="flex flex-col items-center justify-start border border-gray-400 rounded-md p-4">
        <header className="flex gap-3 w-full">
          <Avatar className="h-14 w-14 rounded-full">
            <AvatarImage src={user.profileUrl} alt="Profile Image" />
            <AvatarFallback className="rounded-lg">
              {user.profileFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex justify-between w-full pr-4">
              <span className="font-semibold">{user.name}</span>
              <span className="text-gray-600">
                {formatTimePassed(user.timestamp)}
              </span>
            </div>
            <div>
              <p
                className={`transition-all duration-300 text-base ${isExpanded ? 'line-clamp-none' : 'line-clamp-1'}`}
              >
                {user.description ?? ''}
              </p>
              <button onClick={onToogleText} className="text-gray-400">
                {isExpanded ? 'menos' : 'mais'}
              </button>
            </div>
          </div>
        </header>
        <section className="p-4">
          <img src={user.media} alt="Image Post" />
        </section>
        <footer>
          <ToggleGroup type="multiple" variant="default" spacing={2} size="sm">
            <ToggleGroupItem
              value="star"
              aria-label="Toggle star"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
            >
              <MessageCircle />
              12
            </ToggleGroupItem>
            <ToggleGroupItem
              value="heart"
              aria-label="Toggle heart"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
            >
              <HeartIcon />
              54
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bookmark"
              aria-label="Toggle bookmark"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
            >
              <BookmarkIcon />
              45
            </ToggleGroupItem>
          </ToggleGroup>
        </footer>
      </article>
    </>
  );
}
