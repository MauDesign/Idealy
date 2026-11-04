'use client';

import React, { useEffect, useState } from 'react';
import { DiagnosticoResultadoResponse } from '@/lib/diagnostico/schema';
import { trackEvent, trackScheduleConversion } from '@/lib/gtag';
import { CheckCircle2, Clock, DollarSign, AlertTriangle, ArrowRight, Calendar, Sparkles, ExternalLink } from 'lucide-react';

interface ResultadoProps {
  resultado: DiagnosticoResultadoResponse;
  nombre: string;
  email: string;
}

export default function Resultado({ resultado, nombre, email }: ResultadoProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const score = resultado.score_global || 0;
  const { operacion = 25, automatizacion = 25, ventas_web = 25, ux = 25 } = resultado.areas || {};
  const horasMes = resultado.horas_mes || 80;
  const costoMes = resultado.costo_mes || 9600;

  const rawCalLink =
    process.env.NEXT_PUBLIC_CAL_LINK ||
    process.env.NEXT_PUBLIC_CAL_URL ||
    'idealy-o2fiqr/idealy-auditorias';
  const cleanCalLink = rawCalLink.replace(/^https?:\/\/cal\.com\//, '').split('?')[0];
  const calEmbedUrl = `https://cal.com/${cleanCalLink}?embed=true&theme=light&cal.tz=America/Mexico_City&name=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}&notes=${encodeURIComponent('Diagnóstico ID: ' + resultado.id)}`;
  const calDirectUrl = `https://cal.com/${cleanCalLink}?cal.tz=America/Mexico_City&name=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}&notes=${encodeURIComponent('Diagnóstico ID: ' + resultado.id)}`;

  // Animación del número de 0 a score
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Tracking inicial del resultado (Lead) y escucha de eventos Cal.com
  useEffect(() => {
    trackEvent('generate_lead', {
      diagnostico_id: resultado.id,
      score: resultado.score_global,
      nivel: resultado.nivel,
    });

    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (
          data?.type === 'cal:bookingSuccessful' ||
          data?.event === 'bookingSuccessful' ||
          data?.action === 'bookingSuccessful' ||
          e.data?.event === 'calendly.event_scheduled'
        ) {
          trackScheduleConversion({
            cal_link: cleanCalLink,
            provider: 'cal.com',
            diagnostico_id: resultado.id,
            score: resultado.score_global,
          });
        }
      } catch {
        // Ignorar mensajes no JSON
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [resultado, cleanCalLink]);

  // Color helper según rangos (<40 Rojo, 40-69 Ámbar, >=70 Verde #00b4a6)
  const getColor = (val: number) => {
    if (val < 40) return { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-500', lightBg: 'bg-red-50' };
    if (val < 70) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-500', lightBg: 'bg-amber-50' };
    return { stroke: '#00b4a6', text: 'text-[#00b4a6]', bg: 'bg-[#00b4a6]', lightBg: 'bg-[#e6fffa]' };
  };

  const scoreColor = getColor(score);

  // SVG Gauge Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* 1. Gauge circular animado */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center flex flex-col items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          Reporte de Madurez Digital · ID {resultado.id}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mb-6">
          {nombre}, tu Madurez Digital es de{' '}
          <span className={scoreColor.text}>{score}/100</span>
        </h2>

        {/* SVG Circular Gauge */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="14"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={scoreColor.stroke}
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
              {animatedScore}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              de 100 pts
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-4 max-width-md">
          {score < 40
            ? 'Tu empresa tiene un potencial masivo de crecimiento automatizando cuellos de botella manuales.'
            : score < 70
            ? 'Tienes buenas bases, pero hay fricciones operativas que te están costando clientes e ingresos.'
            : 'Excelente madurez operativa. Estás listo para escalar a alta velocidad con agentes de IA avanzados.'}
        </p>
      </div>

      {/* 2. Cuatro barras horizontales por área */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#0069a9]" />
          Desglose por Pilares Estratégicos
        </h3>

        <div className="space-y-4">
          {[
            { label: 'Operación & Procesos Internos', value: operacion },
            { label: 'Automatización & Reducción de Tareas', value: automatizacion },
            { label: 'Ventas & Conversión Web', value: ventas_web },
            { label: 'Experiencia de Usuario (UX/UI)', value: ux },
          ].map((item, idx) => {
            const barColor = getColor(item.value);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-700">{item.label}</span>
                  <span className={barColor.text}>{item.value}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${barColor.bg}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Caja de pérdida estimada (Fondo rojo suave) */}
      <div className="bg-red-50/90 border-2 border-red-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-sm">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 text-red-600 rounded-full mb-1">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-xl sm:text-2xl font-black text-red-950">
          Tu equipo pierde ~{horasMes} horas al mes en tareas repetitivas
        </h4>
        <p className="text-base sm:text-lg font-bold text-red-700">
          ≈ ${costoMes.toLocaleString('es-MX')} MXN / mes en tiempo mal aprovechado
        </p>
        <p className="text-xs text-red-600/80">
          *Estimación calculada con base en el tamaño de tu plantilla y herramientas manuales actuales.
        </p>
      </div>

      {/* 4. Aviso de confirmación por correo */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3 text-emerald-900 shadow-sm">
        <CheckCircle2 className="w-5 h-5 text-[#00b4a6] shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          <strong>Te enviamos tu reporte detallado a: </strong>
          <span className="font-mono bg-emerald-100/60 px-1.5 py-0.5 rounded text-emerald-950 font-bold">
            {email}
          </span>
          <br />
          <span className="text-emerald-800/80 text-xs mt-1 block">
            Incluye tus 3 fugas de dinero identificadas y el orden recomendado para resolverlas. Revisa también tu carpeta de Promociones o Spam.
          </span>
        </div>
      </div>

      {/* 5. CTA Principal con Calendly embebido */}
      <div className="bg-[#0b1f33] text-white rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl text-center space-y-6">
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="inline-block bg-[#00b4a6]/20 text-[#00b4a6] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Idealy Auditoría · 15 Minutos
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Resuelve tu fuga #1 en una llamada de 15 minutos
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Revisamos tus respuestas juntos en vivo y te entregamos un plan de acción concreto que puedes ejecutar con nosotros o por tu cuenta.
          </p>
        </div>

        {/* Embebido interactivo de Cal.com */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-inner min-h-[640px] border border-slate-200">
          <iframe
            src={calEmbedUrl}
            width="100%"
            height="660"
            frameBorder="0"
            title="Agenda tu auditoría de 15 minutos con Idealy en Cal.com"
            className="w-full h-[660px] rounded-2xl"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs text-slate-400">
          <span>Sin costo · Sin compromiso · Sin rollo técnico</span>
          <a
            href={calDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#00b4a6] hover:underline font-semibold"
          >
            Abrir calendario en ventana completa <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

