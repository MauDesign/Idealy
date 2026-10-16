import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Code,
  Terminal,
  Cpu,
  Database,
  ShieldCheck,
  Check,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  Workflow,
  Lock,
  Smartphone
} from 'lucide-react';
import WhatsAppButton from '@/app/ui/express/WhatsAppModal';
import ExpressGSAPInitializer from '@/app/ui/express/ExpressGSAPInitializer';
import CustomSoftwareLeadForm from '@/app/ui/custom-software/CustomSoftwareLeadForm';
import CustomSoftwareFAQAccordion from '@/app/ui/custom-software/CustomSoftwareFAQAccordion';

export const metadata: Metadata = {
  title: 'Desarrollo de Software a la Medida desde $25,000 MXN | Idealy Studio',
  description:
    'Sustituye tus Excels o sistemas viejos por software moderno a la medida. Portales de clientes, cotizadores en línea, gestión de inventario y automatización con IA. Código 100% de tu propiedad.',
  alternates: {
    canonical: 'https://www.idealy.com.mx/desarrollo-a-la-medida',
  },
  openGraph: {
    title: 'Desarrollo de Software a la Medida | Idealy Studio',
    description:
      'Portales de clientes, cotizadores, inventarios y migración de sistemas legacy. Construido con Next.js, TypeScript y PostgreSQL. Desde $25,000 MXN.',
    url: 'https://www.idealy.com.mx/desarrollo-a-la-medida',
    siteName: 'Idealy',
    images: [
      {
        url: 'https://www.idealy.com.mx/img/idealy-dev.webp',
        width: 1200,
        height: 630,
        alt: 'Software a la Medida Idealy',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
};

export default function DesarrolloALaMedidaPage() {
  return (
    <ExpressGSAPInitializer>
      <div className="w-full bg-[#07131e] text-gray-100 min-h-screen font-sans selection:bg-[#00b4a6] selection:text-white pb-20 lg:pb-0 overflow-x-hidden">
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Idealy Desarrollo de Software a la Medida',
              image: 'https://www.idealy.com.mx/img/idealy-dev.webp',
              description:
                'Ingeniería de software a la medida: portales para clientes, cotizadores inteligentes, sistemas de control de operaciones y migración de sistemas antiguos a la nube.',
              offers: {
                '@type': 'Offer',
                price: '25000',
                priceCurrency: 'MXN',
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'Organization',
                  name: 'Idealy',
                  url: 'https://www.idealy.com.mx',
                },
              },
            }),
          }}
        />

        {/* Header minimal */}
        <header className="w-full border-b border-white/10 bg-[#07131e]/90 backdrop-blur-md sticky top-0 z-40 py-4 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/img/Logo-Idealy.png"
                alt="Idealy Logo"
                width={130}
                height={40}
                priority
                className="object-contain"
              />
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#00b4a6]/20 border border-[#00b4a6]/40 text-[#00b4a6]">
                SOFTWARE A LA MEDIDA · DESDE $25,000 MXN
              </span>
              <WhatsAppButton
                buttonText="Cotizar por WhatsApp 💬"
                locationTag="software_header_nav"
                presetMessage="Hola Mauricio, me interesa cotizar un sistema de Software a la Medida para mi empresa 💻"
                className="py-2 px-4 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              />
            </div>
          </div>
        </header>

        {/* 1. HERO SECTION */}
        <section className="w-full relative pt-8 pb-16 overflow-hidden">
          {/* Subtle Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00b4a615_1px,transparent_1px),linear-gradient(to_bottom,#00b4a615_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[#00b4a6]/20 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute top-10 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-[#0069a9]/25 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column */}
              <div className="lg:col-span-6 flex flex-col items-start pt-2">
                <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00b4a6]/20 to-[#0069a9]/20 border border-[#00b4a6]/40 text-[#00b4a6] font-extrabold text-xs tracking-wider uppercase mb-5 shadow-[0_0_20px_rgba(0,180,166,0.2)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b4a6] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00b4a6]"></span>
                  </span>
                  <span>⚡ INGENIERÍA DE SOFTWARE SIN MENSUALIDADES FORZOSAS</span>
                </div>

                <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight mb-5">
                  Software a la medida para tu negocio desde{' '}
                  <span className="inline-block px-3.5 py-1 rounded-2xl bg-gradient-to-r from-[#00b4a6] to-[#008075] text-white shadow-[0_0_35px_rgba(0,180,166,0.6)] font-black tracking-tight border border-white/20 transform hover:scale-105 transition-transform">
                    $25,000
                  </span>{' '}
                  <span className="text-xs sm:text-sm text-amber-300 font-bold tracking-wider uppercase align-super">MXN + IVA</span>
                </h1>

                <p className="hero-subtitle text-base sm:text-xl text-gray-300 leading-relaxed mb-6 font-normal">
                  Deja atrás los archivos de Excel descontrolados, el papel y los programas de hace 15 años. Construimos <strong>portales de clientes, cotizadores automáticos y sistemas de control</strong> rápidos, seguros y 100% de tu propiedad.
                </p>

                <div className="hero-cta flex flex-col sm:flex-row gap-3.5 w-full mb-6">
                  <WhatsAppButton
                    buttonText="Platicar con un ingeniero 💬"
                    locationTag="software_hero_primary"
                    presetMessage="Hola Mauricio, quiero cotizar un software a la medida para mi empresa 🚀"
                    className="w-full sm:w-auto py-4 px-7 rounded-2xl bg-gradient-to-r from-[#00b4a6] to-[#009b8e] hover:from-[#00c7b7] hover:to-[#00b4a6] text-white text-base sm:text-lg font-extrabold shadow-[0_0_30px_rgba(0,180,166,0.35)] hover:shadow-[0_0_40px_rgba(0,180,166,0.5)] transition-all transform hover:-translate-y-0.5"
                  />

                  <a
                    href="#soluciones"
                    className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-base-200/80 hover:bg-base-200 border border-white/10 text-gray-200 hover:text-white text-sm font-bold text-center transition-all flex items-center justify-center gap-2 hover:border-white/30"
                  >
                    <span>Ver soluciones</span>
                    <span className="text-[#00b4a6] font-extrabold">↓</span>
                  </a>
                </div>

                <div className="hero-trust space-y-2.5 text-xs sm:text-sm text-gray-300 font-medium bg-[#0b1c2b]/90 border border-white/10 rounded-2xl p-4.5 w-full shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2.5 text-[#00b4a6] font-bold">
                    <Check className="w-4 h-4 shrink-0 text-[#00b4a6]" />
                    <span>Código fuente y base de datos entregados al 100% a tu empresa</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#00b4a6] font-semibold">
                    <Check className="w-4 h-4 shrink-0 text-[#00b4a6]" />
                    <span>Sin licencias por usuario mensual ni rentas obligatorias</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-amber-300 font-semibold">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Migración y limpieza de datos históricos desde Excel o sistemas viejos</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Lead Form */}
              <div className="hero-form-card lg:col-span-6 w-full relative">
                <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#00b4a6]/50 via-white/10 to-[#0069a9]/30 shadow-[0_0_60px_rgba(0,180,166,0.25)]">
                  <CustomSoftwareLeadForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. EL DOLOR OPERATIVO */}
        <section className="gsap-section py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3.5 py-1 rounded-full mb-3 inline-block">
              EL FRENO DEL CRECIMIENTO
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Tu negocio creció, pero tus herramientas siguen siendo hojas de cálculo y mensajes dispersos
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Cuando la operación depende de un Excel que solo una persona entiende, de archivos que se pierden o de sistemas cerrados que cobran por cada usuario nuevo, el costo de los errores supera con creces lo que cuesta construir tu propio software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: '"El archivo de Excel se corrompió y perdimos un día entero de cotizaciones."',
                desc: 'Las hojas de cálculo no tienen control de roles ni respaldos automáticos seguros. Un solo clic borra información clave.',
              },
              {
                quote: '"Los clientes nos saturan a llamadas pidiendo el estado de su pedido."',
                desc: 'Sin un portal web de autoservicio, tu equipo gasta el 60% de su tiempo respondiendo lo que el cliente podría ver en 5 segundos.',
              },
              {
                quote: '"El software que contratamos nos cobra $50 USD por cada empleado nuevo."',
                desc: 'Las plataformas comerciales tipo SaaS castigan tu crecimiento con cobros exponenciales y no se adaptan a tus reglas de negocio.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-base-100/60 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00b4a6]/40 transition-colors"
              >
                <div className="mb-4">
                  <span className="text-3xl font-serif text-[#00b4a6] leading-none">“</span>
                  <p className="text-lg font-bold text-white mb-2">{item.quote}</p>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
                <span className="text-xs font-semibold text-red-400 bg-red-500/10 py-1 px-3 rounded-full w-fit">
                  Freno operativo
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. QUÉ PODEMOS CONSTRUIR (#soluciones) */}
        <section id="soluciones" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00b4a6] bg-[#00b4a6]/15 px-3 py-1 rounded-full mb-3 inline-block">
              SOLUCIONES MÁS POPULARES
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              ¿Qué tipo de software desarrollamos para tu empresa?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Sistemas hechos a la medida de tu flujo de trabajo, no al revés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Solución 1 */}
            <div className="bg-[#0b1c2b]/80 border border-white/10 hover:border-[#00b4a6]/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(0,180,166,0.15)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#00b4a6]/20 border border-[#00b4a6]/40 flex items-center justify-center text-[#00b4a6] mb-6">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">1. Portales web de clientes y proveedores</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  Permite a tus clientes consultar facturas, estatus de entregas, órdenes de compra y estados de cuenta desde su celular o laptop las 24 horas del día con accesos seguros.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Autenticación por roles y permisos diferenciados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Descarga automática de archivos PDF y XML</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Historial de transacciones y estados de cuenta en vivo</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Solución 2 */}
            <div className="bg-[#0b1c2b]/80 border border-white/10 hover:border-[#00b4a6]/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(0,180,166,0.15)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-6">
                  <Workflow className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">2. Cotizadores automáticos y pedidos en línea</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  Convierte tus complejas listas de precios y variables matemáticas en un cotizador web instantáneo que genera cotizaciones formales en PDF y envía copia a tu equipo de ventas.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Fórmulas y reglas comerciales personalizadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Generación de PDF con branding y envío automático por email/WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Integración con pasarelas de pago (Stripe, Mercado Pago)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Solución 3 */}
            <div className="bg-[#0b1c2b]/80 border border-white/10 hover:border-[#00b4a6]/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(0,180,166,0.15)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-6">
                  <Server className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">3. Migración de sistemas viejos a la nube</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  Si tu empresa opera sobre un sistema en Visual Basic, Access, FoxPro o programas instalados en servidores locales vulnerables, modernizamos la interfaz y migramos tu base de datos a la nube con accesibilidad total.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Cero pérdida de historial de clientes o transacciones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Acceso seguro desde cualquier lugar sin VPNs lentas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Respaldos automáticos diarios cifrados en AWS / Supabase</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Solución 4 */}
            <div className="bg-[#0b1c2b]/80 border border-white/10 hover:border-[#00b4a6]/50 rounded-3xl p-8 transition-all hover:shadow-[0_0_30px_rgba(0,180,166,0.15)] flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6">
                  <Cpu className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">4. Automatización de flujos y agentes de IA</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  Conectamos tu software con APIs externas, bases de datos vectoriales y modelos de lenguaje para clasificar correos, procesar documentos PDF automáticamente y responder consultas operativas complejas.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Extracción inteligente de datos de facturas y notas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Bots de soporte conectados directamente a tu base de datos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6]" />
                    <span>Webhooks para sincronizar ERPs, CRMs y WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. COMPARATIVA: SOFTWARE A LA MEDIDA VS SAAS */}
        <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                ¿Software a la medida o rentar un SaaS comercial?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Compara ser dueño de tu herramienta frente a pagar licencias mensuales perpetuas.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300 border border-white/10 rounded-2xl overflow-hidden">
                <thead className="bg-base-200/80 text-white uppercase text-xs font-bold">
                  <tr>
                    <th className="py-4 px-6">Característica</th>
                    <th className="py-4 px-6 text-[#00b4a6] bg-[#00b4a6]/10 border-x border-[#00b4a6]/30">
                      Idealy Software a la Medida
                    </th>
                    <th className="py-4 px-6">Plataforma SaaS Comercial</th>
                    <th className="py-4 px-6">Hojas de Cálculo (Excel)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">Propiedad del código</td>
                    <td className="py-4 px-6 text-[#00b4a6] font-bold bg-[#00b4a6]/5 border-x border-[#00b4a6]/30">
                      100% tuyo (sin dependencias)
                    </td>
                    <td className="py-4 px-6">Nunca te pertenece</td>
                    <td className="py-4 px-6">Archivo local frágil</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">Costo por usuario extra</td>
                    <td className="py-4 px-6 text-[#00b4a6] font-bold bg-[#00b4a6]/5 border-x border-[#00b4a6]/30">
                      $0 MXN (usuarios ilimitados)
                    </td>
                    <td className="py-4 px-6">$15 a $80 USD / usuario / mes</td>
                    <td className="py-4 px-6">$0 pero se corrompe</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">Adaptabilidad a tus procesos</td>
                    <td className="py-4 px-6 text-[#00b4a6] font-bold bg-[#00b4a6]/5 border-x border-[#00b4a6]/30">
                      Exacta (creado para tu operación)
                    </td>
                    <td className="py-4 px-6">Rígida (debes adaptarte tú)</td>
                    <td className="py-4 px-6">Manual y propenso a errores</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">Seguridad y roles</td>
                    <td className="py-4 px-6 text-[#00b4a6] font-bold bg-[#00b4a6]/5 border-x border-[#00b4a6]/30">
                      Permisos estrictos y auditoría de cambios
                    </td>
                    <td className="py-4 px-6">Estándar</td>
                    <td className="py-4 px-6">Cualquiera puede borrar celdas</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-white">Inversión inicial</td>
                    <td className="py-4 px-6 text-white font-extrabold bg-[#00b4a6]/10 border-x border-[#00b4a6]/30 text-base">
                      Desde $25,000 MXN
                    </td>
                    <td className="py-4 px-6">Rentas mensuales que suben con el tiempo</td>
                    <td className="py-4 px-6">Costo oculto en horas perdidas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. NUESTRO STACK TECNOLÓGICO */}
        <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00b4a6] bg-[#00b4a6]/15 px-3 py-1 rounded-full mb-3 inline-block">
            TECNOLOGÍA ROBUSTA
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ingeniería de vanguardia: sin atajos ni código basura
          </h2>
          <p className="text-base text-gray-300 max-w-2xl mx-auto mb-10">
            Construimos con las mismas tecnologías utilizadas por las mejores empresas tecnológicas del mundo.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Next.js & React', desc: 'Front-end ultrarrápido y moderno' },
              { name: 'TypeScript', desc: 'Código tipado y libre de errores' },
              { name: 'PostgreSQL & Prisma', desc: 'Bases de datos relacionales seguras' },
              { name: 'Node.js & Go', desc: 'APIs y microservicios de alto rendimiento' },
            ].map((tech, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#0b1c2b] border border-white/10 text-left">
                <span className="text-sm font-bold text-white block mb-1">{tech.name}</span>
                <span className="text-xs text-gray-400">{tech.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. PREGUNTAS FRECUENTES */}
        <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                Preguntas frecuentes sobre Software a la Medida
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Todo lo que necesitas saber antes de iniciar tu proyecto.
              </p>
            </div>

            <CustomSoftwareFAQAccordion />
          </div>
        </section>

        {/* 7. CIERRE Y CTA FINAL */}
        <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase mb-4">
            🚀 DIGITALIZA TU OPERACIÓN
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Construye el sistema que tu negocio necesita para escalar
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Sin compromisos ni tecnicismos confusos. Analizamos tu flujo actual y te entregamos un mapa de alcance y presupuesto claro.
          </p>

          <div className="flex justify-center mb-10">
            <WhatsAppButton
              buttonText="Solicitar diagnóstico de software por WhatsApp 💬"
              locationTag="software_cierre_primary"
              presetMessage="Hola Mauricio, quiero agendar un diagnóstico técnico para evaluar un sistema a la medida 💻"
              className="py-4 px-10 rounded-2xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-lg sm:text-xl font-extrabold shadow-2xl transition-all"
            />
          </div>

          <div className="max-w-xl mx-auto text-left">
            <CustomSoftwareLeadForm />
          </div>
        </section>

        {/* Footer minimal */}
        <footer className="py-8 px-4 text-center border-t border-white/10 text-xs text-gray-500">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Idealy. Todos los derechos reservados. Puebla, México.</p>
            <div className="flex gap-4">
              <Link href="/sitio-crecimiento" className="hover:text-gray-300 underline">
                Sitio + Crecimiento
              </Link>
              <Link href="/pagina-express" className="hover:text-gray-300 underline">
                Página Express
              </Link>
              <Link href="/privacy-policy" className="hover:text-gray-300 underline">
                Aviso de Privacidad
              </Link>
            </div>
          </div>
        </footer>

        {/* Mobile Sticky WhatsApp Button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07131e]/95 backdrop-blur-md p-3 border-t border-[#00b4a6]/40 shadow-2xl">
          <WhatsAppButton
            buttonText="Cotizar Software a la Medida 💬"
            locationTag="software_mobile_sticky_bottom"
            presetMessage="Hola Mauricio, me interesa cotizar un desarrollo de Software a la Medida 💻"
            className="w-full py-3.5 px-6 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-base font-extrabold shadow-lg"
          />
        </div>
      </div>
    </ExpressGSAPInitializer>
  );
}
