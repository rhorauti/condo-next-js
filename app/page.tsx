'use client';

import React from 'react';
import {
  MessagesSquare,
  CalendarDays,
  Users,
  Sparkles,
  ShieldCheck,
  Rocket,
  LogIn,
  Menu, // Para o menu mobile
} from 'lucide-react';

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

  // Um componente de link/botão reutilizável
  // Usamos uma tag <a> para "direcionar" para o login
  const ButtonLink = ({
    href,
    children,
    variant = 'primary',
    className = '',
  }: ButtonLinkProps) => {
    const baseStyle =
      'inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105';

    const styles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary:
        'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50',
    };

    return (
      <a href={href} className={`${baseStyle} ${styles[variant]} ${className}`}>
        {children}
      </a>
    );
  };

  // Componente de Card para as features
  const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <div className="flex flex-col items-center p-6 text-center bg-white rounded-2xl shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-center w-16 h-16 mb-4 text-blue-600 bg-blue-100 rounded-full">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen font-sans antialiased text-gray-900 bg-gray-50">
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full py-4 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <h1 className="text-3xl font-bold text-blue-600">ConectaCondo</h1>

          {/* --- Menu Desktop --- */}
          <nav className="hidden gap-4 md:flex">
            <a
              href="#features"
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Funcionalidades
            </a>
            <a
              href="#benefits"
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Vantagens
            </a>
            <ButtonLink href="/login" variant="primary" className="py-2 px-5">
              <LogIn size={18} />
              Acessar
            </ButtonLink>
          </nav>

          {/* --- Botão Menu Mobile --- */}
          <button
            className="p-2 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            <Menu className="text-gray-700" />
          </button>
        </div>

        {/* --- Menu Mobile (Dropdown) --- */}
        {isMobileMenuOpen && (
          <nav className="flex flex-col px-4 pt-2 pb-4 space-y-3 md:hidden">
            <a
              href="#features"
              className="block px-3 py-2 font-medium text-gray-600 rounded-lg hover:bg-blue-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Funcionalidades
            </a>
            <a
              href="#benefits"
              className="block px-3 py-2 font-medium text-gray-600 rounded-lg hover:bg-blue-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Vantagens
            </a>
            <ButtonLink href="/login" variant="primary" className="w-full">
              <LogIn size={18} />
              Acessar
            </ButtonLink>
          </nav>
        )}
      </header>

      {/* --- Seção Hero --- */}
      <main>
        <section className="flex items-center justify-center py-24 text-center bg-white md:py-32">
          <div className="container px-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              A nova forma de viver em comunidade.
            </h2>
            <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 md:text-xl">
              Revolucione a{' '}
              <span className="font-semibold text-blue-600">comunicação</span> e
              promova o{' '}
              <span className="font-semibold text-blue-600">bem-estar</span> no
              seu condomínio. Tudo em um só lugar, na palma da sua mão.
            </p>
            <div className="mt-10">
              <ButtonLink href="/login" variant="primary" className="text-lg">
                Acessar a Plataforma
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* --- Seção de Funcionalidades --- */}
        <section id="features" className="py-20 bg-blue-50/50 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-semibold text-blue-600 uppercase">
                Interação
              </span>
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                Uma nova forma de interação
              </h3>
              <p className="mt-4 text-lg text-gray-600">
                Chega de grupos de WhatsApp perdidos. Centralize tudo que é
                importante.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-3">
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
        <section id="benefits" className="py-20 bg-white md:py-24">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-semibold text-blue-600 uppercase">
                Vantagens
              </span>
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                Por que seu condomínio precisa disso?
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-3">
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
        <section className="py-24 text-center bg-blue-600">
          <div className="container px-4">
            <h3 className="text-3xl font-extrabold text-white md:text-4xl">
              Pronto para transformar seu condomínio?
            </h3>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-blue-100">
              Junte-se a nós e descubra como a tecnologia pode criar um ambiente
              mais colaborativo, organizado e feliz para todos.
            </p>
            <div className="mt-10">
              <ButtonLink href="/login" variant="secondary" className="text-lg">
                <LogIn size={20} />
                Entrar ou Criar Conta
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-10 bg-gray-800 text-gray-400">
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
