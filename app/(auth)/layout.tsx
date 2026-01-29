type AuthLayoutProps = {
  children?: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <main className="flex flex-col min-h-screen justify-center items-center p-1">
        {children}
      </main>
    </>
  );
}
