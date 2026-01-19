'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect, useMemo, useRef, useState } from 'react';
import useAuthStore from '@/store/auth.store';
import {
  Bell,
  FileText,
  LogOut,
  Menu,
  MessageSquare,
  MessagesSquare,
  Moon,
  Newspaper,
  Store,
  Sun,
  User,
  X,
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
import { Switch } from '../ui/switch';
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';

export default function Navbar() {
  const authStore = useAuthStore((state) => state);
  const [isProfileBoxActive, setIsProfileBoxActive] = useState(false);
  const profileBoxRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => clickOutSideUserBox(e);

    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clickOutSideUserBox = (e: Event): void => {
    if (
      profileBoxRef.current &&
      !profileBoxRef.current.contains(e.target as Node)
    ) {
      setIsProfileBoxActive(false);
    }
  };

  const showUserBox = (): void => {
    setIsProfileBoxActive(!isProfileBoxActive);
  };

  const fallbackName = useMemo(() => {
    authStore.onSetFallbackName();
    return authStore.credential.fallbackName;
  }, [authStore.credential.name]);

  const navBarItems = [
    {
      title: 'Dados Cadastrais',
      href: `/profiles/${authStore.credential.idUser}`,
      icon: <User />,
    },
    {
      title: 'Minhas postagens',
      href: '/posts/my-posts',
      icon: <MessageSquare />,
    },
    {
      title: 'Meu MarketPlace',
      href: '/marketplaces/my-marketplace',
      icon: <Store />,
    },
    {
      title: 'Política de uso',
      href: '/usage-policy',
      icon: <FileText />,
    },
    {
      title: 'Posts',
      href: '/posts/all',
      icon: <Newspaper />,
    },
    {
      title: 'Mensagens',
      href: '/chats',
      icon: <MessagesSquare />,
    },
    {
      title: 'Marketplace',
      href: '/marketplaces/my-marketplace',
      icon: <Store />,
    },
  ];

  const onSetTheme = (): void => {
    if (theme == 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <nav className="flex justify-between text-white items-center sticky top-0 left-0 w-full mx-auto py-2 px-6 bg-gray-900 shadow-sm z-[9999]">
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
        {navBarItems.slice(4).map((item, index) => (
          <Button variant="primary" size="sm" key={index}>
            <Link
              href={item.href}
              className={cn(
                'flex gap-2 justify-start items-center hover:text-white'
              )}
            >
              {item.icon}
              <span className="text-sm font-normal sm:text-[1rem]">
                {item.title}
              </span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="hidden relative md:flex gap-4">
        <div className="flex items-center gap-2">
          {!mounted ? (
            <Button variant="primary" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          ) : (
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
          )}
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Avatar
              onClick={showUserBox}
              className="h-10 w-10 cursor-pointer hover:opacity-90 transition border border-gray-400 font-semibold"
            >
              <AvatarImage src={authStore.credential.photoUrl} />
              <AvatarFallback>{fallbackName}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {navBarItems.slice(0, 4).map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className={cn('px-2 py-[0.1rem]')}
                >
                  <Button variant="primary" size="sm">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex gap-2 justify-start items-center hover:text-white'
                      )}
                    >
                      {item.icon}
                      <span className="text-sm font-normal sm:text-[1rem]">
                        {item.title}
                      </span>
                    </Link>
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu Trigger */}
      <div className="flex items-center gap-2 md:hidden">
        <Button
          onClick={() => setIsMobileMenuActive(!isMobileMenuActive)}
          variant="primary"
        >
          <Menu />
        </Button>
      </div>

      {/* Mobile Menu Box */}
      <div
        className={`bg-secondary text-foreground md:hidden flex flex-col justify-between fixed top-0 right-0 p-6 w-full h-screen z-[1000] transition-transform duration-300 overflow-auto ${
          isMobileMenuActive ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Button
          onClick={() => setIsMobileMenuActive(false)}
          variant="destructive"
          size={'icon'}
          className={cn('absolute top-6 right-6 rounded-full h-8 w-8')}
        >
          <X />
        </Button>
        <div className="flex flex-col items-start gap-8">
          <div className="flex flex-col justify-center items-center gap-2 mx-auto">
            <Avatar
              onClick={authStore.onShowProfile}
              className={cn('h-12 w-12 rounded-full cursor-pointer')}
            >
              <AvatarImage
                src={authStore.credential.photoUrl}
                alt="Profile Image"
              />
              <AvatarFallback className="rounded-lg">
                {authStore.credential.fallbackName}
              </AvatarFallback>
            </Avatar>
            <span
              onClick={authStore.onShowProfile}
              className="font-semibold cursor-pointer hover:underline"
            >
              {authStore.credential.name}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 w-full">
            {navBarItems.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={cn('block w-full')}
              >
                <Link
                  href={item.href}
                  className={cn('flex gap-4 justify-start items-center')}
                >
                  {item.icon}
                  <span className="text-sm font-normal sm:text-[1rem]">
                    {item.title}
                  </span>
                </Link>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className={cn('flex gap-4 justify-start items-center w-full')}
            >
              <LogOut />
              <span className="text-sm font-normal sm:text-[1rem]">Sair</span>
            </Button>
          </div>
        </div>
        {mounted && (
          <div className="flex justify-between border border-input bg-background hover:bg-accent hover:text-accent-foreground p-2 rounded-lg">
            {theme === 'dark' ? (
              <div className="flex gap-2">
                <Moon />
                <span>Escuro</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Sun />
                <span className="text-sm font-normal sm:text-[1rem]">
                  Claro
                </span>
              </div>
            )}
            <Switch checked={theme === 'dark'} onCheckedChange={onSetTheme} />
          </div>
        )}
      </div>
    </nav>
  );
}
