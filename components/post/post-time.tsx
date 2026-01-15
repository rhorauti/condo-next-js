'use client';

import { useEffect, useState } from 'react';

interface IProps {
  createdAt: Date;
}

export function PostTime({ createdAt }: IProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
    setTimeDisplay(formatTimePassed(createdAt));
  }, [createdAt]);

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

  return (
    <span
      className="text-gray-600 dark:text-secondary-foreground"
      suppressHydrationWarning
    >
      {isMounted ? timeDisplay : ''}
    </span>
  );
}
