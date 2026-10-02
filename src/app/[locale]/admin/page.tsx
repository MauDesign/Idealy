import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, FileText, ChevronRight, Users, Download, Sparkles, CheckCircle, ExternalLink, Phone, Award, Tag } from 'lucide-react';
import RedeemStatusToggle from '@/app/ui/admin/RedeemStatusToggle';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Real Database Stats
  const [totalLeadsCount, pdfDownloadedCount, certDownloadedCount, redeemedCount, postsCount, recentLeads] = await Promise.all([
    prisma.expressLead.count().catch(() => 0),
    prisma.expressLead.count({ where: { hasDownloadedPdf: true } }).catch(() => 0),
    prisma.expressLead.count({ where: { hasDownloadedCert: true } }).catch(() => 0),
    prisma.expressLead.count({ where: { isRedeemed: true } }).catch(() => 0),
    prisma.post.count().catch(() => 0),
    prisma.expressLead.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { certificate: true },
    }).catch(() => []),
  ]);

  const stats = [
    {
      label: 'Leads Página Express',
      value: String(totalLeadsCount),
      subtext: `${pdfDownloadedCount} descargaron la guía`,
      icon: Users,
      color: 'text-[#00b4a6]',
      link: `/${locale}/admin/express-leads`,
    },
    {
      label: 'Certificados Descargados',
      value: String(certDownloadedCount),
      subtext: `${totalLeadsCount > 0 ? Math.round((certDownloadedCount / totalLeadsCount) * 100) : 0}% del total`,
      icon: Award,
      color: 'text-info',
      link: `/${locale}/admin/express-leads?status=cert_downloaded`,
    },
    {
      label: 'Certificados Utilizados',
      value: String(redeemedCount),
      subtext: `${totalLeadsCount > 0 ? Math.round((redeemedCount / totalLeadsCount) * 100) : 0}% ventas cerradas`,
      icon: Tag,
      color: 'text-emerald-500',
      link: `/${locale}/admin/express-leads?status=redeemed`,
    },
    {
      label: 'Publicaciones Blog',
      value: String(postsCount),
      subtext: 'Artículos publicados',
      icon: FileText,
      color: 'text-blue-500',
      link: `/${locale}/admin/posts`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-base-content/60">Bienvenido de nuevo. Monitorea los leads de Página Express y redenciones.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/admin/express-leads`} className="btn btn-primary gap-2 rounded-xl">
            <Users className="w-5 h-5" />
            Ver Leads Express
          </Link>
          <Link href={`/${locale}/admin/posts/new`} className="btn btn-outline gap-2 rounded-xl">
            <Plus className="w-5 h-5" />
            Nueva Entrada
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="card bg-base-100 shadow-xs border border-base-300 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-extrabold mt-1">{stat.value}</h3>
                <p className="text-xs text-base-content/60 mt-1 font-medium">{stat.subtext}</p>
              </div>
              <div className={`p-3.5 rounded-2xl bg-base-200 ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
            <Link
              href={stat.link}
              className="px-5 py-2.5 bg-base-200/50 flex items-center justify-between text-xs font-bold text-primary hover:bg-base-200 transition-colors border-t border-base-200"
            >
              <span>Ver reporte</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Express Leads */}
      <div className="card bg-base-100 shadow-xs border border-base-300 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Últimos Leads de Página Express</h2>
          </div>
          <Link href={`/${locale}/admin/express-leads`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>Ver todos ({totalLeadsCount})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <Users className="w-10 h-10 text-base-content/30" />
            <h3 className="text-base font-bold">Aún no hay leads registrados</h3>
            <p className="text-xs text-base-content/60">Los prospectos que llenen el formulario aparecerán aquí en tiempo real.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full text-left text-xs">
              <thead>
                <tr className="bg-base-200/50 uppercase tracking-wider text-base-content/60 font-bold">
                  <th className="py-3.5 px-5">Folio</th>
                  <th className="py-3.5 px-5">Cliente / Negocio</th>
                  <th className="py-3.5 px-5">WhatsApp</th>
                  <th className="py-3.5 px-5">Guía PDF</th>
                  <th className="py-3.5 px-5">Certificado PDF</th>
                  <th className="py-3.5 px-5">Estado Redención</th>
                  <th className="py-3.5 px-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 font-medium">
                {recentLeads.map((lead) => {
                  const folioDisplay = lead.folioCode || (lead.folio ? `PE-${String(lead.folio).padStart(4, '0')}` : 'PE-0000');
                  const waClean = lead.whatsapp.replace(/\D/g, '');
                  const formattedWa = waClean.startsWith('52') ? waClean : `52${waClean}`;
                  const downloadUrl = `/pagina-express/descarga?leadId=${lead.id}`;

                  return (
                    <tr key={lead.id} className="hover:bg-base-200/40 transition-colors">
                      <td className="py-3.5 px-5 font-bold">
                        <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                          {folioDisplay}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-base-content text-sm">{lead.nombreNegocio}</div>
                        <div className="text-base-content/60">{lead.nombre}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <a
                          href={`https://wa.me/${formattedWa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {lead.whatsapp}
                        </a>
                      </td>
                      <td className="py-3.5 px-5">
                        {lead.hasDownloadedPdf ? (
                          <span className="badge badge-success badge-sm gap-1 font-bold">
                            <CheckCircle className="w-3 h-3" /> Sí
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-sm text-base-content/60 font-semibold">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        {lead.hasDownloadedCert ? (
                          <span className="badge badge-info badge-sm gap-1 font-bold">
                            <Award className="w-3 h-3" /> Sí
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-sm text-base-content/60 font-semibold">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <RedeemStatusToggle
                          leadId={lead.id}
                          initialIsRedeemed={lead.isRedeemed}
                          initialRedeemedAt={lead.redeemedAt}
                          compact={true}
                        />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={downloadUrl}
                          target="_blank"
                          className="btn btn-ghost btn-xs text-primary font-bold gap-1"
                        >
                          Link Personal
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
