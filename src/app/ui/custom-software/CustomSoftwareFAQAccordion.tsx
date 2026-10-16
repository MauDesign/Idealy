'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSoftwareFAQAccordionProps {
  locale?: string;
}

const SOFTWARE_FAQS_ES = [
  {
    q: '¿A partir de qué costo se desarrolla un sistema de software a la medida?',
    a: 'Nuestros desarrollos de software a la medida inician desde $25,000 MXN más IVA para herramientas especializadas como cotizadores web, portales de acceso para clientes o paneles de control de inventario básico. El costo final se determina con base en el alcance funcional que definimos juntos en el diagnóstico sin costo.',
  },
  {
    q: '¿El software y el código fuente nos pertenecen al 100%?',
    a: 'Sí, totalmente. El código fuente, la propiedad intelectual, las bases de datos y la arquitectura técnica se entregan a tu empresa. No cobramos rentas obligatorias de licencia por usuario ni te atamos a contratos de permanencia tecnológica.',
  },
  {
    q: '¿Qué tecnologías utilizan para construir el software?',
    a: 'Trabajamos con el stack tecnológico más moderno, escalable y rápido del mercado: Next.js (React), TypeScript, Node.js / Go, bases de datos PostgreSQL y despliegues serverless en Vercel o AWS. Esto garantiza tiempos de respuesta instantáneos y máxima seguridad.',
  },
  {
    q: '¿Podemos migrar datos que hoy tenemos en Excel o en un sistema viejo?',
    a: 'Sí. Es uno de nuestros servicios más solicitados. Diseñamos scripts de migración y limpieza de datos para que tu información histórica de clientes, productos o transacciones pase sin pérdidas a la nueva plataforma web.',
  },
  {
    q: '¿En cuánto tiempo se entrega un sistema a la medida?',
    a: 'Los módulos y cotizadores iniciales suelen entregarse en periodos de 3 a 5 semanas. Proyectos más complejos con múltiples roles, integraciones de facturación o pagos se planifican en sprints quincenales con entregas continuas que puedes ir probando.',
  },
  {
    q: '¿Qué tipo de soporte y mantenimiento ofrecen después del lanzamiento?',
    a: 'Todos los proyectos incluyen garantía técnica post-entrega. Además, disponemos de pólizas mensuales de mantenimiento, respaldos automáticos, optimizaciones de seguridad y desarrollo de nuevas funciones a medida que tu negocio crece.',
  },
  {
    q: '¿Idea.ly emite factura fiscal mexicana (CFDI)?',
    a: 'Sí, emitimos factura fiscal por el 100% del valor de cada proyecto en pesos mexicanos más IVA.',
  },
];

const SOFTWARE_FAQS_EN = [
  {
    q: 'What is the starting cost for custom software development?',
    a: 'Our custom software engineering projects start at $25,000 MXN (~$1,500 USD) for specialized tools like web quoters, customer portals, or inventory management dashboards. Final pricing depends on technical scope defined collaboratively during our free diagnosis.',
  },
  {
    q: 'Do we own 100% of the code and intellectual property?',
    a: 'Yes, completely. Source code, databases, design assets, and architectural blueprints belong entirely to your company. We charge zero per-user monthly license fees and never lock you into proprietary vendor traps.',
  },
  {
    q: 'What technologies do you use to build the software?',
    a: 'We engineer with high-performance modern stacks: Next.js (React), TypeScript, Node.js / Go, PostgreSQL databases, and serverless edge deployment on AWS / Vercel. This guarantees sub-second responsiveness and bank-grade security.',
  },
  {
    q: 'Can you migrate our legacy Excel or outdated software data?',
    a: 'Yes. Data migration and sanitization is one of our core specialties. We build automated scripts to transfer customer, transactional, and inventory history safely into your new modern cloud system.',
  },
  {
    q: 'What is the typical delivery timeline for custom systems?',
    a: 'Initial operational portals and quoting engines typically ship within 3 to 5 weeks. Larger enterprise platforms follow bi-weekly agile sprints with interactive staging environments you can test continuously.',
  },
  {
    q: 'What warranty and maintenance do you offer after launch?',
    a: 'All deliverables include post-launch bug warranty. We also offer monthly maintenance, automated encrypted backups, security patches, and iterative feature development.',
  },
  {
    q: 'Do you issue formal tax invoices (CFDI / US W-8BEN)?',
    a: 'Yes, we provide full formal CFDI tax invoicing for Mexico as well as US / international invoicing compliance.',
  },
];

export default function CustomSoftwareFAQAccordion({ locale = 'es' }: CustomSoftwareFAQAccordionProps) {
  const isEs = locale === 'es';
  const faqs = isEs ? SOFTWARE_FAQS_ES : SOFTWARE_FAQS_EN;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {faqs.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all overflow-hidden ${
              isOpen
                ? 'bg-[#0b1c2b] border-[#00b4a6]/50 shadow-lg shadow-[#00b4a6]/5'
                : 'bg-base-100/50 border-white/10 hover:border-white/20'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#00b4a6] transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-gray-300 leading-relaxed border-t border-white/5">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
