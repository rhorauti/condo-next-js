'use client';

import React, { useEffect, useState } from 'react';
import {
  MessagesSquare,
  CalendarDays,
  Users,
  Sparkles,
  ShieldCheck,
  Rocket,
  LogIn,
  Menu,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { WEB_ROUTES } from '@/enum/web/routes.enum';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  className: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Componente principal da Landing Page
 * Este é o único arquivo necessário.
 */
export default function Page() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Componente de Card para as features
  const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <div className="flex flex-col items-center p-6 text-center rounded-2xl bg-primary text-white shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );

  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen font-sans antialiased">
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full py-4 backdrop-blur-lg shadow-sm bg-gray-900 text-white">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:from-blue-700 group-hover:to-blue-800 transition">
              <span className="font-bold text-lg">C</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">
              ConectaCondo
            </span>
          </Link>

          {/* --- Menu Desktop --- */}
          <div className="flex items-center gap2">
            <nav className="hidden gap-4 md:flex">
              <div className="flex items-center gap-2">
                {!mounted ? (
                  <Button variant="default" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setTheme('light')}
                        className={cn('py-[0.2rem]')}
                      >
                        <Button
                          variant="default"
                          size="sm"
                          className={cn(
                            'flex gap-2 justify-start items-center w-full hover:text-white'
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
                          variant="default"
                          size="sm"
                          className={cn(
                            'flex gap-2 justify-start items-center w-full hover:text-white'
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
                          variant="default"
                          size="sm"
                          className={cn(
                            'flex gap-2 justify-start items-center w-full hover:text-white'
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
              </div>
              <Link href={WEB_ROUTES.LOGIN}>
                <Button variant={'default'}>
                  <LogIn size={18} />
                  Acessar
                </Button>
              </Link>
            </nav>

            {/* --- Botão Menu Mobile --- */}
            <button
              className="p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* --- Seção Hero --- */}
      <main className="container mx-auto">
        <section className="flex items-center justify-center pt-12 text-center md:pt-12">
          <div className="container px-4">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              A nova forma de viver em comunidade.
            </h2>
            <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl">
              Revolucione a{' '}
              <span className="font-semibold text-blue-600">comunicação</span> e
              promova o{' '}
              <span className="font-semibold text-blue-600">bem-estar</span> no
              seu condomínio. Tudo em um só lugar, na palma da sua mão.
            </p>
          </div>
        </section>

        {/* --- Seção de Funcionalidades --- */}
        <section id="features" className="py-12 md:py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                Uma nova forma de interação
              </h3>
              <p className="mt-4 text-lg">
                Chega de grupos de WhatsApp perdidos. Centralize tudo que é
                importante.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
              <FeatureCard
                icon={<MessagesSquare size={32} />}
                title="Comunicação Direta"
                description="Mural de avisos oficial, enquetes rápidas e canal direto com o síndico e administração."
              />
              <FeatureCard
                icon={<CalendarDays size={32} />}
                title="Gestão do Bem-Estar"
                description="Reserve o salão de festas, academia ou churrasqueira online, sem burocracia."
              />
              <FeatureCard
                icon={<Users size={32} />}
                title="Integração Social"
                description="Crie eventos, grupos de interesse (corrida, pets, etc.) e um mural de classificados interno."
              />
            </div>
          </div>
        </section>

        {/* --- Seção de Vantagens --- */}
        <section id="benefits" className="py-12 md:py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-semibold text-blue-600 uppercase">
                Vantagens
              </span>
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                Por que seu condomínio precisa disso?
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
              <FeatureCard
                icon={<Sparkles size={32} />}
                title="Mais Harmonia"
                description="Reduza atritos com comunicação clara, regras acessíveis e mediação de conflitos facilitada."
              />
              <FeatureCard
                icon={<ShieldCheck size={32} />}
                title="Gestão Transparente"
                description="Acompanhe as decisões, manutenções e finanças de forma transparente e participe ativamente."
              />
              <FeatureCard
                icon={<Rocket size={32} />}
                title="Resolução Rápida"
                description="Abra e acompanhe chamados para problemas (vazamentos, limpeza) de forma ágil e documentada."
              />
            </div>
          </div>
        </section>

        {/* --- Seção Final CTA --- */}
        <section className="py-12 text-center">
          <div className="mx-auto">
            <h3 className="text-3xl font-extrabold md:text-4xl">
              Pronto para transformar seu condomínio?
            </h3>
            <p className="max-w-2xl mx-auto mt-4 text-lg">
              Junte-se a nós e descubra como a tecnologia pode criar um ambiente
              mais colaborativo, organizado e feliz para todos.
            </p>
            <div className="mt-10">
              <Link href={WEB_ROUTES.LOGIN}>
                <Button
                  variant={'default'}
                  className={cn('text-[1.5rem] px-10 py-8')}
                >
                  <LogIn size={18} />
                  Entrar ou criar conta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-10 bg-gray-800 text-white">
        <div className="container px-4 mx-auto text-center">
          <p>© 2024 ConectaCondo. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">
            Promovendo o bem-estar e a comunicação no seu lar.
          </p>
        </div>
      </footer>
    </div>
  );
}
