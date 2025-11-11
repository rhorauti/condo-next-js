import { Toaster } from 'sonner';

type AuthLayoutProps = {
  children?: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-b from-blue-900 to-blue-500 p-2">
        {children}
      </div>
      <Toaster position="top-center" />;
    </>
  );
}
