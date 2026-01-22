import { Toaster } from '@/components/ui/sonner';

type AuthLayoutProps = {
  children?: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <main className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-b from-blue-900 to-blue-500 p-4">
        {children}
      </main>
    </>
  );
}
