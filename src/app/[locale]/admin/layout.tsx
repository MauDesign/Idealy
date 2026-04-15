import { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut, Home } from 'lucide-react';
import ThemeToggle from '@/app/ui/ThemeToggle';


export default async function AdminLayout({ children, params }: { children: ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 border-r border-base-300 hidden md:flex flex-col">
        <div className="p-6 flex items-center justify-between">
          <Link href={`/${locale}/admin`} className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content">I</span>
            Idealy Admin
          </Link>
          <ThemeToggle />
        </div>
        
        <nav className="flex-1 px-4 space-y-2">

          <Link href={`/${locale}/admin`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href={`/${locale}/admin/posts`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all font-medium">
            <FileText className="w-5 h-5" />
            Publicaciones
          </Link>
          <Link href={`/${locale}/admin/settings`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all font-medium">
            <Settings className="w-5 h-5" />
            Ajustes
          </Link>
        </nav>

        <div className="p-4 border-t border-base-300">
          <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-all text-base-content/60">
            <Home className="w-5 h-5" />
            Volver a la web
          </Link>
          <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-error/10 hover:text-error transition-all text-base-content/60">
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-8 md:hidden">
            <Link href={`/${locale}/admin`} className="font-bold text-primary">Idealy Admin</Link>
            <ThemeToggle />
        </header>


        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
