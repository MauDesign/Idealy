import { NextRequest, NextResponse } from 'next/server';
import { diagnosticoInputSchema } from '@/lib/diagnostico/schema';
import { prisma } from '@/lib/prisma';

// Rate Limiting en memoria: Máximo 3 envíos por IP cada 10 minutos
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutos
  const record = rateLimitMap.get(ip);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return false;
  }

  if (record.count >= 3) {
    return true;
  }

  record.count += 1;
  return false;
}

// Cálculo de score de fallback en caso de que n8n no esté configurado o falle la conexión
function calcularScoreFallback(data: any) {
  let operacion = 75;
  let automatizacion = 60;
  let ventas_web = 60;
  let ux = 60;

  // Registro de ventas
  if (data.registro_ventas === 'papel') operacion -= 40;
  else if (data.registro_ventas === 'excel') operacion -= 25;
  else if (data.registro_ventas === 'sistema_basico') operacion -= 10;
  else if (data.registro_ventas === 'crm') operacion += 15;

  // Sistemas conectados
  if (data.sistemas_conectados === 'no') {
    operacion -= 30;
    automatizacion -= 35;
  } else if (data.sistemas_conectados === 'algunos') {
    operacion -= 10;
    automatizacion -= 15;
  } else {
    automatizacion += 25;
  }

  // Horas repetitivas
  let horas_semana = 5;
  if (data.horas_repetitivas === '0-5') {
    horas_semana = 4;
    automatizacion += 10;
  } else if (data.horas_repetitivas === '5-15') {
    horas_semana = 10;
    automatizacion -= 10;
  } else if (data.horas_repetitivas === '15-30') {
    horas_semana = 22;
    automatizacion -= 25;
  } else if (data.horas_repetitivas === '30+') {
    horas_semana = 35;
    automatizacion -= 40;
  }

  // Seguimiento
  if (data.seguimiento === 'ninguno') {
    ventas_web -= 35;
    operacion -= 20;
  } else if (data.seguimiento === 'manual') {
    ventas_web -= 15;
    automatizacion -= 15;
  } else if (data.seguimiento === 'recordatorios') {
    ventas_web += 5;
  } else if (data.seguimiento === 'automatizado') {
    ventas_web += 25;
    automatizacion += 20;
  }

  // Sitio web
  if (data.sitio_web === 'no_tengo') {
    ventas_web -= 40;
    ux -= 30;
  } else if (data.sitio_web === 'no_trae') {
    ventas_web -= 25;
    ux -= 20;
  } else if (data.sitio_web === 'algunos') {
    ventas_web += 5;
  } else if (data.sitio_web === 'principal') {
    ventas_web += 25;
  }

  // Móvil
  if (data.movil === 'no_tengo' || data.movil === 'no_se') {
    ux -= 25;
  } else if (data.movil === 'regular') {
    ux -= 15;
  } else if (data.movil === 'si') {
    ux += 20;
  }

  // Autoservicio
  if (data.autoservicio === 'no') {
    automatizacion -= 20;
    ux -= 15;
  } else if (data.autoservicio === 'parcial') {
    automatizacion += 5;
  } else if (data.autoservicio === 'si') {
    automatizacion += 20;
    ux += 15;
  }

  const clamp = (val: number) => Math.max(10, Math.min(95, Math.round(val)));
  operacion = clamp(operacion);
  automatizacion = clamp(automatizacion);
  ventas_web = clamp(ventas_web);
  ux = clamp(ux);

  const score_global = Math.round((operacion + automatizacion + ventas_web + ux) / 4);
  const horas_mes = horas_semana * 4;
  const costo_mes = horas_mes * 120; // Estimación promedio MXN/hora

  let nivel = 'HOT';
  if (score_global > 65) nivel = 'COLD';
  else if (score_global > 40) nivel = 'WARM';

  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const id = `DX-${randomSuffix}`;

  return {
    ok: true,
    id,
    score_global,
    areas: {
      operacion,
      automatizacion,
      ventas_web,
      ux,
    },
    horas_mes,
    costo_mes,
    nivel,
    fallback: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Obtener IP y aplicar rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor espera unos minutos antes de intentar de nuevo.' },
        { status: 429 }
      );
    }

    // 2. Parsear y validar el body con Zod
    const rawBody = await req.json();
    const parseResult = diagnosticoInputSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Datos incompletos o inválidos',
          issues: parseResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 3. Honeypot check (anti-spam)
    if (data.empresa_web_hp && data.empresa_web_hp.trim() !== '') {
      // Respondemos 200 falso sin hacer nada para engañar a los bots
      return NextResponse.json({ ok: true, id: 'DX-SPAM-FILTERED' }, { status: 200 });
    }

    // 4. Guardar respaldo del lead en base de datos PostgreSQL mediante Prisma
    try {
      const resumenTexto = `📊 DIAGNÓSTICO DIGITAL EXPRESS
• Empresa: ${data.empresa}
• Giro: ${data.giro}
• Equipo: ${data.tamano} personas
• Registro de ventas: ${data.registro_ventas}
• Sistemas conectados: ${data.sistemas_conectados}
• Horas en tareas repetitivas: ${data.horas_repetitivas} hrs/semana
• Seguimiento comercial: ${data.seguimiento}
• Sitio web: ${data.sitio_web} (Móvil: ${data.movil})
• Autoservicio en línea: ${data.autoservicio}
• Dolor prioritario: ${data.dolor}
• Inversión viable: ${data.presupuesto}
• Urgencia de solución: ${data.urgencia}
${data.sitio_url ? `• Sitio web actual: ${data.sitio_url}\n` : ''}• Origen UTM: ${data.utm_source || 'directo'} / ${data.utm_campaign || '-'}`;

      await prisma.contact.create({
        data: {
          name: data.nombre,
          email: data.email,
          whatsapp: data.whatsapp,
          subject: `Diagnóstico Digital: ${data.empresa}`,
          message: resumenTexto,
        },
      });
    } catch (dbErr) {
      console.error('Error guardando diagnóstico en DB:', dbErr);
    }

    // 5. Payload plano exacto para n8n
    const n8nPayload = {
      nombre: data.nombre,
      empresa: data.empresa,
      email: data.email,
      whatsapp: data.whatsapp,
      sitio_url: data.sitio_url || '',
      giro: data.giro,
      tamano: data.tamano,
      registro_ventas: data.registro_ventas,
      sistemas_conectados: data.sistemas_conectados,
      horas_repetitivas: data.horas_repetitivas,
      seguimiento: data.seguimiento,
      sitio_web: data.sitio_web,
      movil: data.movil,
      autoservicio: data.autoservicio,
      dolor: data.dolor,
      presupuesto: data.presupuesto,
      urgencia: data.urgencia,
      utm_source: data.utm_source || '',
      utm_medium: data.utm_medium || '',
      utm_campaign: data.utm_campaign || '',
      utm_content: data.utm_content || '',
      utm_term: data.utm_term || '',
      empresa_web_hp: '',
    };

    const n8nUrl = process.env.N8N_DIAGNOSTICO_URL;
    const n8nSecret = process.env.N8N_DIAGNOSTICO_SECRET || '';

    // 6. Si n8n está configurado, despachamos con timeout de 15s
    if (n8nUrl && n8nUrl.startsWith('http')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const n8nResponse = await fetch(n8nUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idealy-Secret': n8nSecret,
          },
          body: JSON.stringify(n8nPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (n8nResponse.ok) {
          const result = await n8nResponse.json();
          return NextResponse.json(result);
        } else {
          console.warn(`n8n respondió con status ${n8nResponse.status}, usando cálculo de fallback`);
        }
      } catch (n8nErr: any) {
        console.error('Error o timeout al conectar con n8n:', n8nErr.message || n8nErr);
      }
    }

    // 7. Fallback inteligente: si n8n no está o falló, calculamos el reporte para no perder al usuario
    const fallbackResult = calcularScoreFallback(data);
    return NextResponse.json(fallbackResult);
  } catch (err: any) {
    console.error('Error procesando diagnóstico:', err);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu diagnóstico. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}

