import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import WhatsAppButton from '@/app/ui/express/WhatsAppModal';
import ExpressLeadForm from '@/app/ui/express/ExpressLeadForm';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Tu página web lista en 5 días por $5,000 | Idealy Página Express',
  description:
    'Que tus clientes te encuentren en Google y te escriban directo a WhatsApp. Sin plantillas, sin rentas mensuales. Entrega en 5 días o te devolvemos tu anticipo.',
  alternates: {
    canonical: 'https://www.idealy.com.mx/pagina-express',
  },
  openGraph: {
    title: 'Tu página web lista en 5 días por $5,000 | Idealy Página Express',
    description:
      'Página web profesional a la medida para tu negocio. Incluye hosting, dominio, textos que venden y botón de WhatsApp.',
    url: 'https://www.idealy.com.mx/pagina-express',
    siteName: 'Idealy',
    images: [
      {
        url: 'https://www.idealy.com.mx/img/express/express_panaderia.jpg',
        width: 1200,
        height: 630,
        alt: 'Idealy Página Express $5,000',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
};

export default function PaginaExpressPage() {
  return (
    <div className="w-full bg-[#07131e] text-gray-100 min-h-screen font-sans selection:bg-[#00b4a6] selection:text-white pb-20 lg:pb-0">
      {/* Dynamic Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Idealy Página Express',
            image: 'https://www.idealy.com.mx/img/express/express_panaderia.jpg',
            description:
              'Página web profesional lista en 5 días hábiles con botón de WhatsApp, hosting, dominio y copywriting incluido.',
            offers: {
              '@type': 'Offer',
              price: '5000',
              priceCurrency: 'MXN',
              availability: 'https://schema.org/InStock',
              validFrom: '2026-09-01',
              priceValidUntil: '2026-10-31',
              seller: {
                '@type': 'Organization',
                name: 'Idealy',
                url: 'https://www.idealy.com.mx',
              },
            },
          }),
        }}
      />

      {/* Dedicated Minimal Header */}
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
              PÁGINA EXPRESS · SOLO OCTUBRE
            </span>
            <WhatsAppButton
              buttonText="Quiero mi página →"
              locationTag="header_nav"
              presetMessage="Hola, quiero mi Página Express 🚀"
              className="py-2 px-4 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-xs sm:text-sm font-bold shadow-md"
            />
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00b4a6]/15 border border-[#00b4a6]/30 text-[#00b4a6] font-extrabold text-xs tracking-wider uppercase mb-5">
              <span>🔥 PÁGINA EXPRESS · SOLO OCTUBRE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-5">
              Tu página web lista en 5 días por{' '}
              <span className="text-[#00b4a6] underline decoration-[#0069a9] decoration-4 underline-offset-4">
                $5,000
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              Que tus clientes te encuentren en Google y te escriban directo a WhatsApp. Sin plantillas, sin rentas mensuales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-6">
              <WhatsAppButton
                buttonText="Quiero mi página →"
                locationTag="hero_primary"
                presetMessage="Hola, quiero mi Página Express 🚀"
                className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-lg font-extrabold shadow-xl"
              />

              <a
                href="#formulario-vista-previa"
                className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-base-200 hover:bg-base-300 border border-white/10 text-gray-200 hover:text-white text-base font-bold text-center transition-colors flex items-center justify-center"
              >
                Ver cómo quedaría la mía
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-1.5 text-[#00b4a6]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Entrega en 5 días o te devolvemos tu anticipo
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Quedan 7 de 10 lugares
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src="/img/express/express_panaderia.jpg"
                alt="Arte de lanzamiento Página Express Idealy"
                width={700}
                height={450}
                priority
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07131e] via-transparent to-transparent opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EL PROBLEMA */}
      <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Si no te encuentran en Google, le compran a tu competencia
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hoy, antes de llamar o visitar un negocio, la gente lo busca en su celular. Si no apareces, o si lo que encuentran es un perfil de Facebook desordenado, se van con el siguiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              quote: '"Tengo Facebook, pero no me llegan clientes nuevos."',
              desc: 'Las redes sociales muestran tu negocio solo a quienes ya te siguen. Un sitio en Google atrapa a quien te busca activamente.',
            },
            {
              quote: '"Me cotizaron una página en $20,000 y tardaban un mes."',
              desc: 'Las agencias tradicionales cobran de más por procesos lentos. Nosotros eliminamos la paja y te entregamos rápido.',
            },
            {
              quote: '"Un sobrino me la iba a hacer… y nunca la terminó."',
              desc: 'Los proyectos informales se quedan a medias. En Idealy firmamos un compromiso de entrega de 5 días con garantía.',
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
                Problema común
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LA SOLUCIÓN */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Una página hecha para traerte clientes, no para verse bonita
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
              Diseñamos tu página con tu marca, explicamos lo que haces en palabras que tus clientes entienden y ponemos un botón para que te escriban por WhatsApp en un clic.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Palabras directas y sinceras que entienden tus clientes reales',
                'Estructura fluida optimizada para tocados de pantalla en teléfono',
                'Botones flotantes directo a tu chat personal o de empresa',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00b4a6]/20 text-[#00b4a6] flex items-center justify-center font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <span className="text-sm sm:text-base text-gray-200">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-[#00b4a6]/30 shadow-2xl">
              <Image
                src="/img/express/express_mecanico.jpg"
                alt="Solución Idealy Página Express comparativa"
                width={700}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUÉ INCLUYE */}
      <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Todo lo que necesitas por $5,000
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Sin sorpresas, sin cargos ocultos, sin mensualidades obligatorias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { title: 'Diseño a la medida de tu negocio', desc: 'Nada de plantillas genéricas. Adaptado a tus colores y tu giro.' },
              { title: 'Textos que venden', desc: 'Nosotros los redactamos para que tu cliente entienda lo que ofreces.' },
              { title: 'Botón de WhatsApp integrado', desc: 'Para que te escriban al instante con un mensaje prellenado.' },
              { title: 'Rápida en cualquier celular', desc: 'Carga en menos de 2 segundos para no perder ni un visitante.' },
              { title: 'Lista para anuncios en Google y Facebook', desc: 'Optimizada tecnológicamente para tus campañas pagadas.' },
              { title: 'Hosting y dominio por 1 año incluidos', desc: 'Tu propio nombre en internet (ej. tunegocio.com) listo.' },
              { title: 'Tu negocio dado de alta en Google Maps', desc: 'Aparece cuando busquen tu categoría en tu ciudad.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-base-100/80 border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-[#00b4a6]/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0069a9]/30 text-[#00b4a6] flex items-center justify-center font-bold text-lg shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#0069a9]/40 to-[#00b4a6]/40 border border-[#00b4a6]/50 rounded-2xl p-6 text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-1">
              OFERTA DE LANZAMIENTO
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg text-gray-400 line-through font-bold">Valor real: $9,200</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">→ $5,000 MXN</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CÓMO FUNCIONA */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            Tu página en línea en 3 pasos
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Un proceso simple y transparente de principio a fin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            {[
              {
                num: '1',
                title: 'Aparta tu lugar con el 50% ($2,500)',
                desc: 'Aseguras tu lugar dentro de los 10 cupos disponibles de este mes.',
              },
              {
                num: '2',
                title: 'Responde un cuestionario de 10 minutos',
                desc: 'Nos envías tu logo, tus fotos básicas y las respuestas sobre tu negocio.',
              },
              {
                num: '3',
                title: 'En 5 días hábiles tu página está publicada',
                desc: 'Revisamos los detalles juntos, la publicamos y pagas el resto al entregar.',
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start bg-base-100/50 p-5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-2xl bg-[#00b4a6] text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-md">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/img/express/express_robots.jpg"
                alt="Proceso de construcción rápida Idealy"
                width={700}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. EJEMPLOS */}
      <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Así quedan nuestras páginas
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Rápidas, limpias y preparadas para captar clientes desde el teléfono.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                giro: 'Consultorio Dental / Salud',
                time: 'Entregada en 4 días',
                score: '99/100 Google Speed',
                color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
                desc: 'Botón directo para agendar citas de valoración por WhatsApp.',
              },
              {
                giro: 'Taller Automotriz',
                time: 'Entregada en 4 días',
                score: '100/100 Google Speed',
                color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                desc: 'Ubicación en Google Maps y lista de servicios mecánicos claros.',
              },
              {
                giro: 'Restaurante / Banquetes',
                time: 'Entregada en 3 días',
                score: '99/100 Google Speed',
                color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                desc: 'Menú digital y botón para pedidos a domicilio o reservaciones.',
              },
            ].map((ex, i) => (
              <div
                key={i}
                className="bg-base-100/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00b4a6]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-xs font-bold py-1 px-3 rounded-full border ${ex.color}`}>
                      {ex.time}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      ⚡ {ex.score}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-2">{ex.giro}</h3>
                  <p className="text-sm text-gray-300 mb-4">{ex.desc}</p>
                </div>
                <div className="w-full h-36 rounded-xl bg-gradient-to-br from-[#0069a9]/20 to-[#00b4a6]/20 border border-white/10 flex items-center justify-center text-xs text-gray-400 font-mono">
                  📱 Vista preliminar móvil optimizada
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMPARATIVA */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto overflow-x-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            Haz cuentas
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Compara por qué la Página Express es la mejor inversión para tu negocio.
          </p>
        </div>

        <div className="min-w-[640px] bg-base-100/70 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0069a9]/30 text-white font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 sm:p-5">Característica</th>
                <th className="p-4 sm:p-5 bg-[#00b4a6]/20 text-[#00b4a6] text-sm">
                  Idealy Página Express
                </th>
                <th className="p-4 sm:p-5 text-gray-400">Agencia tradicional</th>
                <th className="p-4 sm:p-5 text-gray-400">Hacerla tú en Wix</th>
                <th className="p-4 sm:p-5 text-gray-400">Freelancer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-gray-200">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Precio</td>
                <td className="p-4 sm:p-5 font-black text-[#00b4a6] bg-[#00b4a6]/10 text-base">
                  $5,000
                </td>
                <td className="p-4 sm:p-5 text-gray-400">$15,000+</td>
                <td className="p-4 sm:p-5 text-gray-400">Renta mensual siempre</td>
                <td className="p-4 sm:p-5 text-gray-400">$5,000–$25,000</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Tiempo</td>
                <td className="p-4 sm:p-5 font-bold text-white bg-[#00b4a6]/10">5 días</td>
                <td className="p-4 sm:p-5 text-gray-400">3–6 semanas</td>
                <td className="p-4 sm:p-5 text-gray-400">Tu tiempo valioso</td>
                <td className="p-4 sm:p-5 text-gray-400">Incierto</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Garantía</td>
                <td className="p-4 sm:p-5 font-bold text-[#00b4a6] bg-[#00b4a6]/10">✓ Sí</td>
                <td className="p-4 sm:p-5 text-gray-400">Rara vez</td>
                <td className="p-4 sm:p-5 text-gray-400">No</td>
                <td className="p-4 sm:p-5 text-gray-400">No</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Textos incluidos</td>
                <td className="p-4 sm:p-5 font-bold text-[#00b4a6] bg-[#00b4a6]/10">✓ Sí</td>
                <td className="p-4 sm:p-5 text-gray-400">A veces</td>
                <td className="p-4 sm:p-5 text-gray-400">No</td>
                <td className="p-4 sm:p-5 text-gray-400">No</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">La página es tuya</td>
                <td className="p-4 sm:p-5 font-bold text-[#00b4a6] bg-[#00b4a6]/10">✓ Sí</td>
                <td className="p-4 sm:p-5 text-gray-400">Sí</td>
                <td className="p-4 sm:p-5 text-gray-400">No</td>
                <td className="p-4 sm:p-5 text-gray-400">Depende</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. GARANTÍA */}
      <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#0069a9]/30 to-[#00b4a6]/30 border-2 border-[#00b4a6] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="w-28 h-28 rounded-full bg-[#00b4a6] text-white flex flex-col items-center justify-center font-black text-center p-2 shrink-0 shadow-xl border-4 border-white/20">
            <span className="text-2xl leading-none">5 DÍAS</span>
            <span className="text-[10px] tracking-wider uppercase">Garantía</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Lista en 5 días o te devolvemos tu anticipo.
            </h2>
            <p className="text-base text-gray-200 leading-relaxed">
              Cuando recibimos tu información, empieza el reloj. Si no está lista en 5 días hábiles, te regresamos tus $2,500. Sin letras chiquitas.
            </p>
          </div>
        </div>
      </section>

      {/* 9. QUIÉN ESTÁ DETRÁS */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="bg-base-100/60 border border-white/10 rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#00b4a6] shadow-xl relative">
              <Image
                src="/img/express/express_mauricio.jpg"
                alt="Mauricio Casado - Idealy Puebla"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00b4a6] block mb-2">
              EQUIPO REAL EN PUEBLA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Somos Idealy, un estudio de diseño y desarrollo en Puebla
            </h2>
            <p className="text-base text-gray-300 leading-relaxed mb-4">
              Desde 2017 diseñamos páginas y sistemas para negocios en México y Estados Unidos. Hablas directo con quien hace tu página, no con un vendedor.
            </p>
            <p className="text-sm font-semibold text-white">
              — Mauricio Casado, Fundador de Idealy
            </p>
          </div>
        </div>
      </section>

      {/* 10. PREGUNTAS FRECUENTES */}
      <section className="py-16 px-4 sm:px-8 bg-[#0b1c2b] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Preguntas frecuentes
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Resolvemos tus dudas antes de empezar.
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* 11. CIERRE Y FORMULARIO */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase mb-4">
            ⚡ SOLO 10 LUGARES EN OCTUBRE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Aparta el tuyo hoy
          </h2>

          <div className="flex justify-center mb-8">
            <WhatsAppButton
              buttonText="Quiero mi página →"
              locationTag="cierre_primary"
              presetMessage="Hola, quiero apartar mi lugar de la Página Express"
              className="py-4 px-10 rounded-2xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-xl font-extrabold shadow-2xl"
            />
          </div>

          <p className="text-sm sm:text-base text-gray-300 mb-8">
            o déjanos tus datos y te mandamos cómo quedaría la tuya ↓
          </p>
        </div>

        {/* Form component */}
        <ExpressLeadForm />
      </section>

      {/* Footer minimal */}
      <footer className="py-8 px-4 text-center border-t border-white/10 text-xs text-gray-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Idealy. Todos los derechos reservados. Puebla, México.</p>
          <Link href="/privacy-policy" className="hover:text-gray-300 underline">
            Aviso de Privacidad
          </Link>
        </div>
      </footer>

      {/* 6. STICKY MOBILE BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07131e]/95 backdrop-blur-md p-3 border-t border-[#00b4a6]/40 shadow-2xl">
        <WhatsAppButton
          buttonText="Quiero mi página →"
          locationTag="mobile_sticky_bottom"
          presetMessage="Hola, quiero mi Página Express 🚀"
          className="w-full py-3.5 px-6 rounded-xl bg-[#00b4a6] hover:bg-[#009b8e] text-white text-base font-extrabold shadow-lg"
        />
      </div>
    </div>
  );
}
