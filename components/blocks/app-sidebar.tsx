'use client';

import * as React from 'react';
import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-react';

import { NavMain } from '@/components/blocks/nav-main';
import { NavUser } from '@/components/blocks/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import Image from 'next/image';

const data = {
  user: {
    name: 'Rafael Horauti',
    email: 'rafael.horauti@gmail.com',
    avatar: '/teste1.jpeg',
  },
  navMain: [
    {
      title: 'Postagens',
      url: 'posts',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Sugestões',
          url: '/suggestions',
        },
        {
          title: 'Q/A',
          url: '/question-answers',
        },
        {
          title: 'Market Place',
          url: '/market-place',
        },
        {
          title: 'Avisos',
          url: '/bulletin-board',
        },
      ],
    },
    {
      title: 'FAQ',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Escrito',
          url: '#',
        },
        {
          title: 'Vídeos',
          url: '#',
        },
      ],
    },
    {
      title: 'Eventos',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Assembléias',
          url: '#',
        },
        {
          title: 'Comemorações',
          url: '#',
        },
        {
          title: 'Feira livre',
          url: '#',
        },
      ],
    },
    {
      title: 'Financeiro',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Mensalidades',
          url: '#',
        },
        {
          title: 'Relatórios',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              className="self-center w-auto h-auto"
              src="/Logo_fundo_branco.jpg"
              alt="Logo"
              width={140}
              height={120}
              priority
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">ConectaCondo</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
