import Input from '@/components/input';
import { FaBeer } from 'react-icons/fa';

export const metadata = {
  title: 'App Router',
};

export default function Page() {
  return (
    <div className="w-full ">
      <h1 className="text-lg bg-red-400">App Router 4</h1>
      <FaBeer className="text-2xl" />
      <Input inputName="email" />
    </div>
  );
}
