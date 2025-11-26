'use client';

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current viewport width is considered "mobile".
 * This is based on a standard media query breakpoint (e.g., 768px).
 * @returns boolean - true if the screen width is less than the breakpoint.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
    const mql = window.matchMedia(mediaQuery);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mql.matches);

    mql.addEventListener('change', handleMediaQueryChange);

    return () => {
      mql.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return isMobile;
}
