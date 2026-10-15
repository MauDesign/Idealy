import React from 'react';

interface TrustBarProps {
  locale?: string;
}

export default function TrustBar({ locale = 'es' }: TrustBarProps) {
  const isEs = locale === 'es';

  const stats = [
    {
      value: '10+',
      label: isEs ? 'proyectos entregados' : 'projects delivered',
    },
    {
      value: '2017',
      label: isEs ? 'diseñando productos digitales' : 'designing digital products',
    },
    {
      value: '< 24 h',
      label: isEs ? 'para responderte' : 'response time',
    },
    {
      value: '2',
      label: isEs ? 'plataformas propias en operación' : 'proprietary platforms in operation',
    },
  ];

  const clientLogos = [
    { name: 'Aquadrada', label: 'AQUADRADA' },
    { name: 'Orbeo', label: 'ORBEO' },
    { name: 'Petrosea', label: 'PETROSEA' },
    { name: 'Capilhera', label: 'CAPILHERA' },
    { name: 'PueblaMed', label: 'PUEBLAMED' },
    { name: 'Wise Facturación', label: 'WISE FACTURACIÓN' },
  ];

  return (
    <section
      aria-label={isEs ? 'Barra de confianza' : 'Trust bar'}
      className="w-full bg-slate-50 dark:bg-[#021824] py-12 px-6 border-b border-slate-200 dark:border-white/5 transition-colors"
    >
      <div className="w-11/12 max-w-7xl mx-auto flex flex-col gap-10">

        {/* Título centrado */}
        <h2 className="text-center text-sm uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
          {isEs ? 'Empresas que ya trabajan con nosotros' : 'Companies that trust our work'}
        </h2>

        {/* Rejilla de 6 logos monocromáticos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
          {clientLogos.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center h-16 w-full max-w-[170px] px-4 rounded-lg bg-base-100/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 opacity-70 hover:opacity-100 hover:border-primary/40 transition-all group"
            >
              <span className="font-bold tracking-widest text-xs sm:text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors text-center select-none">
                {client.label}
              </span>
            </div>
          ))}
        </div>

        {/* Rejilla de 4 cifras centradas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-slate-200/80 dark:border-white/5 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-2">
              <span className="font-sora text-3xl sm:text-4xl lg:text-[40px] font-black text-primary tracking-tight leading-none mb-2">
                {stat.value}
              </span>
              <span className="text-[15px] text-slate-600 dark:text-slate-300 font-medium max-w-[180px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
