import Navbar from '@/components/navbar/navbar';
import { Toaster } from 'sonner';

type HomeLayoutProps = {
  children?: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex flex-col gap-4">
      <Navbar />
      <div className="flex justify-center p-2">{children}</div>
    </div>
  );
}
