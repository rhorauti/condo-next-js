'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect, useMemo, useRef, useState } from 'react';
import useAuthStore from '@/store/auth.store';
import {
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Store,
  Sun,
  User,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const authStore = useAuthStore((state) => state);
  const [isUserBoxActive, setIsUserBoxActive] = useState(false);
  const userBoxRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { setTheme } = useTheme();

  const navBarItems = [
    {
      title: 'Posts',
      href: '/posts',
      description: '',
    },
    {
      title: 'Marketplace',
      href: '/marketplace',
      description: '',
    },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => clickOutSideUserBox(e);

    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  const clickOutSideUserBox = (e: Event): void => {
    if (userBoxRef.current && !userBoxRef.current.contains(e.target as Node)) {
      setIsUserBoxActive(false);
    }
  };

  const showUserBox = (): void => {
    setIsUserBoxActive(!isUserBoxActive);
  };

  const fallbackName = useMemo(() => {
    authStore.setFallbackName();
    return authStore.credential.fallbackName;
  }, [authStore.credential.name]);

  const redirectToProfile = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    router.push('/profile');
  };

  const redirectToMyPosts = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    router.push('/my-posts');
  };

  const redirectToMySalesBoard = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.stopPropagation();
    router.push('/my-marketplace');
  };

  const redirectToPolicy = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    router.push('/my-marketplace');
  };

  const logout = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    router.push('/login');
  };

  return (
    <nav className="flex justify-between text-white items-center sticky top-0 left-0 w-full mx-auto py-2 px-6 bg-gray-900 shadow-sm z-[100]">
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:from-blue-700 group-hover:to-blue-800 transition">
            <span className="font-bold text-lg">C</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline">
            ConectaCondo
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center md:gap-6 gap-2">
        {navBarItems.map((item, index) => (
          <Button variant="primary" size="default">
            <Link
              key={index}
              href={item.href}
              className="flex gap-2 items-center text-sm sm:text-lg"
            >
              {item.title == 'Posts' ? (
                <MessageSquare size={18} />
              ) : (
                <Store size={18} />
              )}
              <span>{item.title}</span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="hidden relative md:flex gap-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primary" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Escuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="primary" size="icon">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
        <Avatar
          onClick={showUserBox}
          className="h-10 w-10 cursor-pointer hover:opacity-90 transition border border-gray-400 font-semibold"
        >
          <AvatarImage src={authStore.credential.photoUrl} />
          <AvatarFallback>{fallbackName}</AvatarFallback>
        </Avatar>

        {isUserBoxActive && (
          <div
            ref={userBoxRef}
            className="absolute text-black top-14 right-0 flex flex-col min-w-52 w-full h-screen sm:h-auto p-2 border border-gray-400 bg-white rounded-lg cursor-pointer"
          >
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => redirectToProfile(e)}
              className={cn(
                'flex gap-2 justify-start items-center hover:text-white'
              )}
            >
              <User />
              <span className="text-sm font-normal sm:text-[1rem]">
                Dados cadastrais
              </span>
            </Button>
            <div className="flex gap-2 items-center hover:bg-primary hover:text-white hover:rounded-md p-1">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => redirectToMyPosts(e)}
                className={cn(
                  'flex gap-2 justify-start items-center hover:text-white'
                )}
              >
                <MessageSquare />
                <span className="text-sm font-normal sm:text-[1rem]">
                  Minhas postagens
                </span>
              </Button>
            </div>
            <div className="flex gap-2 items-center hover:bg-primary hover:text-white hover:rounded-md p-1">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => redirectToMySalesBoard(e)}
                className={cn(
                  'flex gap-2 justify-start items-center hover:text-white'
                )}
              >
                <Store />
                <span className="text-sm font-normal sm:text-[1rem]">
                  Meu marketplace
                </span>
              </Button>
            </div>
            <div className="flex gap-2 items-center hover:bg-primary hover:text-white hover:rounded-md p-1">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => redirectToPolicy(e)}
                className={cn(
                  'flex gap-2 justify-start items-center hover:text-white'
                )}
              >
                <Store />
                <span className="text-sm font-normal sm:text-[1rem]">
                  Politica de uso
                </span>
              </Button>
            </div>
            <div className="flex gap-2 items-center hover:bg-primary hover:text-white hover:rounded-md p-1">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => logout(e)}
                className={cn(
                  'flex gap-2 justify-start items-center hover:text-white'
                )}
              >
                <LogOut />
                <span className="text-sm font-normal sm:text-[1rem]">Sair</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <Button variant="primary" className="md:hidden">
        <Menu />
      </Button>
    </nav>
  );
}
