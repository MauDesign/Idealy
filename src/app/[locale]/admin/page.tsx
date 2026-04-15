import { Plus, FileText, ChevronRight, Eye, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Stat data (hardcoded for now, will be dynamic later)
  const stats = [
    { label: 'Total Publicaciones', value: '0', icon: FileText, color: 'text-blue-500' },
    { label: 'Visitas Totales', value: '0', icon: Eye, color: 'text-green-500' },
    { label: 'Comentarios', value: '0', icon: MessageSquare, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/60">Bienvenido de nuevo, administrador.</p>
        </div>
        <Link href={`/${locale}/admin/posts/new`} className="btn btn-primary gap-2 rounded-xl">
          <Plus className="w-5 h-5" />
          Nueva Publicación
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card bg-base-100 shadow-sm border border-base-300 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/50 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-4xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl bg-base-200 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
            <div className="px-6 py-3 bg-base-200/50 flex items-center justify-between text-sm font-medium text-primary hover:bg-base-200 transition-colors cursor-pointer">
              Ver detalles
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Empty State */}
      <div className="card bg-base-100 shadow-sm border border-base-300 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-base-300 flex items-center justify-between">
          <h2 className="text-xl font-bold">Publicaciones Recientes</h2>
          <Link href={`/${locale}/admin/posts`} className="text-sm text-primary hover:underline font-medium">Ver todas</Link>
        </div>
        <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center text-base-content/20">
            <FileText className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No hay publicaciones todavía</h3>
            <p className="text-base-content/60 max-w-xs">Comienza a crear contenido para posicionar tu sitio y atraer clientes.</p>
          </div>
          <Link href={`/${locale}/admin/posts/new`} className="btn btn-primary btn-outline rounded-xl px-8">
            Crear mi primera entrada
          </Link>
        </div>
      </div>
    </div>
  );
}
