'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import {
  briefSchema,
  GIRO_OPTIONS,
  OBJETIVO_OPTIONS,
  PRESENCIA_OPTIONS,
  BRIEF_QUESTIONS,
  type BriefFormData,
  type GiroOption,
  type ObjetivoOption,
} from '@/lib/pagina-express/brief-schema';
import {
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Save,
  Briefcase,
  HeartPulse,
  Utensils,
  Store,
  Building2,
  GraduationCap,
  PlusCircle,
  MessageCircle,
  PhoneCall,
  Calendar,
  FileText,
  ShoppingCart,
  Globe,
  Check,
} from 'lucide-react';

interface BriefFormProps {
  token: string;
  leadNombre?: string;
  initialData?: Partial<BriefFormData>;
  onSuccess?: (savedData: BriefFormData) => void;
  apiEndpoint?: string;
  submitButtonText?: string;
  footerNote?: string;
}

export default function BriefForm({
  token,
  leadNombre = '',
  initialData,
  onSuccess,
  apiEndpoint = '/api/pagina-express/brief',
  submitButtonText = 'Listo, confirmar mi activación',
  footerNote = 'Al completar tu información, tu asesor revisará tus respuestas antes de la videollamada para preparar propuestas a tu medida.',
}: BriefFormProps) {
  const storageKey = `idealy_brief_draft_${token || 'default'}`;

  // Form State
  const [negocioNombre, setNegocioNombre] = useState(initialData?.negocio_nombre || '');
  const [giro, setGiro] = useState<GiroOption | ''>((initialData?.giro as GiroOption) || '');
  const [giroOtro, setGiroOtro] = useState(initialData?.giro_otro || '');
  const [oferta, setOferta] = useState(initialData?.oferta || '');
  const [publico, setPublico] = useState(initialData?.publico || '');
  const [objetivo, setObjetivo] = useState<ObjetivoOption | ''>(
    (initialData?.objetivo as ObjetivoOption) || ''
  );
  const [presencia, setPresencia] = useState<string[]>(initialData?.presencia || []);
  const [links, setLinks] = useState(initialData?.links || '');
  const [comentarios, setComentarios] = useState(initialData?.comentarios || '');
  const [websiteHp, setWebsiteHp] = useState(''); // Honeypot

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // 1. Restore draft from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !token) return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.negocio_nombre && !negocioNombre) setNegocioNombre(parsed.negocio_nombre);
          if (parsed.giro && !giro) setGiro(parsed.giro);
          if (parsed.giro_otro && !giroOtro) setGiroOtro(parsed.giro_otro);
          if (parsed.oferta && !oferta) setOferta(parsed.oferta);
          if (parsed.publico && !publico) setPublico(parsed.publico);
          if (parsed.objetivo && !objetivo) setObjetivo(parsed.objetivo);
          if (Array.isArray(parsed.presencia) && presencia.length === 0) setPresencia(parsed.presencia);
          if (parsed.links && !links) setLinks(parsed.links);
          if (parsed.comentarios && !comentarios) setComentarios(parsed.comentarios);

          setDraftSavedAt('Guardamos tu avance');
        }
      }
    } catch (err) {
      console.warn('No se pudo acceder a localStorage para recuperar el borrador:', err);
    }
  }, [token, storageKey]);

  // 2. Auto-save draft
  const saveDraft = useCallback(() => {
    if (typeof window === 'undefined' || !token) return;

    try {
      const draftData = {
        negocio_nombre: negocioNombre,
        giro,
        giro_otro: giroOtro,
        oferta,
        publico,
        objetivo,
        presencia,
        links,
        comentarios,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(draftData));
      setDraftSavedAt('Guardamos tu avance');
    } catch (err) {
      console.warn('Error al guardar borrador en localStorage:', err);
    }
  }, [token, storageKey, negocioNombre, giro, giroOtro, oferta, publico, objetivo, presencia, links, comentarios]);

  useEffect(() => {
    if (negocioNombre || giro || oferta || publico || objetivo || presencia.length > 0 || links || comentarios) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [saveDraft, negocioNombre, giro, oferta, publico, objetivo, presencia, links, comentarios]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
      setDraftSavedAt(null);
      setNegocioNombre('');
      setGiro('');
      setGiroOtro('');
      setOferta('');
      setPublico('');
      setObjetivo('');
      setPresencia([]);
      setLinks('');
      setComentarios('');
      setErrors({});
    } catch (err) {
      console.warn('Error al borrar borrador:', err);
    }
  };

  // Conditional field rule: 7. links
  const showsLinksField = presencia.includes('Página web actual') || presencia.includes('Redes sociales');

  const togglePresencia = (option: string) => {
    setPresencia((prev) => {
      if (option === 'Nada todavía') {
        return prev.includes('Nada todavía') ? [] : ['Nada todavía'];
      }
      const filtered = prev.filter((item) => item !== 'Nada todavía');
      if (filtered.includes(option)) {
        return filtered.filter((item) => item !== option);
      } else {
        return [...filtered, option];
      }
    });
  };

  // Live Business Name Display for Question 2
  const cleanNegocioNombre = negocioNombre.trim();
  const negocioReferencia = cleanNegocioNombre || 'tu negocio';

  // Calculate Progress (out of 6 key questions)
  const isQ1Done = cleanNegocioNombre.length >= 2;
  const isQ2Done = giro !== '' && (giro !== 'Otro' || giroOtro.trim().length >= 2);
  const isQ3Done = oferta.trim().length >= 10;
  const isQ4Done = publico.trim().length >= 10;
  const isQ5Done = objetivo !== '';
  const isQ6Done = presencia.length > 0;

  const completedCount = [isQ1Done, isQ2Done, isQ3Done, isQ4Done, isQ5Done, isQ6Done].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 6) * 100);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    // Honeypot check
    if (websiteHp.trim() !== '') {
      setServerError('Hubo un error de validación en la solicitud.');
      return;
    }

    const payload: BriefFormData = {
      negocio_nombre: negocioNombre,
      giro: (giro as GiroOption) || ('Otro' as any),
      giro_otro: giro === 'Otro' ? giroOtro : undefined,
      oferta,
      publico,
      objetivo: (objetivo as ObjetivoOption) || ('Que me escriba por WhatsApp' as any),
      presencia,
      links: showsLinksField ? links : '',
      comentarios,
      website_hp: websiteHp,
    };

    const validation = briefSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);

      const firstErrorField = Object.keys(fieldErrors)[0];
      const element = document.getElementById(`field-${firstErrorField}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            brief: validation.data,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setServerError(data.error || 'Ocurrió un error al guardar tu brief. Intenta nuevamente.');
          return;
        }

        try {
          localStorage.removeItem(storageKey);
        } catch {
          // ignore
        }

        if (onSuccess) {
          onSuccess(validation.data);
        }
      } catch (err: any) {
        console.error('Error enviando brief:', err);
        setServerError('No pudimos conectar con el servidor. Revisa tu conexión a internet.');
      }
    });
  };

  // Helper for giro icon
  const getGiroIcon = (opt: GiroOption) => {
    switch (opt) {
      case 'Servicios profesionales':
        return <Briefcase className="w-4 h-4 shrink-0" />;
      case 'Salud y bienestar':
        return <HeartPulse className="w-4 h-4 shrink-0" />;
      case 'Restaurante o alimentos':
        return <Utensils className="w-4 h-4 shrink-0" />;
      case 'Comercio o tienda':
        return <Store className="w-4 h-4 shrink-0" />;
      case 'Construcción o inmobiliaria':
        return <Building2 className="w-4 h-4 shrink-0" />;
      case 'Educación':
        return <GraduationCap className="w-4 h-4 shrink-0" />;
      case 'Belleza':
        return <Sparkles className="w-4 h-4 shrink-0" />;
      case 'Otro':
        return <PlusCircle className="w-4 h-4 shrink-0" />;
    }
  };

  // Helper for objetivo icon
  const getObjetivoIcon = (opt: ObjetivoOption) => {
    switch (opt) {
      case 'Que me escriba por WhatsApp':
        return <MessageCircle className="w-5 h-5 text-emerald-400" />;
      case 'Que me llame':
        return <PhoneCall className="w-5 h-5 text-sky-400" />;
      case 'Que agende una cita':
        return <Calendar className="w-5 h-5 text-[#00b4a6]" />;
      case 'Que deje sus datos':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'Que compre o pague':
        return <ShoppingCart className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full">
      {/* Barra de avance delgada */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Progreso de tu información</span>
          <span className="text-[#00b4a6] font-bold">{completedCount} de 6 listas</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00b4a6] to-[#0069a9] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {serverError && (
        <div className="alert alert-error mb-6 rounded-2xl shadow-sm text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Honeypot field */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="website_hp">No llenar este campo:</label>
          <input
            id="website_hp"
            name="website_hp"
            type="text"
            tabIndex={-1}
            value={websiteHp}
            onChange={(e) => setWebsiteHp(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* ── BLOQUE 1: SOBRE TU NEGOCIO ── */}
        <section className="space-y-6">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#00b4a6]">
              Sobre tu negocio
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Los datos esenciales para entender tu propuesta y tu sector.
            </p>
          </div>

          {/* 1. negocio_nombre */}
          <div id="field-negocio_nombre" className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white">
                {BRIEF_QUESTIONS.negocio_nombre.pregunta}
              </label>
              {negocioNombre.length >= 64 && (
                <span className="text-[11px] text-amber-400 font-mono">
                  {negocioNombre.length}/80
                </span>
              )}
            </div>

            <input
              type="text"
              value={negocioNombre}
              onChange={(e) => setNegocioNombre(e.target.value)}
              placeholder={BRIEF_QUESTIONS.negocio_nombre.placeholder}
              maxLength={80}
              className={`input input-bordered w-full rounded-2xl text-sm bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 transition-all ${
                errors.negocio_nombre ? 'input-error focus:ring-error' : 'focus:border-[#00b4a6]'
              }`}
            />

            {/* Respuesta viva */}
            {cleanNegocioNombre.length >= 2 && (
              <p className="text-xs text-[#00b4a6] font-medium animate-fadeIn pl-1">
                Mucho gusto, <span className="font-bold">{cleanNegocioNombre}</span>.
              </p>
            )}

            {errors.negocio_nombre && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.negocio_nombre}
              </p>
            )}
          </div>

          {/* 2. giro (Chips) */}
          <div id="field-giro" className="space-y-2">
            <label className="text-sm font-bold text-white">
              ¿A qué se dedica {negocioReferencia}?
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {GIRO_OPTIONS.map((opt) => {
                const isSelected = giro === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGiro(opt)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#00b4a6] bg-[#00b4a6]/15 text-white ring-1 ring-[#00b4a6] shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#00b4a6]' : 'text-slate-400'}>
                      {getGiroIcon(opt)}
                    </span>
                    <span className="truncate">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Campo adicional para "Otro" */}
            {giro === 'Otro' && (
              <div id="field-giro_otro" className="pt-2 pl-3 border-l-2 border-[#00b4a6] space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-slate-300">
                  ¿Cuál es el giro de tu negocio?
                </label>
                <input
                  type="text"
                  value={giroOtro}
                  onChange={(e) => setGiroOtro(e.target.value)}
                  placeholder="Ej. Fabricación de muebles de madera, Consultoría contable"
                  maxLength={80}
                  className={`input input-sm input-bordered w-full rounded-xl text-xs bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 ${
                    errors.giro_otro ? 'input-error' : 'focus:border-[#00b4a6]'
                  }`}
                />
                {errors.giro_otro && (
                  <p className="text-xs text-error font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.giro_otro}
                  </p>
                )}
              </div>
            )}

            {errors.giro && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.giro}
              </p>
            )}
          </div>

          {/* 3. oferta */}
          <div id="field-oferta" className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white">
                {BRIEF_QUESTIONS.oferta.pregunta}
              </label>
              {oferta.length >= 320 && (
                <span className="text-[11px] text-amber-400 font-mono">
                  {oferta.length}/400
                </span>
              )}
            </div>

            <textarea
              value={oferta}
              onChange={(e) => setOferta(e.target.value)}
              placeholder={BRIEF_QUESTIONS.oferta.placeholder}
              rows={3}
              maxLength={400}
              className={`textarea textarea-bordered w-full rounded-2xl text-sm bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 leading-relaxed transition-all ${
                errors.oferta ? 'textarea-error' : 'focus:border-[#00b4a6]'
              }`}
            />
            {errors.oferta && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.oferta}
              </p>
            )}
          </div>

          {/* 4. publico */}
          <div id="field-publico" className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white">
                {BRIEF_QUESTIONS.publico.pregunta}
              </label>
              {publico.length >= 240 && (
                <span className="text-[11px] text-amber-400 font-mono">
                  {publico.length}/300
                </span>
              )}
            </div>

            <textarea
              value={publico}
              onChange={(e) => setPublico(e.target.value)}
              placeholder={BRIEF_QUESTIONS.publico.placeholder}
              rows={3}
              maxLength={300}
              className={`textarea textarea-bordered w-full rounded-2xl text-sm bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 leading-relaxed transition-all ${
                errors.publico ? 'textarea-error' : 'focus:border-[#00b4a6]'
              }`}
            />
            {errors.publico && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.publico}
              </p>
            )}
          </div>
        </section>

        {/* ── BLOQUE 2: SOBRE TU PÁGINA ── */}
        <section className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#00b4a6]">
              Sobre tu página
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cómo quieres que convierta y con qué recursos cuentas hoy.
            </p>
          </div>

          {/* 5. objetivo (Tarjetas con ícono) */}
          <div id="field-objetivo" className="space-y-2">
            <label className="text-sm font-bold text-white">
              {BRIEF_QUESTIONS.objetivo.pregunta}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {OBJETIVO_OPTIONS.map((opt) => {
                const isSelected = objetivo === opt;
                return (
                  <div
                    key={opt}
                    onClick={() => setObjetivo(opt)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#00b4a6] bg-[#00b4a6]/15 ring-1 ring-[#00b4a6] shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-800/80 shrink-0">
                      {getObjetivoIcon(opt)}
                    </div>
                    <span className="text-xs font-semibold text-white leading-snug">
                      {opt}
                    </span>
                    <div className="ml-auto shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-[#00b4a6] bg-[#00b4a6]'
                            : 'border-slate-600 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.objetivo && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.objetivo}
              </p>
            )}
          </div>

          {/* 6. presencia (Chips selección múltiple con 'Nada todavía' separado) */}
          <div id="field-presencia" className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white">
                {BRIEF_QUESTIONS.presencia.pregunta}
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Opcional</span>
            </div>
            <p className="text-xs text-slate-400">
              {BRIEF_QUESTIONS.presencia.ayuda}
            </p>

            <div className="space-y-3 pt-1">
              {/* Chips de elementos que sí tiene */}
              <div className="flex flex-wrap gap-2">
                {PRESENCIA_OPTIONS.filter((opt) => opt !== 'Nada todavía').map((opt) => {
                  const isChecked = presencia.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => togglePresencia(opt)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        isChecked
                          ? 'border-[#00b4a6] bg-[#00b4a6]/20 text-[#00b4a6]'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                          isChecked ? 'border-[#00b4a6] bg-[#00b4a6]' : 'border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Separador visual para "Nada todavía" */}
              <div className="pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => togglePresencia('Nada todavía')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    presencia.includes('Nada todavía')
                      ? 'border-slate-500 bg-slate-800 text-white'
                      : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                      presencia.includes('Nada todavía')
                        ? 'border-slate-400 bg-slate-600'
                        : 'border-slate-700'
                    }`}
                  >
                    {presencia.includes('Nada todavía') && (
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span>Nada todavía</span>
                </button>
              </div>
            </div>
          </div>

          {/* 7. links (Condicional si marcó página o redes) */}
          {showsLinksField && (
            <div id="field-links" className="space-y-2 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#00b4a6]" />
                  {BRIEF_QUESTIONS.links.pregunta}
                </label>
                <span className="text-[11px] text-slate-400">Opcional</span>
              </div>
              <input
                type="text"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder={BRIEF_QUESTIONS.links.placeholder}
                maxLength={200}
                className={`input input-bordered w-full rounded-2xl text-sm bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 ${
                  errors.links ? 'input-error' : 'focus:border-[#00b4a6]'
                }`}
              />
              {links.length >= 160 && (
                <span className="text-[11px] text-amber-400 font-mono block text-right">
                  {links.length}/200
                </span>
              )}
              {errors.links && (
                <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.links}
                </p>
              )}
            </div>
          )}

          {/* 8. comentarios */}
          <div id="field-comentarios" className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white">
                {BRIEF_QUESTIONS.comentarios.pregunta}
              </label>
              <span className="text-[11px] text-slate-400">Opcional</span>
            </div>

            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder={BRIEF_QUESTIONS.comentarios.placeholder}
              rows={3}
              maxLength={500}
              className={`textarea textarea-bordered w-full rounded-2xl text-sm bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 leading-relaxed transition-all ${
                errors.comentarios ? 'textarea-error' : 'focus:border-[#00b4a6]'
              }`}
            />
            {comentarios.length >= 400 && (
              <span className="text-[11px] text-amber-400 font-mono block text-right">
                {comentarios.length}/500
              </span>
            )}
            {errors.comentarios && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.comentarios}
              </p>
            )}
          </div>
        </section>

        {/* ── BOTÓN FINAL Y NOTA ── */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 text-center sm:text-left leading-relaxed">
            {footerNote}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Guardado discreto al pie */}
            <div className="flex items-center gap-3 order-2 sm:order-1">
              {draftSavedAt && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Save className="w-3 h-3 text-slate-500" />
                  {draftSavedAt}
                </span>
              )}
              {draftSavedAt && (
                <button
                  type="button"
                  onClick={handleClearDraft}
                  title="Borrar borrador guardado"
                  className="text-[11px] text-slate-500 hover:text-rose-400 underline transition-colors cursor-pointer"
                >
                  Borrar borrador
                </button>
              )}
            </div>

            {/* Botón Principal (ancho completo en móvil) */}
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary w-full sm:w-auto rounded-2xl px-8 font-extrabold text-sm gap-2 shadow-lg hover:shadow-[#00b4a6]/25 transition-all order-1 sm:order-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando información...
                </>
              ) : (
                <>
                  {submitButtonText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
