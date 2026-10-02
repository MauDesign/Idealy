import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Download, CheckCircle, Clock, Phone, Search, ExternalLink, Filter, Sparkles, Award, Tag } from 'lucide-react';
import RedeemStatusToggle from '@/app/ui/admin/RedeemStatusToggle';

export const metadata = {
  title: 'Leads Página Express | Admin Idealy',
  description: 'Historial de leads, descargas de PDF, certificados y redención de clientes de Página Express.',
};

export default async function ExpressLeadsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = '', status = 'all' } = await searchParams;

  const leads = await prisma.expressLead.findMany({
    include: {
      certificate: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // KPI Calculations
  const totalLeads = leads.length;
  const pdfDownloadedCount = leads.filter((l) => l.hasDownloadedPdf).length;
  const certDownloadedCount = leads.filter((l) => l.hasDownloadedCert).length;
  const redeemedCount = leads.filter((l) => l.isRedeemed).length;
  const highPriorityCount = leads.filter((l) => l.urgencia?.toLowerCase().includes('semana')).length;

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const query = q.toLowerCase().trim();
    const matchesSearch =
      !query ||
      lead.nombre.toLowerCase().includes(query) ||
      lead.nombreNegocio.toLowerCase().includes(query) ||
      lead.whatsapp.includes(query) ||
      (lead.folioCode && lead.folioCode.toLowerCase().includes(query));

    const matchesStatus =
      status === 'all' ||
      (status === 'pdf_downloaded' && lead.hasDownloadedPdf) ||
      (status === 'cert_downloaded' && lead.hasDownloadedCert) ||
      (status === 'redeemed' && lead.isRedeemed) ||
      (status === 'pending' && !lead.hasDownloadedPdf && !lead.hasDownloadedCert && !lead.isRedeemed);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (d?: Date | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCleanWhatsapp = (wa: string) => {
    const clean = wa.replace(/\D/g, '');
    return clean.startsWith('52') ? clean : `52${clean}`;
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-primary font-bold text-xs">PÁGINA EXPRESS</span>
            <span className="text-xs text-base-content/60 font-medium">Panel de Control de Leads</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Historial de Leads, Certificados y Redenciones</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Seguimiento en tiempo real de prospectos, descargas de PDF Guía, Certificados y control de redención.
          </p>
        </div>

        <Link
          href="/pagina-express"
          target="_blank"
          className="btn btn-outline btn-sm rounded-xl gap-2 text-xs font-bold self-start md:self-auto"
        >
          <ExternalLink className="w-4 h-4" />
          Ver Landing Page
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Total Leads</p>
              <h3 className="text-3xl font-extrabold mt-1">{totalLeads}</h3>
              <p className="text-xs text-warning font-semibold mt-1">{highPriorityCount} urgentes (esta semana)</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">PDF Guía Descargados</p>
              <h3 className="text-3xl font-extrabold text-success mt-1">{pdfDownloadedCount}</h3>
              <p className="text-xs text-success font-semibold mt-1">
                {totalLeads > 0 ? Math.round((pdfDownloadedCount / totalLeads) * 100) : 0}% de los leads
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center font-bold">
              <Download className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Certificados Descargados</p>
              <h3 className="text-3xl font-extrabold text-info mt-1">{certDownloadedCount}</h3>
              <p className="text-xs text-info font-semibold mt-1">
                {totalLeads > 0 ? Math.round((certDownloadedCount / totalLeads) * 100) : 0}% de los leads
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-info/10 text-info flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Certificados Utilizados</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{redeemedCount}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Redimidos / Venta cerrada</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Tag className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-base-300 bg-base-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form method="GET" className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Buscar por cliente, negocio, folio o WA..."
                className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
              />
            </div>

            <select
              name="status"
              defaultValue={status}
              className="select select-sm select-bordered rounded-xl text-xs font-medium"
            >
              <option value="all">Todos los estados</option>
              <option value="pdf_downloaded">📄 PDF Guía Descargado</option>
              <option value="cert_downloaded">🎖️ Certificado Descargado</option>
              <option value="redeemed">✅ Certificado Utilizado / Redimido</option>
              <option value="pending">⏳ Pendiente general</option>
            </select>

            <button type="submit" className="btn btn-sm btn-primary rounded-xl text-xs font-bold gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filtrar
            </button>
          </form>

          <span className="text-xs font-semibold text-base-content/60">
            Mostrando {filteredLeads.length} de {totalLeads} leads
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="table w-full text-left">
            <thead>
              <tr className="bg-base-200/50 text-xs font-bold uppercase tracking-wider text-base-content/60">
                <th className="py-4 px-5">Folio</th>
                <th className="py-4 px-5">Cliente y Negocio</th>
                <th className="py-4 px-5">WhatsApp</th>
                <th className="py-4 px-5">PDF Guía</th>
                <th className="py-4 px-5">Certificado PDF</th>
                <th className="py-4 px-5">Uso / Redención</th>
                <th className="py-4 px-5">Urgencia</th>
                <th className="py-4 px-5">Fecha Registro</th>
                <th className="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 text-sm">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-base-content/50">
                    No se encontraron leads con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const folioDisplay = lead.folioCode || (lead.folio ? `PE-${String(lead.folio).padStart(4, '0')}` : 'PE-0000');
                  const waClean = getCleanWhatsapp(lead.whatsapp);
                  const waMessage = encodeURIComponent(
                    `Hola ${lead.nombre}, te saludo de Idealy. Vi tu solicitud para la Página Express de *${lead.nombreNegocio}* (Folio ${folioDisplay}). ¿Tuviste oportunidad de revisar la guía y tu certificado?`
                  );
                  const waUrl = `https://wa.me/${waClean}?text=${waMessage}`;
                  const downloadPageUrl = `/pagina-express/descarga?leadId=${lead.id}`;

                  return (
                    <tr key={lead.id} className="hover:bg-base-200/30 transition-colors">
                      {/* Folio */}
                      <td className="py-4 px-5 font-bold">
                        <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                          {folioDisplay}
                        </span>
                      </td>

                      {/* Cliente y Negocio */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-base-content">{lead.nombreNegocio}</div>
                        <div className="text-xs text-base-content/60 font-medium">Atn. {lead.nombre}</div>
                        {lead.dedicacion && (
                          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 mt-1 rounded-md bg-base-200 text-base-content/70">
                            {lead.dedicacion}
                          </span>
                        )}
                      </td>

                      {/* WhatsApp Contact */}
                      <td className="py-4 px-5">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-xs transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {lead.whatsapp}
                        </a>
                      </td>

                      {/* PDF Guía */}
                      <td className="py-4 px-5">
                        {lead.hasDownloadedPdf ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                              <CheckCircle className="w-3 h-3" />
                              Descargado
                            </span>
                            <div className="text-[10px] text-base-content/50 font-medium">
                              {formatDate(lead.downloadedAt)}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-base-200 text-base-content/50">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                      </td>

                      {/* Certificado PDF */}
                      <td className="py-4 px-5">
                        {lead.hasDownloadedCert ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-info/15 text-info border border-info/30">
                              <Award className="w-3 h-3" />
                              Descargado
                            </span>
                            <div className="text-[10px] text-base-content/50 font-medium">
                              {formatDate(lead.certDownloadedAt)}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-base-200 text-base-content/50">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                      </td>

                      {/* Certificado Redimido / Marcar Utilizado */}
                      <td className="py-4 px-5">
                        <RedeemStatusToggle
                          leadId={lead.id}
                          initialIsRedeemed={lead.isRedeemed}
                          initialRedeemedAt={lead.redeemedAt}
                        />
                      </td>

                      {/* Urgencia */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold ${
                            lead.urgencia?.toLowerCase().includes('semana')
                              ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                              : 'bg-base-200 text-base-content/70'
                          }`}
                        >
                          {lead.urgencia || 'Normal'}
                        </span>
                      </td>

                      {/* Fecha Registro */}
                      <td className="py-4 px-5 text-xs text-base-content/60 font-medium">
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-5 text-right space-x-2">
                        <Link
                          href={downloadPageUrl}
                          target="_blank"
                          className="btn btn-ghost btn-xs text-primary font-bold gap-1 rounded-lg"
                          title="Ver enlace personal de descarga"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Link Personal
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
