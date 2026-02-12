'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect, useState } from 'react';
import {
  BarChart3,
  BellIcon,
  Calendar,
  CircleQuestionMark,
  FileText,
  LogOut,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  Newspaper,
  Store,
  Sun,
  ThumbsUp,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { buildWebDinamicRoute, WEB_ROUTES } from '@/enum/web/routes.enum';
import { IUser } from '@/interfaces/user.interface';
import { USER_ROLES } from '@/enum/role.enum';
import { onGetAuthUserInfo } from '@/http/web/user/user.http';

export const initialUserData: IUser = {
  idUser: 0,
  email: '',
  fallbackName: '',
  name: '',
  role: USER_ROLES.USER,
  mediaObject: null,
  isActive: false,
};

export default function Navbar() {
  const [userData, setUserData] = useState<IUser>();
  const router = useRouter();
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    onGetUserOverallInfo();
  }, []);

  const onGetUserOverallInfo = async (): Promise<void> => {
    const user = await onGetAuthUserInfo();
    if (user) {
      setUserData(user.data ?? initialUserData);
    }
  };

  const navBarItems = [
    {
      title: 'Dados Cadastrais',
      href: buildWebDinamicRoute(WEB_ROUTES.PROFILES, 'me'),
      icon: <User />,
    },
    {
      title: 'Minhas postagens',
      href: WEB_ROUTES.MY_POSTS,
      icon: <MessageSquare />,
    },
    {
      title: 'Meu MarketPlace',
      href: WEB_ROUTES.MY_MARKETPLACE,
      icon: <Store />,
    },
    {
      title: 'Calendário de eventos',
      href: WEB_ROUTES.EVENTS,
      icon: <Calendar />,
    },
    {
      title: 'Política de uso',
      href: WEB_ROUTES.POLICY,
      icon: <FileText />,
    },
    {
      title: 'Posts',
      href: WEB_ROUTES.ALL_POSTS,
      icon: <Newspaper />,
    },
    {
      title: 'Recomendações',
      href: WEB_ROUTES.RECOMMENDATIONS,
      icon: <ThumbsUp />,
    },
    {
      title: 'Marketplace',
      href: WEB_ROUTES.ALL_MARKETPLACE,
      icon: <Store />,
    },
    {
      title: 'Relatórios',
      href: WEB_ROUTES.REPORTS,
      icon: <BarChart3 />,
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
    <nav className="flex justify-between text-white items-center sticky top-0 left-0 w-full mx-auto py-2 px-6 bg-gray-900 shadow-sm z-[40] overflow-auto">
      <div className="flex-shrink-0">
        <Link
          href={WEB_ROUTES.HOME}
          className="flex items-center space-x-2 group"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:from-blue-700 group-hover:to-blue-800 transition">
            <span className="font-bold text-lg">C</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline">
            ConectaCondo
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center md:gap-6 gap-2">
        {navBarItems.slice(5).map((item, index) => (
          <Button variant="ghost" size="sm" key={index}>
            <Link
              href={item.href}
              className={cn('flex gap-2 justify-start items-center')}
            >
              {item.icon}
              <span className="text-sm font-normal sm:text-[1rem] hidden lg:inline">
                {item.title}
              </span>
            </Link>
          </Button>
        ))}
      </div>

      {/* Theme menu */}
      <div className="hidden relative md:flex gap-4">
        <div className="flex items-center gap-2">
          {!mounted ? (
            <Button variant="ghost" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          ) : (
            <DropdownMenu>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    </Button>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent>
                  <p>Tema de fundo</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setTheme('light')}
                  className={cn('py-[0.2rem]')}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'flex gap-2 justify-start items-center w-full'
                    )}
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                    <span className="text-sm font-normal sm:text-[1rem]">
                      Claro
                    </span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('dark')}
                  className={cn('py-[0.2rem]')}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'flex gap-2 justify-start items-center w-full'
                    )}
                  >
                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                    <span className="text-sm font-normal sm:text-[1rem]">
                      Escuro
                    </span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('system')}
                  className={cn('py-[0.2rem]')}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'flex gap-2 justify-start items-center w-full'
                    )}
                  >
                    <Monitor className="h-[1.2rem] w-[1.2rem]" />
                    <span className="text-sm font-normal sm:text-[1rem]">
                      Sistema
                    </span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsMobileMenuActive(false)}
                variant="ghost"
                size="sm"
              >
                <BellIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notificações</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <CircleQuestionMark />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Faq</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Desktop profile menu */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer hover:opacity-90 transition border border-gray-400 font-semibold">
              <AvatarImage src={userData?.mediaObject?.mediaUrl} />
              <AvatarFallback>{userData?.fallbackName}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {navBarItems.slice(0, 5).map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  asChild
                  className={cn('py-[0.1rem] px-0')}
                >
                  <Link href={item.href} className={cn('w-full')}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'flex gap-2 justify-start items-center w-full'
                      )}
                    >
                      {item.icon}
                      <span className="text-sm font-normal sm:text-[1rem] hidden sm:block">
                        {item.title}
                      </span>
                    </Button>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem className={cn('py-[0.1rem] px-0')} asChild>
                <div className="w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'flex gap-2 justify-start items-center w-full'
                    )}
                  >
                    <LogOut />
                    <span className="text-sm font-normal sm:text-[1rem]">
                      Sair
                    </span>
                  </Button>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu Trigger */}
      <div className="flex items-center gap-2 md:hidden">
        <Button
          onClick={() => setIsMobileMenuActive(false)}
          variant="ghost"
          size="sm"
        >
          <BellIcon />
        </Button>
        <Button variant="ghost" size="sm">
          <CircleQuestionMark />
        </Button>
        <Button
          onClick={() => setIsMobileMenuActive(!isMobileMenuActive)}
          variant="ghost"
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
              onClick={() =>
                router.push(
                  buildWebDinamicRoute(
                    WEB_ROUTES.PROFILES,
                    userData?.idUser ?? 0
                  )
                )
              }
              className={cn('h-12 w-12 rounded-full cursor-pointer')}
            >
              <AvatarImage
                src={userData?.mediaObject?.mediaUrl}
                alt="Profile Image"
              />
              <AvatarFallback className="rounded-lg">
                {userData?.fallbackName}
              </AvatarFallback>
            </Avatar>
            <span
              onClick={() =>
                router.push(
                  buildWebDinamicRoute(
                    WEB_ROUTES.PROFILES,
                    userData?.idUser ?? 0
                  )
                )
              }
              className="font-semibold cursor-pointer hover:underline"
            >
              {userData?.name}
            </span>
          </div>
          <div className="flex flex-col justify-start items-center gap-4 w-full">
            {navBarItems.map((item, index) => (
              <Button
                onClick={() => setIsMobileMenuActive(false)}
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
              onClick={() => setIsMobileMenuActive(false)}
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
