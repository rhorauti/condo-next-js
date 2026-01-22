import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider/theme-provider';
import '../styles/global.scss';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster
          position="top-center"
          richColors={true}
          theme="light"
          className={cn('z-[9999]')}
        />
      </body>
    </html>
  );
}
