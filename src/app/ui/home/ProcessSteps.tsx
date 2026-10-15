'use client';

import React, { useState } from 'react';
import {
  Compass,
  Palette,
  Terminal,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ProcessDiagram } from './ProcessDiagrams';

interface ProcessStepsProps {
  locale?: string;
}

export default function ProcessSteps({ locale = 'es' }: ProcessStepsProps) {
  const isEs = locale === 'es';
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      tag: isEs ? 'Paso 1 · Sin compromiso' : 'Step 1 · No strings attached',
      title: isEs ? 'Diagnóstico gratis' : 'Free Diagnosis',
      badge: isEs ? '20 min call' : '20 min call',
      description: isEs
        ? 'Revisamos tu negocio, tu sitio actual y tus objetivos comerciales. Te decimos con honestidad qué conviene hacer primero y cuánto cuesta.'
        : 'We review your business model, current web presence, and sales bottlenecks. We tell you transparently what to tackle first and what it will cost.',
      deliverable: isEs ? 'Diagnóstico + Hoja de ruta' : 'Diagnosis + Roadmap',
      icon: Compass,
      glowColor: 'rgba(20, 184, 166, 0.4)',
      bgPill: 'bg-teal-400/20 text-teal-300 border-teal-400/40',
      isometricVisual: {
        topLabel: isEs ? 'AUDITORÍA EN VIVO' : 'LIVE AUDIT',
        subLabel: isEs ? 'Análisis UX, velocidad y conversión' : 'UX, speed & conversion review',
        statValue: '20 min',
        statLabel: isEs ? 'Sesión estratégica' : 'Strategic session',
        metaTag: isEs ? 'Costo $0 MXN' : '$0 USD Cost',
        items: isEs
          ? ['Revisión de embudo actual', 'Oportunidades de venta', 'Estimación transparente']
          : ['Current funnel review', 'Conversion opportunities', 'Transparent estimate'],
      },
    },
    {
      number: '02',
      tag: isEs ? 'Paso 2 · Visualización previa' : 'Step 2 · Pre-visualization',
      title: isEs ? 'Prototipo navegable' : 'Interactive Prototype',
      badge: isEs ? 'Figma UI/UX' : 'Figma UI/UX',
      description: isEs
        ? 'Diseñamos tu sitio o sistema pantalla por pantalla. Puedes hacer clic, probar los flujos y ajustar detalles antes de escribir una sola línea de código.'
        : 'We design your website or web system in Figma down to the pixel. You click through, test flows, and approve before a single line of code is written.',
      deliverable: isEs ? 'Figma navegable en tu móvil' : 'Interactive Figma prototype',
      icon: Palette,
      glowColor: 'rgba(45, 212, 191, 0.4)',
      bgPill: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
      isometricVisual: {
        topLabel: isEs ? 'PROTOTIPO NAVEGABLE' : 'CLICKABLE PROTOTYPE',
        subLabel: isEs ? 'Diseño de alta fidelidad Figma' : 'High-fidelity Figma wireframes',
        statValue: '100%',
        statLabel: isEs ? 'Validado antes de programar' : 'Validated before code',
        metaTag: isEs ? 'Sin sorpresas' : 'Zero surprises',
        items: isEs
          ? ['Diseño Mobile-First', 'Flujos de compra & contacto', 'Revisión y ajustes colaborativos']
          : ['Mobile-First design', 'Checkout & contact flows', 'Collaborative reviews'],
      },
    },
    {
      number: '03',
      tag: isEs ? 'Paso 3 · Avances semanales' : 'Step 3 · Weekly milestones',
      title: isEs ? 'Desarrollo por entregas' : 'Milestone Development',
      badge: isEs ? 'Next.js & Cloud' : 'Next.js & Cloud',
      description: isEs
        ? 'Programamos con tecnología de alto rendimiento. Cada semana recibes un enlace con avances reales funcionando para que veas el progreso en tiempo real.'
        : 'Engineered with cutting-edge tech. Every week you receive a live test URL with functional increments so you watch your product come to life.',
      deliverable: isEs ? 'Enlace demo semanal en vivo' : 'Weekly live staging link',
      icon: Terminal,
      glowColor: 'rgba(52, 211, 153, 0.4)',
      bgPill: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40',
      isometricVisual: {
        topLabel: isEs ? 'DESPLIEGUE CONTINUO' : 'CONTINUOUS DEPLOYMENT',
        subLabel: isEs ? 'Código limpio, rápido y seguro' : 'Clean, blazing-fast code',
        statValue: '7 días',
        statLabel: isEs ? 'Ciclo de entregas funcionales' : 'Working sprint cadence',
        metaTag: isEs ? 'Next.js + Postgres' : 'Next.js + Postgres',
        items: isEs
          ? ['Staging privado para probar', 'Carga ultrarrápida (<1s)', 'Integraciones API & DB']
          : ['Private preview staging', 'Sub-second load times', 'API & database hooks'],
      },
    },
    {
      number: '04',
      tag: isEs ? 'Paso 4 · Salida a producción' : 'Step 4 · Production launch',
      title: isEs ? 'Lanzamiento y crecimiento' : 'Launch & Growth',
      badge: isEs ? 'Go Live + Leads' : 'Go Live + Leads',
      description: isEs
        ? 'Publicamos en tu dominio con SSL y analítica. Capacitamos a tu equipo y, si lo requieres, activamos pauta y SEO para que empiecen a entrar prospectos.'
        : 'We push to your production domain with SSL and analytics configured. We train your team and activate growth ads to turn traffic into pipeline.',
      deliverable: isEs ? 'Sistema en vivo + Capacitación' : 'Live product + Team training',
      icon: Rocket,
      glowColor: 'rgba(34, 211, 238, 0.4)',
      bgPill: 'bg-teal-400/20 text-teal-300 border-teal-400/40',
      isometricVisual: {
        topLabel: isEs ? 'SISTEMA PRODUCTIVO' : 'PRODUCTION LIVE',
        subLabel: isEs ? 'Dominio propio, SSL y analítica' : 'Custom domain, SSL & analytics',
        statValue: '24/7',
        statLabel: isEs ? 'Disponibilidad y monitoreo' : 'Uptime & analytics tracking',
        metaTag: isEs ? 'Generando ventas' : 'Customer acquisition',
        items: isEs
          ? ['SEO técnico y Google Analytics', 'Capacitación en video para tu equipo', 'Campañas opcionales de captación']
          : ['Technical SEO & analytics', 'Video onboarding for your team', 'Turnkey client acquisition campaigns'],
      },
    },
  ];

  return (
    <section
      id="proceso"
      aria-labelledby="process-heading"
      className="relative w-full py-28 px-6 bg-[#01131b] text-white overflow-hidden"
    >
      {/* ─────────────────────────────────────────────────────────────
          FONDO: LÍNEAS TÉCNICAS CON BLUR ATMOSFÉRICO APLICADO
          ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 z-0 blur-[5px]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 180, 166, 0.28) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(0, 180, 166, 0.28) 1.5px, transparent 1.5px)`,
          backgroundSize: '46px 46px',
        }}
      />

      {/* Resplandores ambientales de profundidad */}
      <div className="absolute top-1/4 -left-32 w-[520px] h-[520px] rounded-full bg-[#00b4a6]/15 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[350px] rounded-full bg-cyan-500/12 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-[520px] h-[520px] rounded-full bg-emerald-500/12 blur-[140px] pointer-events-none" />

      <div className="relative w-11/12 max-w-7xl mx-auto z-10">
        {/* Encabezado */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-frosted text-[#5eead4] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {isEs ? 'Esquema de trabajo · 4 Etapas' : 'Workflow Architecture · 4 Stages'}
            </div>
            <h2
              id="process-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-5 drop-shadow-md"
            >
              {isEs ? (
                <>
                  Ves tu proyecto funcionando{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4a6] via-[#5eead4] to-cyan-300">
                    antes de pagar el código.
                  </span>
                </>
              ) : (
                <>
                  See your product in action{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4a6] via-[#5eead4] to-cyan-300">
                    before paying for code.
                  </span>
                </>
              )}
            </h2>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              {isEs
                ? 'Un diagrama continuo de entrega en 4 fases estructuradas. Sin ambigüedades, con entregables tangibles cada semana.'
                : 'A continuous 4-phase delivery system. Zero ambiguity, with functional milestones delivered weekly.'}
            </p>
          </div>

          {/* Botón CTA rápido hacia diagnóstico */}
          <div className="shrink-0 flex items-center">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full liquid-glass-frosted hover:!bg-[#00b4a6] text-white hover:!text-[#01131b] hover:!border-[#00b4a6] text-sm font-bold tracking-tight transition-all duration-300 group hover:shadow-[0_0_30px_rgba(0,180,166,0.6)]"
            >
              <span>{isEs ? 'Quiero agendar mi diagnóstico' : 'Book free diagnosis'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CARDS CON EFECTO LIQUID GLASS FROSTED (Vidrio Esmerilado Translúcido Real)
            ───────────────────────────────────────────────────────────── */}
        <div className="relative mb-16">
          {/* Línea conectora horizontal continua con pulso de gradiente */}
          <div className="hidden lg:block absolute top-[44px] left-12 right-12 h-[2px] bg-gradient-to-r from-cyan-500/30 via-[#00b4a6] to-emerald-400/30 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent w-36 animate-[floatSlow_3.5s_linear_infinite]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const StepIcon = step.icon; const isSelected = activeStep === idx;

              return (
                <div
                  key={step.number}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`group glass relative flex flex-col rounded-3xl p-6 sm:p-7 transition-all duration-500 glass cursor-pointer overflow-hidden ${isSelected
                    ? 'liquid-glass-frosted-active -translate-y-2.5'
                    : 'liquid-glass-frosted hover:-translate-y-1'
                    }`}
                  style={{
                    perspective: '1000px',
                  }}
                >
                  {/* Reflejo especular brillante de Liquid Glass Frosted en el borde superior */}
                  <div
                    className="absolute -top-10 -left-10 -right-10 h-24 bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none rounded-t-[3rem] transition-opacity duration-500"
                    style={{ opacity: isSelected ? 1 : 0.65 }}
                  />

                  {/* Bisel perimetral de refracción líquida */}
                  <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/10" />

                  {/* Halo interno reactivo según paso */}
                  <div
                    className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full blur-[45px] pointer-events-none transition-all duration-500"
                    style={{
                      backgroundColor: isSelected ? step.glowColor : 'rgba(255, 255, 255, 0.03)',
                    }}
                  />

                  {/* Conector de nodo superior */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="relative">
                      {/* Nodo prisma de liquid glass */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-500 backdrop-blur-xl ${isSelected
                          ? 'bg-gradient-to-br from-[#00b4a6] to-cyan-400 text-[#01131b] scale-110 shadow-[0_0_25px_rgba(0,180,166,0.7),inset_0_2px_4px_rgba(255,255,255,0.7)]'
                          : 'bg-white/10 text-white border border-white/20 group-hover:border-[#00b4a6]/70 group-hover:bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]'
                          }`}
                      >
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <span className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-md bg-[#01131b] border border-white/25 text-[10px] font-black text-[#5eead4] font-mono shadow-md">
                        {step.number}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-colors ${step.bgPill}`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  {/* VISUAL ANIMADO (SVG) ENCAPSULADO EN CRISTAL LÍQUIDO ESMERILADO */}
                  <div
                    className={`relative z-10 mb-6 aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-[#01131b]/70 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-colors duration-500 ${isSelected ? 'border-[#00b4a6]/50' : 'border-white/10'
                      }`}
                  >
                    {/* Retícula interna igual al fondo de la sección */}
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-40 pointer-events-none"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, rgba(0,180,166,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,180,166,0.12) 1px, transparent 1px)',
                        backgroundSize: '23px 23px',
                      }}
                    />
                    {/* Glow que se intensifica en la card activa */}
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_55%,rgba(0,180,166,0.22),transparent_65%)]"
                      style={{ opacity: isSelected ? 1 : 0.4 }}
                    />
                    <div className="absolute inset-0 p-2">
                      <ProcessDiagram step={step.number} locale={locale} />
                    </div>
                  </div>

                  {/* Contenido textual con máxima nitidez y legibilidad */}
                  <div className="relative z-10 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-[#5eead4] transition-colors drop-shadow-sm">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-100 leading-relaxed mb-6 font-normal">
                        {step.description}
                      </p>
                    </div>

                    {/* Entregable clave destacado en cápsula de cristal esmerilado */}
                    <div className="pt-4 border-t border-white/15 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00b4a6] shrink-0" />
                      <span className="text-xs font-semibold text-slate-200">
                        {step.deliverable}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            PANEL DE PROFUNDIDAD EN LIQUID GLASS FROSTED (Inspección interactiva)
            ───────────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl p-8 sm:p-10 glass border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden glass">
          {/* Reflejo especular Liquid Glass superior */}
          <div className="absolute -top-16 left-0 right-0 h-32 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00b4a6]/15 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Columna Izquierda: Información detallada del paso activo */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-[#5eead4] font-mono font-bold mb-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <Layers className="w-3.5 h-3.5" />
                {steps[activeStep].tag}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight drop-shadow-sm">
                {steps[activeStep].number}. {steps[activeStep].title}
              </h3>

              <p className="text-base text-slate-100 leading-relaxed mb-6 font-normal">
                {steps[activeStep].description}
              </p>

              {/* Lista de checkpoints incluidos en esta etapa */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
                {steps[activeStep].isometricVisual.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00b4a6] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Botón de acción */}
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#5eead4] hover:text-white transition-colors group"
              >
                <span>
                  {isEs
                    ? '¿Tienes preguntas sobre esta etapa? Escríbenos'
                    : 'Have questions about this stage? Talk to us'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Columna Derecha: Selector rápido de pasos / Selector de etapas */}
            <div className="lg:col-span-5 flex flex-col gap-2.5 w-full">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                {isEs ? 'Explora cada etapa del esquema:' : 'Explore each stage of the workflow:'}
              </span>
              {steps.map((st, i) => (
                <button
                  key={st.number}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all ${activeStep === i
                    ? 'liquid-glass-frosted-active text-white'
                    : 'liquid-glass-frosted text-slate-200 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${activeStep === i
                        ? 'bg-[#00b4a6] text-[#01131b] shadow-[0_0_12px_#00b4a6]'
                        : 'bg-white/15 text-white'
                        }`}
                    >
                      {st.number}
                    </span>
                    <span className="text-sm font-bold">{st.title}</span>
                  </div>
                  <span className="text-xs text-[#5eead4] font-mono">
                    {st.deliverable}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}