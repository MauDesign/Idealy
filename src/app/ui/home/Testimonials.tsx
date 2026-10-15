import React from 'react';

interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
}

interface TestimonialsProps {
  locale?: string;
  items?: TestimonialItem[];
}

export default function Testimonials({ locale = 'es', items = [] }: TestimonialsProps) {
  // Regla estricta: si el arreglo tiene menos de 2 elementos, no mostrar la sección
  if (!items || items.length < 2) {
    return null;
  }

  const isEs = locale === 'es';

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="w-full py-24 px-6 bg-[#01131b] text-white"
    >
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16 text-left">
          <span className="text-[#5eead4] font-bold text-sm tracking-wider uppercase mb-3">
            {isEs ? 'Testimonios' : 'Testimonials'}
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            {isEs ? 'Lo que dicen nuestros clientes.' : 'What our clients say.'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <figure
              key={item.id}
              className="flex flex-col justify-between p-7 rounded-2xl bg-[#0b2130] border border-white/5 shadow-xl"
            >
              <blockquote className="text-base text-slate-300 leading-relaxed mb-6">
                «{item.quote}»
              </blockquote>
              <figcaption className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-lg">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{item.name}</div>
                  <div className="text-xs text-slate-400">
                    {item.role}, {item.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
