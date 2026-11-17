import { z } from 'zod';

export const GIRO_OPTIONS = [
  'Servicios profesionales',
  'Salud y bienestar',
  'Restaurante o alimentos',
  'Comercio o tienda',
  'Construcción o inmobiliaria',
  'Educación',
  'Belleza',
  'Otro',
] as const;

export type GiroOption = (typeof GIRO_OPTIONS)[number];

export const OBJETIVO_OPTIONS = [
  'Que me escriba por WhatsApp',
  'Que me llame',
  'Que agende una cita',
  'Que deje sus datos',
  'Que compre o pague',
] as const;

export type ObjetivoOption = (typeof OBJETIVO_OPTIONS)[number];

export const PRESENCIA_OPTIONS = [
  'Logo',
  'Fotos de mi negocio',
  'Dominio',
  'Página web actual',
  'Redes sociales',
  'Nada todavía',
] as const;

export type PresenciaOption = (typeof PRESENCIA_OPTIONS)[number];

export const briefSchema = z
  .object({
    // 1. negocio_nombre: 2 a 80 caracteres (Obligatorio)
    negocio_nombre: z
      .string()
      .trim()
      .min(2, 'El nombre de tu negocio debe tener al menos 2 caracteres')
      .max(80, 'El nombre de tu negocio no puede exceder los 80 caracteres'),

    // 2. giro: select (Obligatorio)
    giro: z.enum(GIRO_OPTIONS, {
      message: 'Por favor selecciona a qué se dedica tu negocio',
    }),
    giro_otro: z
      .string()
      .trim()
      .max(80, 'La descripción del giro no debe superar 80 caracteres')
      .optional()
      .or(z.literal('')),

    // 3. oferta: 10 a 400 caracteres (Obligatorio)
    oferta: z
      .string()
      .trim()
      .min(10, 'Cuéntanos un poco más sobre lo que quieres vender (mínimo 10 caracteres)')
      .max(400, 'La descripción de la oferta no puede exceder los 400 caracteres'),

    // 4. publico: 10 a 300 caracteres (Obligatorio)
    publico: z
      .string()
      .trim()
      .min(10, 'Describe a tu cliente ideal (mínimo 10 caracteres)')
      .max(300, 'La descripción del público no puede exceder los 300 caracteres'),

    // 5. objetivo: radio (Obligatorio)
    objetivo: z.enum(OBJETIVO_OPTIONS, {
      message: 'Selecciona qué acción esperas que realicen en tu página',
    }),

    // 6. presencia: checkboxes (No obligatorio)
    presencia: z.array(z.string()).default([]),

    // 7. links: texto corto, hasta 200 caracteres (No obligatorio, condicional a presencia)
    links: z
      .string()
      .trim()
      .max(200, 'Los enlaces no pueden exceder los 200 caracteres')
      .optional()
      .or(z.literal('')),

    // 8. comentarios: texto largo, hasta 500 caracteres (No obligatorio)
    comentarios: z
      .string()
      .trim()
      .max(500, 'Los comentarios no pueden exceder los 500 caracteres')
      .optional()
      .or(z.literal('')),

    // Honeypot anti-bot
    website_hp: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    // Si seleccionó 'Otro' en giro, requerir especificación
    if (data.giro === 'Otro') {
      const otro = (data.giro_otro || '').trim();
      if (!otro || otro.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['giro_otro'],
          message: 'Por favor especifica el giro de tu negocio (al menos 2 caracteres)',
        });
      }
    }
  });

export type BriefFormData = z.infer<typeof briefSchema>;

export const BRIEF_QUESTIONS = {
  negocio_nombre: {
    key: 'negocio_nombre',
    pregunta: '¿Cómo se llama tu negocio?',
    tipo: 'Texto corto',
    obligatorio: true,
    min: 2,
    max: 80,
    placeholder: 'Ej. Dental Sonríe',
  },
  giro: {
    key: 'giro',
    pregunta: '¿A qué se dedica',
    tipo: 'Chips',
    obligatorio: true,
    opciones: GIRO_OPTIONS,
  },
  oferta: {
    key: 'oferta',
    pregunta: '¿Qué es lo que más te gustaría vender con tu página?',
    tipo: 'Texto largo',
    obligatorio: true,
    min: 10,
    max: 400,
    placeholder: 'Ej. Limpieza dental y ortodoncia en Puebla',
  },
  publico: {
    key: 'publico',
    pregunta: '¿Quién te compra normalmente?',
    tipo: 'Texto largo',
    obligatorio: true,
    min: 10,
    max: 300,
    placeholder: 'Ej. Familias de la zona de Angelópolis',
  },
  objetivo: {
    key: 'objetivo',
    pregunta: 'Cuando alguien entre a tu página, ¿qué te gustaría que hiciera?',
    tipo: 'Tarjetas',
    obligatorio: true,
    opciones: OBJETIVO_OPTIONS,
  },
  presencia: {
    key: 'presencia',
    pregunta: '¿Con qué cuentas hoy?',
    ayuda: 'Marca todo lo que tengas. Si no tienes nada, no pasa nada: te ayudamos.',
    tipo: 'Chips múltiples',
    obligatorio: false,
    opciones: PRESENCIA_OPTIONS,
  },
  links: {
    key: 'links',
    pregunta: 'Déjanos el link de tu página o redes',
    tipo: 'Texto corto',
    obligatorio: false,
    max: 200,
    placeholder: 'Ej. instagram.com/tunegocio',
  },
  comentarios: {
    key: 'comentarios',
    pregunta: '¿Algo más que quieras contarnos?',
    ayuda: 'Una idea, una página que te guste, una duda.',
    tipo: 'Texto largo',
    obligatorio: false,
    max: 500,
    placeholder: 'Una idea, una página que te guste, una duda.',
  },
} as const;
