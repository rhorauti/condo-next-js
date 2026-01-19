'use client';

import { useEffect, useRef, useState } from 'react';

interface IProps {
  description: string;
}

export default function PostDescription({ description }: IProps) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [showToggle, setShowToggle] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const textRef = descriptionRef.current;
    if (!textRef) return;
    if (textRef) {
      if (isExpanded || textRef.scrollHeight > textRef.clientHeight) {
        setShowToggle(true);
      } else {
        setShowToggle(false);
      }
    }
  }, [isExpanded, description]);

  const onToggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-wrap">
      <p
        ref={descriptionRef}
        className={`transition-all duration-300 text-base ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}
      >
        {description ?? ''}
      </p>
      {showToggle && (
        <button onClick={onToggleText} className="text-gray-400 ">
          {isExpanded ? 'menos' : 'mais'}
        </button>
      )}
    </div>
  );
}
