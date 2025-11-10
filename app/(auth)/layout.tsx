type AuthLayoutProps = {
  children?: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-b from-blue-900 to-blue-600 p-2">
      {children}
    </div>
  );
}
