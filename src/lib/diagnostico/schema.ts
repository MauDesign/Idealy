import { z } from 'zod';

export const diagnosticoInputSchema = z.object({
  // Preguntas obligatorias del cuestionario
  giro: z.enum([
    'comercio',
    'servicios',
    'restaurante',
    'manufactura',
    'salud',
    'educacion',
    'inmobiliaria',
    'otro',
  ]),
  tamano: z.enum(['1-5', '6-20', '21-50', '50+']),
  registro_ventas: z.enum(['papel', 'excel', 'sistema_basico', 'crm']),
  sistemas_conectados: z.enum(['no', 'algunos', 'todos']),
  horas_repetitivas: z.enum(['0-5', '5-15', '15-30', '30+']),
  seguimiento: z.enum(['ninguno', 'manual', 'recordatorios', 'automatizado']),
  sitio_web: z.enum(['no_tengo', 'no_trae', 'algunos', 'principal']),
  movil: z.enum(['no_tengo', 'no_se', 'regular', 'si']),
  autoservicio: z.enum(['no', 'parcial', 'si']),
  dolor: z.enum(['tiempo', 'ventas', 'errores', 'imagen', 'escalar']),
  presupuesto: z.enum(['<20k', '20-50k', '50-150k', '150k+']),
  urgencia: z.enum(['este_mes', '3_meses', 'explorando']),

  // Datos de contacto (Pantalla 13)
  nombre: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  empresa: z.string().trim().min(2, 'Indica el nombre de tu empresa o negocio'),
  email: z.string().trim().email('Por favor ingresa un correo electrónico válido'),
  whatsapp: z
    .string()
    .trim()
    .min(10, 'El WhatsApp debe tener 10 dígitos')
    .regex(/^[0-9+ -]{10,18}$/, 'Ingresa un número telefónico válido'),
  sitio_url: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
  acepto_privacidad: z.literal(true, {
    message: 'Debes aceptar el aviso de privacidad para continuar',
  }),

  // Honeypot anti-spam (debe venir vacío)
  empresa_web_hp: z.string().optional().or(z.literal('')),

  // Atribución de marketing (opcional)
  utm_source: z.string().optional().default(''),
  utm_medium: z.string().optional().default(''),
  utm_campaign: z.string().optional().default(''),
  utm_content: z.string().optional().default(''),
  utm_term: z.string().optional().default(''),
});

export type DiagnosticoInput = z.infer<typeof diagnosticoInputSchema>;

export interface DiagnosticoResultadoResponse {
  ok: boolean;
  id: string;
  score_global: number;
  areas: {
    operacion: number;
    automatizacion: number;
    ventas_web: number;
    ux: number;
  };
  horas_mes: number;
  costo_mes: number;
  nivel: 'HOT' | 'WARM' | 'COLD' | string;
  fallback?: boolean;
}

