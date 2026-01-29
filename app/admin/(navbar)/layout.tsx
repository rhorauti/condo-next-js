import AdminNavbar from '@/components/navbar/navbar.admin';

type AdminHomeLayoutProps = {
  children?: React.ReactNode;
};

export default function AdminHomeLayout({ children }: AdminHomeLayoutProps) {
  return (
    <div className="flex flex-col gap-4">
      <AdminNavbar />
      <div className="flex justify-center p-2 container mx-auto">
        {children}
      </div>
    </div>
  );
}
