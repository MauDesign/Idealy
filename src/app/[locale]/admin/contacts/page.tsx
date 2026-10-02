import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Mail, Search, Filter, MessageSquare, Calendar, User, ExternalLink, Phone } from 'lucide-react';

export const metadata = {
  title: 'Mensajes de Contacto | Admin Idealy',
  description: 'Historial de mensajes de contacto recibidos desde la página principal.',
};

export default async function ContactsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;

  const contacts = await prisma.contact.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalContacts = contacts.length;

  const filteredContacts = contacts.filter((contact) => {
    const query = q.toLowerCase().trim();
    return (
      !query ||
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      (contact.whatsapp && contact.whatsapp.toLowerCase().includes(query)) ||
      contact.subject.toLowerCase().includes(query) ||
      contact.message.toLowerCase().includes(query)
    );
  });

  const formatDate = (d: Date) => {
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
            <span className="badge badge-primary font-bold text-xs">PÁGINA PRINCIPAL</span>
            <span className="text-xs text-base-content/60 font-medium">Buzón de Mensajes</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos de la Web</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Todos los mensajes de contacto guardados en la base de datos desde el formulario principal.
          </p>
        </div>

        <Link
          href="/#contact"
          target="_blank"
          className="btn btn-outline btn-sm rounded-xl gap-2 text-xs font-bold self-start md:self-auto"
        >
          <ExternalLink className="w-4 h-4" />
          Ver Formulario en Vivo
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="card bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Total Mensajes</p>
              <h3 className="text-3xl font-extrabold mt-1">{totalContacts}</h3>
              <p className="text-xs text-primary font-semibold mt-1">Guardados en Base de Datos</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-base-300 bg-base-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form method="GET" className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Buscar por nombre, email, WhatsApp, asunto..."
                className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
              />
            </div>

            <button type="submit" className="btn btn-sm btn-primary rounded-xl text-xs font-bold gap-1">
              <Filter className="w-3.5 h-3.5" />
              Buscar
            </button>
          </form>

          <span className="text-xs font-semibold text-base-content/60">
            Mostrando {filteredContacts.length} de {totalContacts} mensajes
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="table w-full text-left">
            <thead>
              <tr className="bg-base-200/50 text-xs font-bold uppercase tracking-wider text-base-content/60">
                <th className="py-4 px-5">Contacto</th>
                <th className="py-4 px-5">Email</th>
                <th className="py-4 px-5">WhatsApp</th>
                <th className="py-4 px-5">Asunto</th>
                <th className="py-4 px-5">Mensaje</th>
                <th className="py-4 px-5">Fecha</th>
                <th className="py-4 px-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 text-sm">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-base-content/50">
                    No se encontraron mensajes de contacto.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const waClean = contact.whatsapp ? getCleanWhatsapp(contact.whatsapp) : null;
                  const waUrl = waClean
                    ? `https://wa.me/${waClean}?text=${encodeURIComponent(
                        `Hola ${contact.name}, te saludo de Idealy sobre tu mensaje: "${contact.subject}"`
                      )}`
                    : null;

                  return (
                    <tr key={contact.id} className="hover:bg-base-200/30 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-base-content flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          {contact.name}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <a
                          href={`mailto:${contact.email}`}
                          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline text-xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {contact.email}
                        </a>
                      </td>
                      <td className="py-4 px-5">
                        {contact.whatsapp && waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl text-xs transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {contact.whatsapp}
                          </a>
                        ) : (
                          <span className="text-xs text-base-content/40 font-medium">-</span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-semibold text-xs text-base-content/90 max-w-[200px] truncate">
                        {contact.subject}
                      </td>
                      <td className="py-4 px-5 text-xs text-base-content/70 max-w-[250px]">
                        <p className="line-clamp-2" title={contact.message}>
                          {contact.message}
                        </p>
                      </td>
                      <td className="py-4 px-5 text-xs text-base-content/60 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <a
                          href={`mailto:${contact.email}?subject=RE: ${encodeURIComponent(contact.subject)}`}
                          className="btn btn-ghost btn-xs text-primary font-bold gap-1 rounded-lg"
                        >
                          Responder
                        </a>
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
