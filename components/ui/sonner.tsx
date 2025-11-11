'use client';

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const icons = {
    success: <CircleCheck className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
    warning: <TriangleAlert className="h-4 w-4" />,
    error: <OctagonX className="h-4 w-4" />,
    loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
  };

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={icons}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      style={
        {
          '--normal-bg': 'hsl(var(--card))',
          '--normal-text': 'hsl(var(--card-foreground))',
          '--normal-border': 'hsl(var(--border))',

          '--success-bg': 'hsl(var(--success))',
          '--success-text': 'hsl(var(--success-foreground))',

          '--error-bg': 'hsl(var(--destructive))',
          '--error-text': 'hsl(var(--destructive-foreground))',

          '--warning-bg': 'hsl(var(--warning))',
          '--warning-text': 'hsl(var(--warning-foreground))',

          '--info-bg': 'hsl(var(--info))',
          '--info-text': 'hsl(var(--info-foreground))',

          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
