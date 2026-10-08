'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, Send, Eye, CheckCircle2, AlertCircle, RefreshCw, 
  Users, Sparkles, Monitor, Smartphone, FileText, ChevronDown, ChevronUp, Copy, Check, ShieldCheck, Lock
} from 'lucide-react';

interface Recipient {
  id: string;
  email: string;
  name?: string;
  status: string;
  openedAt?: string;
  openedCount: number;
  sentAt?: string;
  errorMessage?: string;
}

interface Campaign {
  id: string;
  title: string;
  subject: string;
  preheader?: string;
  senderName: string;
  senderEmail: string;
  status: string;
  totalSent: number;
  totalOpened: number;
  totalFailed: number;
  createdAt: string;
  sentAt?: string;
  recipients: Recipient[];
}

export default function AdminBoletinPage() {
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Campaign Form State
  const [subject, setSubject] = useState('Factura, controla asistencias y vende más desde un solo lugar');
  const [preheader, setPreheader] = useState('Facturación CFDI 4.0 desde $290, checador digital y tu página web en 5 días.');
  const [senderName, setSenderName] = useState('Leo de Idealy');
  const [senderEmail, setSenderEmail] = useState('hello@idealy.com.mx');
  const [toAddress, setToAddress] = useState('pymes@idealy.com.mx');
  const [useBcc, setUseBcc] = useState(true);
  const [recipientInput, setRecipientInput] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Stats & History
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({ totalCampaigns: 0, totalSent: 0, totalOpened: 0, openRate: 0 });
  const [contactsCount, setContactsCount] = useState(0);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Subject line presets
  const subjectPresets = [
    'Factura, controla asistencias y vende más desde un solo lugar',
    '¿Tu empresa ya está lista para el registro electrónico de jornada?',
    '5 soluciones para que tu negocio deje de perder tiempo (y dinero)'
  ];

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/boletin');
      const data = await res.json();
      if (res.ok) {
        setCampaigns(data.campaigns || []);
        setStats(data.stats || { totalCampaigns: 0, totalSent: 0, totalOpened: 0, openRate: 0 });
        setContactsCount(data.contacts?.length || 0);
        if (data.defaultHtml) {
          setHtmlContent(data.defaultHtml);
        }
        // Pre-fill recipient contacts if input is empty
        if (data.contacts && data.contacts.length > 0 && !recipientInput) {
          const emails = data.contacts.map((c: any) => c.email).join('\n');
          setRecipientInput(emails);
        }
      }
    } catch (err) {
      console.error('Error fetching boletin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare iframe HTML preview replacing relative/production URLs with current local origin
  const getProcessedPreviewHtml = () => {
    if (!htmlContent) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return htmlContent
      .replace(/src="https:\/\/idealy\.com\.mx\/img\//g, `src="${origin}/img/`)
      .replace(/src="\/img\//g, `src="${origin}/img/`)
      .replace(/src="img\//g, `src="${origin}/img/`);
  };

  // Submit & Dispatch Campaign
  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Parse recipient input lines or commas
    const rawEmails = recipientInput
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes('@'));

    if (rawEmails.length === 0) {
      setMessage({ type: 'error', text: 'Ingresa al menos una dirección de correo válida para el envío.' });
      return;
    }

    const recipientsList = Array.from(new Set(rawEmails)).map((email) => ({ email }));

    setSending(true);
    try {
      const res = await fetch('/api/admin/boletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: subject,
          subject,
          preheader,
          senderName,
          senderEmail,
          toAddress,
          useBcc,
          htmlContent,
          recipientsList,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'Campaña procesada exitosamente.' });
        fetchData();
        setActiveTab('history');
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al procesar la campaña.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Ocurrió un error inesperado al enviar.' });
    } finally {
      setSending(false);
    }
  };

  const copyTemplateUrl = () => {
    const url = `${window.location.origin}/templates/boletin_pyme_idealy.html`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-base-300 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content flex items-center gap-3">
            <Mail className="w-8 h-8 text-primary" />
            Gestor de Boletines y Campañas
          </h1>
          <p className="text-base-content/70 mt-1">
            Envía el boletín oficial de Idealy a tus prospectos con envío seguro CCO y mide lecturas en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn btn-outline btn-sm gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={copyTemplateUrl}
            className="btn btn-primary btn-sm gap-2"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedLink ? '¡Copiado!' : 'Copiar URL Plantilla'}
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 border border-base-300 rounded-xl shadow-sm">
          <div className="stat-figure text-primary">
            <Send className="w-7 h-7" />
          </div>
          <div className="stat-title font-medium">Campañas Creadas</div>
          <div className="stat-value text-primary">{stats.totalCampaigns}</div>
          <div className="stat-desc">Envíos masivos registrados</div>
        </div>

        <div className="stat bg-base-100 border border-base-300 rounded-xl shadow-sm">
          <div className="stat-figure text-secondary">
            <Users className="w-7 h-7" />
          </div>
          <div className="stat-title font-medium">Correos Despachados</div>
          <div className="stat-value text-secondary">{stats.totalSent}</div>
          <div className="stat-desc">Total destinatarios procesados</div>
        </div>

        <div className="stat bg-base-100 border border-base-300 rounded-xl shadow-sm">
          <div className="stat-figure text-success">
            <Eye className="w-7 h-7" />
          </div>
          <div className="stat-title font-medium">Aperturas Únicas</div>
          <div className="stat-value text-success">{stats.totalOpened}</div>
          <div className="stat-desc">Rastreadas vía Pixel 👁️</div>
        </div>

        <div className="stat bg-base-100 border border-base-300 rounded-xl shadow-sm">
          <div className="stat-figure text-warning">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="stat-title font-medium">Tasa de Apertura</div>
          <div className="stat-value text-warning">{stats.openRate}%</div>
          <div className="stat-desc">Porcentaje global de lectura</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200 p-1.5 rounded-xl max-w-md">
        <button
          className={`tab flex-1 font-bold ${activeTab === 'send' ? 'tab-active btn-primary' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          🚀 Configurar & Enviar
        </button>
        <button
          className={`tab flex-1 font-bold ${activeTab === 'history' ? 'tab-active btn-primary' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 Historial & Métricas
        </button>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} shadow-sm`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* TAB 1: NUEVO ENVÍO */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-6 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Parámetros de la Campaña
            </h2>

            <form onSubmit={handleSendCampaign} className="space-y-5">
              {/* Remitente & De que correo saldrá */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Nombre del Remitente</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Leo de Idealy"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Correo de Salida (Desde)</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="hello@idealy.com.mx"
                    required
                  />
                </div>
              </div>

              {/* Para (To visible) & CCO Toggle */}
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Destinatario Visible (Campo "Para / To")</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    placeholder="pymes@idealy.com.mx"
                    required
                  />
                  <span className="text-xs text-base-content/60 mt-1">
                    Es la dirección pública visible en la cabecera del correo para proteger los correos de tus clientes.
                  </span>
                </div>

                {/* CCO Checkbox Card */}
                <div className="p-4 bg-base-200/60 rounded-xl border border-base-300 flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary mt-1"
                    checked={useBcc}
                    onChange={(e) => setUseBcc(e.target.checked)}
                    id="useBcc"
                  />
                  <label htmlFor="useBcc" className="cursor-pointer text-sm">
                    <span className="font-bold text-base-content block flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      Activar Envío CCO (BCC - Correos Ocultos)
                    </span>
                    <span className="text-xs text-base-content/70 block mt-0.5">
                      Oculta la lista completa de destinatarios para que ningún cliente vea los correos de otros. Evita ser detectado como spam/publicidad y mejora la llegada al buzón principal.
                    </span>
                  </label>
                </div>
              </div>

              {/* Asunto presets */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Asunto del Correo</span>
                </label>
                <select
                  className="select select-bordered w-full mb-2 text-xs"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {subjectPresets.map((preset, idx) => (
                    <option key={idx} value={preset}>
                      Asunto {idx + 1}: {preset}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Escribe un asunto personalizado..."
                  required
                />
              </div>

              {/* Preheader */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Preheader (Texto de vista previa)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                />
              </div>

              {/* Destinatarios */}
              <div className="form-control">
                <div className="flex justify-between items-center mb-1">
                  <label className="label p-0">
                    <span className="label-text font-bold">Lista de Correos Destinatarios (CCO)</span>
                  </label>
                  <span className="text-xs text-base-content/60">
                    {contactsCount} contactos en base de datos
                  </span>
                </div>
                <textarea
                  className="textarea textarea-bordered h-32 font-mono text-xs"
                  placeholder="ejemplo1@empresa.com&#10;ejemplo2@empresa.com"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  required
                ></textarea>
                <span className="text-xs text-base-content/60 mt-1">
                  Ingresa un correo por línea. Se añadirá automáticamente la cabecera Anti-Spam y el píxel de rastreo.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="btn btn-primary w-full gap-2 text-base font-bold shadow-md"
              >
                {sending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Despachando Campaña...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Boletín a los Destinatarios
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Live Preview Side */}
          <div className="lg:col-span-6 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-base-300 mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Vista Previa de la Plantilla
              </h2>
              <div className="join border border-base-300">
                <button
                  className={`join-item btn btn-xs gap-1 ${previewDevice === 'desktop' ? 'btn-active btn-primary' : ''}`}
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="w-3.5 h-3.5" /> Escritorio
                </button>
                <button
                  className={`join-item btn btn-xs gap-1 ${previewDevice === 'mobile' ? 'btn-active btn-primary' : ''}`}
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Móvil
                </button>
              </div>
            </div>

            {/* Email Shell Preview Container */}
            <div className="flex-1 flex justify-center bg-base-200/60 p-4 rounded-xl overflow-hidden min-h-[500px]">
              <div
                className={`transition-all duration-300 bg-white shadow-xl rounded-xl overflow-hidden border border-base-300 flex flex-col ${
                  previewDevice === 'mobile' ? 'w-[360px] h-[640px]' : 'w-full h-full'
                }`}
              >
                {/* Simulated Mail Header */}
                <div className="bg-slate-100 p-3 border-b border-slate-200 text-xs text-slate-600 space-y-1">
                  <div><strong>De:</strong> {senderName} &lt;{senderEmail}&gt;</div>
                  <div><strong>Para:</strong> {toAddress} {useBcc ? '(Destinatarios en CCO oculto 🔒)' : ''}</div>
                  <div><strong>Asunto:</strong> {subject}</div>
                  {preheader && <div className="text-slate-500 truncate"><strong>Preheader:</strong> {preheader}</div>}
                </div>

                {/* Render HTML content inside iframe */}
                <iframe
                  srcDoc={getProcessedPreviewHtml()}
                  title="Email Preview"
                  className="w-full flex-1 border-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL Y MÉTRICAS */}
      {activeTab === 'history' && (
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Historial de Campañas y Rastreo en Tiempo Real
            </h2>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Mail className="w-12 h-12 text-base-content/30 mx-auto" />
              <p className="text-base-content/70 font-medium">Aún no se han enviado campañas de correo.</p>
              <button onClick={() => setActiveTab('send')} className="btn btn-primary btn-sm">
                Crear Primera Campaña
              </button>
            </div>
          ) : (
            <div className="divide-y divide-base-200">
              {campaigns.map((camp) => {
                const isExpanded = expandedCampaignId === camp.id;
                const openPercentage = camp.totalSent > 0 ? Math.round((camp.totalOpened / camp.totalSent) * 100) : 0;

                return (
                  <div key={camp.id} className="p-6 hover:bg-base-50/50 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-base-content">{camp.subject}</span>
                          <span className={`badge ${camp.status === 'SENT' ? 'badge-success' : 'badge-warning'} font-bold`}>
                            {camp.status === 'SENT' ? 'Enviado CCO' : camp.status}
                          </span>
                        </div>
                        <p className="text-xs text-base-content/60">
                          De: {camp.senderName} ({camp.senderEmail}) · Creado: {new Date(camp.createdAt).toLocaleString('es-MX')}
                        </p>
                      </div>

                      {/* Stats badge group */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-xs text-base-content/60 font-semibold">Enviados</div>
                          <div className="font-extrabold text-base">{camp.totalSent}</div>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-success font-semibold flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Leídos
                          </div>
                          <div className="font-extrabold text-base text-success">
                            {camp.totalOpened} ({openPercentage}%)
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedCampaignId(isExpanded ? null : camp.id)}
                          className="btn btn-ghost btn-sm gap-1"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          Detalles Destinatarios
                        </button>
                      </div>
                    </div>

                    {/* Expanded Recipient Tracking Details */}
                    {isExpanded && (
                      <div className="mt-6 pt-4 border-t border-base-200 bg-base-200/40 p-4 rounded-xl">
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          Rastreo Individual por Destinatario ({camp.recipients.length})
                        </h4>

                        <div className="overflow-x-auto">
                          <table className="table table-sm w-full bg-base-100 rounded-lg shadow-xs">
                            <thead>
                              <tr>
                                <th>Destinatario</th>
                                <th>Estado Envío</th>
                                <th>Lectura (Píxel)</th>
                                <th>Veces Abierto</th>
                                <th>Fecha Lectura</th>
                              </tr>
                            </thead>
                            <tbody>
                              {camp.recipients.map((rec) => (
                                <tr key={rec.id}>
                                  <td className="font-medium text-xs">{rec.email}</td>
                                  <td>
                                    <span className={`badge badge-xs ${rec.status === 'SENT' ? 'badge-success' : 'badge-ghost'}`}>
                                      {rec.status}
                                    </span>
                                  </td>
                                  <td>
                                    {rec.openedCount > 0 ? (
                                      <span className="badge badge-success gap-1 font-bold text-xs">
                                        <Eye className="w-3 h-3" /> Abierto
                                      </span>
                                    ) : (
                                      <span className="text-xs text-base-content/40">Sin abrir</span>
                                    )}
                                  </td>
                                  <td className="font-bold text-xs">{rec.openedCount}</td>
                                  <td className="text-xs text-base-content/60">
                                    {rec.openedAt ? new Date(rec.openedAt).toLocaleString('es-MX') : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
