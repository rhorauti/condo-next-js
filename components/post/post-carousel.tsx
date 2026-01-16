'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

interface IProps {
  mediaListProp: string[] | null;
  showDots?: boolean;
  showArrows?: boolean;
}

export default function PostCarousel({
  mediaListProp,
  showArrows = true,
  showDots = true,
}: IProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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

  const mediaList = useMemo(() => {
    if (mediaListProp == null) return [];
    else if (Array.isArray(mediaListProp)) return mediaListProp;
    else return [mediaListProp];
  }, [mediaListProp]);

  return (
    <>
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
            {count > 1 && showArrows && (
              <div>
                <CarouselPrevious />
                <CarouselNext />
              </div>
            )}
          </Carousel>
          {count > 1 && showDots && (
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
    </>
  );
}
