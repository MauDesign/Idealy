'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PREGUNTAS } from '@/lib/diagnostico/preguntas';
import { DiagnosticoResultadoResponse } from '@/lib/diagnostico/schema';
import Resultado from './Resultado';
import { trackEvent } from '@/lib/gtag';
import { 
  ArrowLeft, ArrowRight, Check, CheckCircle2, ShieldCheck, 
  Sparkles, Clock, FileText, Lock, Loader2, AlertCircle 
} from 'lucide-react';

const STORAGE_KEY = 'idealy_diagnostico_draft_v1';

export default function DiagnosticoForm() {
  const searchParams = useSearchParams();

  // Pantallas: 0 = Intro, 1..12 = Preguntas, 13 = Contacto, 14 = Cargando, 15 = Resultado
  const [paso, setPaso] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [contacto, setContacto] = useState({
    nombre: '',
    empresa: '',
    email: '',
    whatsapp: '',
    sitio_url: '',
    acepto_privacidad: true,
    empresa_web_hp: '', // Honeypot
  });

  const [loadingStep, setLoadingStep] = useState(0); // 0, 1, 2 para los 3 checks animados
  const [resultado, setResultado] = useState<DiagnosticoResultadoResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Cargar UTMs de la URL
  const [utms, setUtms] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
  });

  useEffect(() => {
    if (searchParams) {
      setUtms({
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
        utm_content: searchParams.get('utm_content') || '',
        utm_term: searchParams.get('utm_term') || '',
      });
    }

    // Restaurar avance de sessionStorage si existe
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.respuestas) setRespuestas(parsed.respuestas);
        if (parsed.paso && parsed.paso < 14) setPaso(parsed.paso);
      }
    } catch {
      // Ignorar error de storage privado
    }
  }, [searchParams]);

  // Persistir en sessionStorage
  useEffect(() => {
    try {
      if (paso > 0 && paso < 14) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ paso, respuestas }));
      }
    } catch {
      // Ignorar
    }
  }, [paso, respuestas]);

  // Iniciar diagnóstico
  const handleEmpezar = () => {
    trackEvent('diagnostico_inicio', utms);
    setPaso(1);
  };

  // Seleccionar una opción en las preguntas 1 a 12
  const handleSeleccionarOpcion = (preguntaId: string, valor: string) => {
    const updated = { ...respuestas, [preguntaId]: valor };
    setRespuestas(updated);
    trackEvent(`diagnostico_paso_${paso}`, { pregunta: preguntaId, valor });

    // Avance automático con ligera transición
    setTimeout(() => {
      if (paso < PREGUNTAS.length) {
        setPaso((prev) => prev + 1);
      } else {
        setPaso(13); // Pantalla de contacto
      }
    }, 180);
  };

  // Retroceder paso
  const handleAtras = () => {
    if (paso > 0) {
      setPaso((prev) => prev - 1);
    }
  };

  // Enviar formulario a la API
  const handleSubmitContacto = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validación básica de campos
    if (!contacto.nombre.trim() || contacto.nombre.trim().length < 2) {
      setErrorMsg('Ingresa tu nombre completo');
      return;
    }
    if (!contacto.empresa.trim()) {
      setErrorMsg('Ingresa el nombre de tu empresa');
      return;
    }
    if (!contacto.email.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico válido');
      return;
    }
    const cleanPhone = contacto.whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Ingresa un número de WhatsApp a 10 dígitos');
      return;
    }
    if (!contacto.acepto_privacidad) {
      setErrorMsg('Debes aceptar el aviso de privacidad para recibir tu reporte');
      return;
    }

    setSubmitting(true);
    setPaso(14); // Pantalla de carga con checks animados

    // Animación de checks mientras se conecta
    const t1 = setTimeout(() => setLoadingStep(1), 700);
    const t2 = setTimeout(() => setLoadingStep(2), 1500);

    const fullPayload = {
      ...respuestas,
      nombre: contacto.nombre.trim(),
      empresa: contacto.empresa.trim(),
      email: contacto.email.trim(),
      whatsapp: contacto.whatsapp.trim(),
      sitio_url: contacto.sitio_url.trim(),
      acepto_privacidad: contacto.acepto_privacidad,
      empresa_web_hp: contacto.empresa_web_hp,
      ...utms,
    };

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // Limpiar storage tras éxito
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {}

        setTimeout(() => {
          setResultado(data);
          setPaso(15);
        }, 1800);
      } else {
        clearTimeout(t1);
        clearTimeout(t2);
        setPaso(13);
        setErrorMsg(data.error || 'Ocurrió un error al procesar tus respuestas. Intenta nuevamente.');
      }
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      setPaso(13);
      setErrorMsg('Error de conexión. Por favor verifica tu internet e intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================================
  // PANTALLA 15: RESULTADO
  // =========================================================================
  if (paso === 15 && resultado) {
    return <Resultado resultado={resultado} nombre={contacto.nombre} email={contacto.email} />;
  }

  // =========================================================================
  // PANTALLA 14: CARGANDO (3 Checks Animados)
  // =========================================================================
  if (paso === 14) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl text-center space-y-8 animate-fadeIn">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#00b4a6] animate-spin" />
          <Sparkles className="w-8 h-8 text-[#0069a9]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#0f172a]">
            Analizando tus respuestas…
          </h2>
          <p className="text-sm text-slate-500">
            Calculando fugas operativas y potencial de automatización
          </p>
        </div>

        {/* 3 Checks Animados */}
        <div className="space-y-4 text-left max-w-sm mx-auto">
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${loadingStep >= 0 ? 'opacity-100' : 'opacity-30'}`}>
            <CheckCircle2 className="w-5 h-5 text-[#00b4a6] shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Mapeando flujos de trabajo actuales</span>
          </div>
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${loadingStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            <CheckCircle2 className="w-5 h-5 text-[#00b4a6] shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Estimando horas y costo de tareas repetitivas</span>
          </div>
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${loadingStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
            <CheckCircle2 className="w-5 h-5 text-[#00b4a6] shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Generando tu Score de Madurez Digital</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PANTALLA 0: INTRO
  // =========================================================================
  if (paso === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-[#0b1f33] text-white rounded-3xl p-8 sm:p-14 border border-cyan-500/20 shadow-2xl text-center space-y-8 animate-fadeIn">
        <span className="inline-block bg-[#00b4a6]/20 text-[#00b4a6] text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-[#00b4a6]/30">
          Diagnóstico Digital Express 2026
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
          ¿Cuánto dinero está perdiendo tu empresa sin darse cuenta?
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-normal">
          Responde 12 preguntas rápidas y recibe tu reporte de <strong>Madurez Digital</strong> con tus 3 fugas de dinero principales.
        </p>

        {/* 3 Beneficios con check */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left py-2">
          <div className="bg-[#0f2840] p-4 rounded-xl border border-white/5 flex items-center gap-2.5">
            <Check className="w-5 h-5 text-[#00b4a6] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-200">2 minutos</span>
          </div>
          <div className="bg-[#0f2840] p-4 rounded-xl border border-white/5 flex items-center gap-2.5">
            <Check className="w-5 h-5 text-[#00b4a6] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-200">Reporte instantáneo</span>
          </div>
          <div className="bg-[#0f2840] p-4 rounded-xl border border-white/5 flex items-center gap-2.5">
            <Check className="w-5 h-5 text-[#00b4a6] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-200">Plan aplicable</span>
          </div>
        </div>

        {/* Botón principal */}
        <div className="pt-2 space-y-3">
          <button
            onClick={handleEmpezar}
            className="w-full sm:w-auto px-10 py-4 bg-[#0069a9] hover:bg-[#00558a] text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
          >
            Empezar mi diagnóstico →
          </button>
          <p className="text-xs text-slate-400 font-medium">
            Gratis · Sin compromiso · No pedimos datos bancarios
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PANTALLAS 1 A 12: PREGUNTAS
  // =========================================================================
  if (paso >= 1 && paso <= PREGUNTAS.length) {
    const currentQuestion = PREGUNTAS[paso - 1];
    const totalPreguntas = PREGUNTAS.length;
    const progreso = Math.round((paso / totalPreguntas) * 100);
    const selectedVal = respuestas[currentQuestion.id];

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 animate-fadeIn">
        {/* Barra de progreso y botón atrás */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleAtras}
            className="btn btn-ghost btn-sm text-slate-500 hover:text-slate-900 gap-1 pl-1"
          >
            <ArrowLeft className="w-4 h-4" /> Atrás
          </button>
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Pregunta {paso} de {totalPreguntas}</span>
              <span>{progreso}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0069a9] h-full rounded-full transition-all duration-300"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tarjeta de la pregunta */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] leading-tight">
              {currentQuestion.titulo}
            </h2>
            {'subtitulo' in currentQuestion && (currentQuestion as any).subtitulo && (
              <p className="text-xs sm:text-sm text-slate-500">
                {(currentQuestion as any).subtitulo}
              </p>
            )}
          </div>

          {/* Opciones Clicables */}
          <div
            role="radiogroup"
            aria-label={currentQuestion.titulo}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {currentQuestion.opciones.map((opt) => {
              const isSelected = selectedVal === opt.v;
              return (
                <button
                  key={opt.v}
                  role="radio"
                  aria-checked={isSelected}
                  type="button"
                  onClick={() => handleSeleccionarOpcion(currentQuestion.id, opt.v)}
                  className={`min-h-[58px] p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer select-none ${
                    isSelected
                      ? 'border-[#0069a9] bg-[#0069a9]/10 shadow-sm ring-1 ring-[#0069a9]'
                      : 'border-slate-200 bg-white hover:border-[#0069a9]/50 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {opt.icono && (
                      <span className="text-xl shrink-0">{opt.icono}</span>
                    )}
                    <span className="text-sm font-bold text-slate-800">
                      {opt.l}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-[#0069a9] bg-[#0069a9] text-white'
                        : 'border-slate-300 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PANTALLA 13: CONTACTO (Al final para máxima tasa de conversión)
  // =========================================================================
  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <button
          onClick={handleAtras}
          className="btn btn-ghost btn-sm text-slate-500 hover:text-slate-900 gap-1 pl-1"
        >
          <ArrowLeft className="w-4 h-4" /> Pregunta anterior
        </button>
        <span className="text-xs font-bold text-[#00b4a6] uppercase tracking-wider">
          Paso Final
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block bg-[#e6fffa] text-[#007a70] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ¡12 respuestas completadas!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a]">
            Listo. ¿A dónde te enviamos tu reporte?
          </h2>
          <p className="text-sm text-slate-500">
            Calculamos tu calificación y te enviamos tu diagnóstico de 3 fugas de dinero por correo.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitContacto} className="space-y-4">
          {/* Honeypot anti-spam oculto */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="empresa_web_hp">No llenar si eres humano</label>
            <input
              type="text"
              id="empresa_web_hp"
              name="empresa_web_hp"
              value={contacto.empresa_web_hp}
              onChange={(e) => setContacto({ ...contacto, empresa_web_hp: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Nombre */}
          <div className="form-control">
            <label className="label p-1">
              <span className="text-xs font-bold text-slate-700">Tu nombre completo *</span>
            </label>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Ej. Carlos Mendoza"
              className="input input-bordered w-full rounded-xl text-sm"
              value={contacto.nombre}
              onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })}
            />
          </div>

          {/* Empresa */}
          <div className="form-control">
            <label className="label p-1">
              <span className="text-xs font-bold text-slate-700">Nombre de tu empresa o negocio *</span>
            </label>
            <input
              type="text"
              name="empresa"
              required
              placeholder="Ej. Distribuidora del Centro"
              className="input input-bordered w-full rounded-xl text-sm"
              value={contacto.empresa}
              onChange={(e) => setContacto({ ...contacto, empresa: e.target.value })}
            />
          </div>

          {/* Email y WhatsApp en 2 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label p-1">
                <span className="text-xs font-bold text-slate-700">Correo empresarial *</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="carlos@empresa.com"
                className="input input-bordered w-full rounded-xl text-sm"
                value={contacto.email}
                onChange={(e) => setContacto({ ...contacto, email: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="text-xs font-bold text-slate-700">WhatsApp (10 dígitos) *</span>
              </label>
              <input
                type="tel"
                name="whatsapp"
                required
                placeholder="222 123 4567"
                className="input input-bordered w-full rounded-xl text-sm"
                value={contacto.whatsapp}
                onChange={(e) => setContacto({ ...contacto, whatsapp: e.target.value })}
              />
            </div>
          </div>

          {/* Sitio web opcional */}
          <div className="form-control">
            <label className="label p-1">
              <span className="text-xs font-bold text-slate-700">
                Sitio web actual <span className="text-slate-400 font-normal">(opcional)</span>
              </span>
            </label>
            <input
              type="url"
              name="sitio_url"
              placeholder="https://tuempresa.com"
              className="input input-bordered w-full rounded-xl text-sm"
              value={contacto.sitio_url}
              onChange={(e) => setContacto({ ...contacto, sitio_url: e.target.value })}
            />
          </div>

          {/* Checkbox Privacidad LFPDPPP */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="privacidad"
              checked={contacto.acepto_privacidad}
              onChange={(e) => setContacto({ ...contacto, acepto_privacidad: e.target.checked })}
              className="checkbox checkbox-primary checkbox-sm mt-0.5"
              required
            />
            <label htmlFor="privacidad" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
              Acepto recibir mi reporte de Madurez Digital y autorizo el tratamiento de mis datos conforme al{' '}
              <a
                href="/es/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0069a9] font-bold underline"
              >
                Aviso de Privacidad (LFPDPPP)
              </a>
              .
            </label>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#0069a9] hover:bg-[#00558a] text-white font-extrabold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Procesando respuestas...
              </>
            ) : (
              <>
                Ver mi resultado →
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

