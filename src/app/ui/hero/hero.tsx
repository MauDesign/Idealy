import Typewriter from './Typewriter';
import HeroCtas from './HeroCtas';
import HeroVisual from './HeroVisual';

interface HeroProps {
  locale?: string;
}

export default function Hero({ locale = 'es' }: HeroProps) {
  const isEs = locale === 'es';
  const typewriterWords = isEs
    ? ['clientes.', 'ventas.', 'prospectos.', 'tiempo libre.']
    : ['customers.', 'revenue.', 'growth.', 'free time.'];

  return (
    <section
      id="inicio"
      aria-labelledby="hero-heading"
      className="relative min-h-[90vh] bg-[#011b27] text-white overflow-hidden pt-[104px] pb-20 flex items-center"
    >
      {/* Background glow effects */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-11/12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14">
          
          {/* Columna de Texto (en móvil va arriba) */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {isEs ? 'Estudio de diseño y software · Puebla, México' : 'Design & Software Studio · Puebla, Mexico'}
            </div>

            {/* H1 con frase rotativa */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight mb-6"
            >
              {isEs ? 'Sitios y sistemas que te traen ' : 'Websites and systems that bring you '}
              <span className="text-primary block sm:inline">
                <Typewriter words={typewriterWords} />
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8">
              {isEs
                ? 'Diseñamos, construimos y promocionamos tu sitio web o software a la medida. Un solo equipo, de la idea a las ventas.'
                : 'We design, build, and market your custom website or software. One single team, from idea to revenue.'}
            </p>

            {/* Botones y microtextos */}
            <HeroCtas locale={locale} />
          </div>

          {/* Columna Visual de Alto Impacto con Movimiento 3D y Tarjetas Flotantes */}
          <div className="w-full flex items-center justify-center">
            <HeroVisual locale={locale} />
          </div>

        </div>
      </div>
    </section>
  );
}