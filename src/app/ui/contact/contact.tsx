import React from 'react';
import Image from 'next/image';
import ContactForm from '@/app/ui/contactForm/contactForm';
import WhatsAppContactLink from './WhatsAppContactLink';

interface ContactProps {
  locale?: string;
}

export default function Contact({ locale = 'es' }: ContactProps) {
  const isEs = locale === 'es';

  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="w-full bg-primary text-white py-24 px-6 relative overflow-hidden"
    >
      <div className="w-11/12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          
          {/* Columna Izquierda: Texto + Botón WhatsApp + Datos */}
          <div className="flex flex-col items-start text-left max-w-xl">
            {/* Logo corregido con alt "Idea.ly" */}
            <div className="mb-8">
              <Image
                src="/img/Logo-Idealy.png"
                alt="Idea.ly"
                width={180}
                height={55}
                className="brightness-0 invert object-contain"
              />
            </div>

            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4"
            >
              {isEs ? 'Cuéntanos qué necesitas.' : 'Tell us what you need.'}
            </h2>

            <p className="text-lg text-white/90 leading-relaxed mb-8">
              {isEs
                ? 'Te respondemos en menos de 24 horas con una recomendación concreta. Sin compromiso.'
                : 'We will respond in less than 24 hours with a concrete recommendation. No commitment required.'}
            </p>

            {/* Botón blanco con ícono de WhatsApp */}
            <WhatsAppContactLink isEs={isEs} />

            {/* Datos */}
            <div className="text-sm text-white/90 font-medium">
              +52 222 717 9352 · Puebla, México
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Blanca con Formulario */}
          <div className="w-full bg-white rounded-2xl p-8 sm:p-10 shadow-2xl">
            <ContactForm locale={locale} />
          </div>

        </div>
      </div>
    </section>
  );
}
