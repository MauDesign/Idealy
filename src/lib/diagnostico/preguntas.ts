// lib/diagnostico/preguntas.ts
// IDs y valores EXACTOS, n8n depende de ellos

export interface OpcionPregunta {
  v: string;
  l: string;
  icono?: string;
  subtexto?: string;
}

export interface PreguntaDiagnostico {
  id: string;
  titulo: string;
  subtitulo?: string;
  opciones: readonly { v: string; l: string; icono?: string }[];
}

export const PREGUNTAS = [
  {
    id: 'giro',
    titulo: '¿A qué se dedica tu empresa?',
    opciones: [
      { v: 'comercio', l: 'Comercio / tienda', icono: '🏪' },
      { v: 'servicios', l: 'Servicios profesionales', icono: '💼' },
      { v: 'restaurante', l: 'Restaurante / alimentos', icono: '🍽️' },
      { v: 'manufactura', l: 'Manufactura / industria', icono: '🏭' },
      { v: 'salud', l: 'Salud / bienestar', icono: '🩺' },
      { v: 'educacion', l: 'Educación', icono: '🎓' },
      { v: 'inmobiliaria', l: 'Inmobiliaria / construcción', icono: '🏗️' },
      { v: 'otro', l: 'Otro', icono: '✨' },
    ],
  },
  {
    id: 'tamano',
    titulo: '¿Cuántas personas trabajan contigo?',
    opciones: [
      { v: '1-5', l: '1 a 5 personas', icono: '👤' },
      { v: '6-20', l: '6 a 20 personas', icono: '👥' },
      { v: '21-50', l: '21 a 50 personas', icono: '🏢' },
      { v: '50+', l: 'Más de 50 personas', icono: '🏬' },
    ],
  },
  {
    id: 'registro_ventas',
    titulo: '¿Cómo llevan el registro de ventas y clientes?',
    opciones: [
      { v: 'papel', l: 'En papel o libreta', icono: '📝' },
      { v: 'excel', l: 'En Excel / Google Sheets', icono: '📊' },
      { v: 'sistema_basico', l: 'En un sistema, pero básico', icono: '💻' },
      { v: 'crm', l: 'En un CRM o ERP bien implementado', icono: '⚡' },
    ],
  },
  {
    id: 'sistemas_conectados',
    titulo: '¿Tus herramientas (ventas, inventario, facturación) se comunican entre sí?',
    opciones: [
      { v: 'no', l: 'No, copiamos datos a mano', icono: '❌' },
      { v: 'algunos', l: 'Algunas sí, otras no', icono: '🔄' },
      { v: 'todos', l: 'Sí, todo está conectado', icono: '✅' },
    ],
  },
  {
    id: 'horas_repetitivas',
    titulo: '¿Cuántas horas a la semana se van en tareas repetitivas?',
    subtitulo: '(captura, reportes, traspaso de información, responder los mismos mensajes)',
    opciones: [
      { v: '0-5', l: 'Menos de 5 horas', icono: '🟢' },
      { v: '5-15', l: '5 a 15 horas', icono: '🟡' },
      { v: '15-30', l: '15 a 30 horas', icono: '🟠' },
      { v: '30+', l: 'Más de 30 horas', icono: '🔴' },
    ],
  },
  {
    id: 'seguimiento',
    titulo: 'Cuando llega un prospecto, ¿cómo le dan seguimiento?',
    opciones: [
      { v: 'ninguno', l: 'Muchas veces se nos pasa', icono: '⏳' },
      { v: 'manual', l: 'A mano por WhatsApp o llamada', icono: '📱' },
      { v: 'recordatorios', l: 'Con recordatorios o agenda', icono: '📅' },
      { v: 'automatizado', l: 'Automático (CRM, bots, correos)', icono: '🤖' },
    ],
  },
  {
    id: 'sitio_web',
    titulo: '¿Tu sitio web te trae clientes?',
    opciones: [
      { v: 'no_tengo', l: 'No tengo sitio web', icono: '🚫' },
      { v: 'no_trae', l: 'Tengo, pero no trae clientes', icono: '😴' },
      { v: 'algunos', l: 'Trae algunos clientes', icono: '📈' },
      { v: 'principal', l: 'Es uno de mis canales principales', icono: '🚀' },
    ],
  },
  {
    id: 'movil',
    titulo: '¿Tu sitio se ve y funciona bien en celular?',
    opciones: [
      { v: 'no_tengo', l: 'No tengo sitio', icono: '🚫' },
      { v: 'no_se', l: 'No lo sé', icono: '🤔' },
      { v: 'regular', l: 'Más o menos / regular', icono: '📱' },
      { v: 'si', l: 'Sí, perfecto y rápido', icono: '✨' },
    ],
  },
  {
    id: 'autoservicio',
    titulo: '¿Tus clientes pueden cotizar, comprar o agendar en línea sin hablar con alguien?',
    opciones: [
      { v: 'no', l: 'No, todo requiere atención manual', icono: '❌' },
      { v: 'parcial', l: 'Solo una parte del proceso', icono: '🔄' },
      { v: 'si', l: 'Sí, es 100% autoservicio', icono: '✅' },
    ],
  },
  {
    id: 'dolor',
    titulo: 'Si pudieras resolver UNA cosa este mes, ¿cuál sería?',
    opciones: [
      { v: 'tiempo', l: 'Dejar de perder tiempo en tareas manuales', icono: '⏱️' },
      { v: 'ventas', l: 'Conseguir más clientes y cerrar ventas', icono: '💰' },
      { v: 'errores', l: 'Eliminar errores operativos y desorden', icono: '🎯' },
      { v: 'imagen', l: 'Verme más profesional y confiable en línea', icono: '🌟' },
      { v: 'escalar', l: 'Crecer el negocio sin contratar más gente', icono: '📈' },
    ],
  },
  {
    id: 'presupuesto',
    titulo: 'Si la solución se paga sola, ¿cuánto podrías invertir?',
    opciones: [
      { v: '<20k', l: 'Menos de $20,000 MXN', icono: '🌱' },
      { v: '20-50k', l: '$20,000 – $50,000 MXN', icono: '⚡' },
      { v: '50-150k', l: '$50,000 – $150,000 MXN', icono: '🚀' },
      { v: '150k+', l: 'Más de $150,000 MXN', icono: '💎' },
    ],
  },
  {
    id: 'urgencia',
    titulo: '¿Para cuándo quieres resolverlo?',
    opciones: [
      { v: 'este_mes', l: 'Este mes (lo antes posible)', icono: '🔥' },
      { v: '3_meses', l: 'En los próximos 3 meses', icono: '🗓️' },
      { v: 'explorando', l: 'Solo estoy explorando opciones', icono: '👀' },
    ],
  },
] as const;

export type PreguntaId = (typeof PREGUNTAS)[number]['id'];

