import Input from '@/components/input';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex justify-center items-center bg-gradient-to-b from-blue-950 to-blue-800 w-full h-screen">
      <div className="flex flex-col items-center justify-center gap-4 bg-slate-100 w-full border shadow-lg shadow-blue-700 rounded-md border-logo md:w-1/4 p-4">
        <Image src="/logo-ttsteel.jpg" alt="Logo" width={120} height={80} />
        <p className="font-semibold md:text-lg">Login</p>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Usuário 1</label>
          <Input inputName="email"></Input>
        </div>
      </div>
    </div>
  );
}
