'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { MessageSquare, Zap } from 'lucide-react';

interface HeroVisualProps {
  locale?: string;
}

export default function HeroVisual({ locale = 'es' }: HeroVisualProps) {
  const isEs = locale === 'es';
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-xl lg:max-w-2xl mx-auto aspect-[4/3] select-none"
      style={{ perspective: 1000 }}
    >
      {/* Halo de luz ambiental con pulsación suave */}
      <div
        className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-tr from-primary/25 via-cyan-500/20 to-teal-400/10 blur-[80px] animate-pulse-aura pointer-events-none"
        aria-hidden="true"
      />

      {/* Contenedor principal con efecto Tilt 3D */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/15 bg-[#011b27] transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Imagen principal (mockup laptop + smartphone) */}
        <Image
          src="/img/hero-showcase.jpg"
          alt={
            isEs
              ? 'Sitio web y versión móvil diseñados por Idea.ly recibiendo prospectos.'
              : 'High-impact web platform and mobile responsive software designed by Idea.ly.'
          }
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
        />

        {/* Gradiente cinematográfico */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none"
          aria-hidden="true"
        />

        {/* ─── Tarjeta Flotante 1: Notificación WhatsApp (Interior Superior Izquierda) ─── */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 animate-float-badge-1 pointer-events-none sm:pointer-events-auto">
          <div className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#011b27]/85 backdrop-blur-md border border-[#25D366]/40 shadow-xl shadow-black/40 text-white">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#25D366]/20 text-[#25D366] shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
              </span>
            </div>
            <div className="flex flex-col text-left pr-1">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
                {isEs ? 'Nuevo prospecto WhatsApp' : 'New WhatsApp Lead'}
              </span>
              <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1">
                +$18,500 MXN{' '}
                <span className="text-[10px] font-normal text-emerald-400">
                  {isEs ? '· En vivo' : '· Live'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ─── Tarjeta Flotante 2: Cotización IA (Interior Inferior Derecha) ─── */}
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 animate-float-badge-2 pointer-events-none sm:pointer-events-auto">
          <div className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#011b27]/85 backdrop-blur-md border border-primary/50 shadow-xl shadow-black/40 text-white">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-primary/20 text-primary shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
            </div>
            <div className="flex flex-col text-left pr-1">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
                {isEs ? 'Cotización automatizada' : 'Automated Quote'}
              </span>
              <span className="text-xs sm:text-sm font-black text-[#5eead4] flex items-center gap-1">
                {isEs ? 'Enviada en 45 seg' : 'Sent in 45s'}{' '}
                <span className="text-[11px] font-bold text-primary">✓</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
