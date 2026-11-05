const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'n8n_diagnostico_seguimiento_workflow.json');
const workflow = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Código JS para el nodo 'code-consolidar-mensajes'
const codeConsolidar = `// 1. Obtener datos consolidados
const data = $input.first().json;
const nombre = (data.nombre || 'Emprendedor').trim();
const empresa = (data.empresa || 'Empresa').trim();
const email = (data.email || '').trim().toLowerCase();
const score = data.score_global || 50;
const areas = data.areas || { operacion: 50, automatizacion: 50, ventas_web: 50, ux: 50 };
const horasMes = data.horas_mes || 20;
const costoMes = (data.costo_mes || 2400).toLocaleString('es-MX');
const calUrl = 'https://cal.com/idealy-o2fiqr/idealy-auditorias?name=' + encodeURIComponent(nombre) + '&email=' + encodeURIComponent(email);

// 2. Diagnóstico específico de los 4 pilares
let descOperacion = '';
if (data.registro_ventas === 'papel') {
  descOperacion = 'Tu control comercial se lleva en papel o notas físicas. Esto genera riesgo alto de extravío de pedidos y nula visibilidad para planear compras o ventas.';
} else if (data.registro_ventas === 'excel') {
  descOperacion = 'Tu información vive en hojas de cálculo aisladas. Aunque ayuda al registro, requiere recaptura manual continua y no avisa de seguimientos pendientes a prospectos.';
} else if (data.registro_ventas === 'sistema_basico') {
  descOperacion = 'Cuentas con un software básico, pero al no comunicarse con tus otros canales se producen islas de datos y procesos desarticulados.';
} else {
  descOperacion = 'Cuentas con un CRM o sistema estructurado que centraliza tu operación, ofreciendo una base sólida para crecer.';
}

let descAutomatizacion = '';
if (data.horas_repetitivas === '30+' || data.horas_repetitivas === '15-30') {
  descAutomatizacion = 'Inviertes más de 15 horas a la semana en tareas repetitivas (cotizaciones, facturas, captura de datos). Esto representa una fuga de aproximadamente $' + costoMes + ' MXN al mes en tiempo de equipo.';
} else if (data.horas_repetitivas === '5-15') {
  descAutomatizacion = 'Dedicas entre 5 y 15 horas semanales a tareas que un flujo automático o bot de WhatsApp podría resolver en segundos.';
} else {
  descAutomatizacion = 'Tus procesos manuales son relativamente ágiles, lo que te permite concentrarte en el cierre de ventas y la entrega del servicio.';
}

let descVentasWeb = '';
if (data.sitio_web === 'no_tengo') {
  descVentasWeb = 'Al no contar con página web propia, dependes al 100% del boca a boca o redes sociales. Cada cliente que busca tus servicios en Google termina comprando a tu competencia.';
} else if (data.sitio_web === 'no_trae') {
  descVentasWeb = 'Tu sitio web actual no convierte visitas en prospectos. Suele deberse a falta de textos persuasivos orientados a la venta, tiempos de carga lentos o ausencia de botón directo a WhatsApp.';
} else {
  descVentasWeb = 'Tu presencia digital atrae prospectos, pero existen oportunidades para optimizar el embudo y aumentar el porcentaje de conversión.';
}

let descUx = '';
if (data.movil === 'no_tengo' || data.movil === 'no_se' || data.movil === 'regular') {
  descUx = 'El 85%+ de tus clientes potenciales te buscan desde un celular. Si la experiencia en pantalla chica es incómoda, lenta o poco clara, los usuarios abandonan el sitio en menos de 3 segundos.';
} else if (data.autoservicio === 'no') {
  descUx = 'Tus clientes no pueden consultar catálogos, agendar ni autogestionar dudas frecuentes, obligando a tu equipo a responder lo mismo una y otra vez.';
} else {
  descUx = 'Ofreces una experiencia accesible que facilita que el cliente conozca tu oferta e inicie contacto con rapidez.';
}

const badgeColor = (val) => {
  if (val < 45) return { bg: '#fee2e2', text: '#991b1b', border: '#f87171', label: 'Crítico' };
  if (val < 70) return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', label: 'Mejorable' };
  return { bg: '#dcfce7', text: '#166534', border: '#86efac', label: 'Saludable' };
};

const stOp = badgeColor(areas.operacion);
const stAut = badgeColor(areas.automatizacion);
const stVw = badgeColor(areas.ventas_web);
const stUx = badgeColor(areas.ux);

// 3. Bloque dinámico de Presencia Web para Email
let seccionWebHTML = '';
if (data.web_audit_realizada && data.sitio_url) {
  const perfScore = data.web_perf_score || 0;
  const perfColor = perfScore >= 80 ? '#10b981' : perfScore >= 50 ? '#f59e0b' : '#ef4444';
  
  seccionWebHTML = '<div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 22px; margin-bottom: 24px;">' +
    '<span style="background-color: #00b4a6; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 6px;">Auditoría Técnica en Celular · Google Lighthouse</span>' +
    '<h3 style="margin: 10px 0 6px 0; color: #0f172a; font-size: 17px; font-weight: 800;">Diagnóstico de tu sitio: <a href="' + data.sitio_url + '" target="_blank" style="color: #0069a9; text-decoration: underline;">' + data.sitio_url + '</a></h3>' +
    '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 12px 0;">' +
      '<tr>' +
        '<td width="33%" align="center" style="background: #ffffff; border: 1px solid #ccfbf1; border-radius: 8px; padding: 12px;">' +
          '<div style="font-size: 24px; font-weight: 900; color: ' + perfColor + ';">' + data.web_perf_score + '/100</div>' +
          '<div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Velocidad Móvil</div>' +
        '</td>' +
        '<td width="4%"></td>' +
        '<td width="33%" align="center" style="background: #ffffff; border: 1px solid #ccfbf1; border-radius: 8px; padding: 12px;">' +
          '<div style="font-size: 24px; font-weight: 900; color: #0069a9;">' + data.web_load_time + '</div>' +
          '<div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Carga Inicial</div>' +
        '</td>' +
        '<td width="4%"></td>' +
        '<td width="33%" align="center" style="background: #ffffff; border: 1px solid #ccfbf1; border-radius: 8px; padding: 12px;">' +
          '<div style="font-size: 24px; font-weight: 900; color: #0f766e;">' + data.web_seo_score + '/100</div>' +
          '<div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Salud SEO</div>' +
        '</td>' +
      '</tr>' +
    '</table>' +
    '<div style="background-color: #ffffff; border-left: 4px solid #00b4a6; border-radius: 6px; padding: 12px 14px; margin-top: 10px;">' +
      '<p style="margin: 0; font-size: 13px; line-height: 19px; color: #334155;"><strong>Hallazgo clave:</strong> ' + data.web_audit_summary + '</p>' +
      '<p style="margin: 6px 0 0 0; font-size: 12px; line-height: 17px; color: #0f766e;">💡 <em>Regla de conversión: Cada segundo adicional de carga en celulares reduce la captación de prospectos entre un 7% y un 15%.</em></p>' +
    '</div>' +
  '</div>';
} else {
  seccionWebHTML = '<div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 22px; margin-bottom: 24px;">' +
    '<span style="background-color: #d97706; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 6px;">Fuga Comercial Prioritaria · Ausencia de Sitio Web</span>' +
    '<h3 style="margin: 10px 0 6px 0; color: #78350f; font-size: 17px; font-weight: 800;">¿Por qué tu negocio necesita una presencia web moderna y bien estructurada?</h3>' +
    '<p style="margin: 0 0 12px 0; font-size: 13px; line-height: 19px; color: #92400e;">Notamos que actualmente <strong>' + empresa + '</strong> no cuenta con un sitio web activo. En el mercado actual, esto representa la fuga de ventas más silenciosa y costosa:</p>' +
    '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' +
      '<tr>' +
        '<td width="26" valign="top" style="font-size: 15px; padding-bottom: 8px;">🔍</td>' +
        '<td style="font-size: 13px; line-height: 18px; color: #451a03; padding-bottom: 8px;"><strong>Captación de clientes en Google:</strong> Más del 81% de los compradores investigan en Google antes de contratar o comprar. Si no tienes web, esos prospectos se van directo con tu competencia.</td>' +
      '</tr>' +
      '<tr>' +
        '<td width="26" valign="top" style="font-size: 15px; padding-bottom: 8px;">💬</td>' +
        '<td style="font-size: 13px; line-height: 18px; color: #451a03; padding-bottom: 8px;"><strong>Conversión directa a WhatsApp 24/7:</strong> Una web bien diseñada convierte visitas anónimas en chats calificados de WhatsApp incluso fuera de tu horario laboral.</td>' +
      '</tr>' +
      '<tr>' +
        '<td width="26" valign="top" style="font-size: 15px; padding-bottom: 8px;">🛡️</td>' +
        '<td style="font-size: 13px; line-height: 18px; color: #451a03; padding-bottom: 8px;"><strong>Credibilidad y Autoridad de Marca:</strong> Los clientes desconfían de negocios que solo tienen perfiles informales en redes. Un sitio propio transmite solidez, garantía y respaldo profesional.</td>' +
      '</tr>' +
      '<tr>' +
        '<td width="26" valign="top" style="font-size: 15px;">⚡</td>' +
        '<td style="font-size: 13px; line-height: 18px; color: #451a03;"><strong>Tu solución express:</strong> Con nuestro servicio de <em>Página Express</em>, tu negocio puede tener su web profesional publicada en 5 días hábiles, con hosting, dominio y textos vendedores incluidos por $6,000 + IVA.</td>' +
      '</tr>' +
    '</table>' +
  '</div>';
}

// 4. Armar el HTML completo del reporte
const htmlReporte = '<!DOCTYPE html>' +
'<html lang="es">' +
'<head>' +
  '<meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '<title>Reporte de Diagnóstico Digital · ' + empresa + '</title>' +
'</head>' +
'<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif;">' +
  '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f1f5f9" style="padding: 24px 12px;">' +
    '<tr>' +
      '<td align="center">' +
        '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">' +
          '<tr>' +
            '<td bgcolor="#07131e" style="padding: 32px 28px; text-align: center; background: linear-gradient(135deg, #07131e 0%, #0d2235 100%);">' +
              '<img src="https://idealy.com.mx/img/Logo-Idealy.png" alt="Idealy" width="130" style="display: inline-block; margin-bottom: 16px;" />' +
              '<div>' +
                '<span style="display: inline-block; background-color: rgba(0,180,166,0.15); border: 1px solid rgba(0,180,166,0.4); color: #00b4a6; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;">' +
                  'DIAGNÓSTICO DIGITAL EXPRESS' +
                '</span>' +
              '</div>' +
              '<h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0 0 8px 0; line-height: 30px;">' +
                'Reporte de Madurez Tecnológica' +
              '</h1>' +
              '<p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 20px;">' +
                'Resultados y plan de optimización comercial para <strong>' + empresa + '</strong>' +
              '</p>' +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 32px 28px 20px 28px;">' +
              '<p style="font-size: 15px; line-height: 24px; color: #334155; margin: 0 0 20px 0;">' +
                'Hola <strong>' + nombre + '</strong>, gracias por completar el diagnóstico digital. Con base en la estructura operativa, herramientas y hábitos comerciales que nos compartiste, hemos generado el siguiente balance analítico:' +
              '</p>' +
              '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">' +
                '<tr>' +
                  '<td align="center">' +
                    '<div style="font-size: 48px; font-weight: 900; color: #00b4a6; line-height: 1;">' +
                      score + '<span style="font-size: 22px; color: #94a3b8; font-weight: 700;">/100</span>' +
                    '</div>' +
                    '<div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569; letter-spacing: 0.8px; margin-top: 6px;">' +
                      'Puntaje Global de Madurez Digital' +
                    '</div>' +
                    '<div style="font-size: 13px; color: #64748b; margin-top: 4px;">' +
                      'Nivel: <strong style="color: #0f172a;">' + (score < 40 ? 'Inicial / Fuga Crítica' : score < 65 ? 'En Desarrollo / Oportunidad Alta' : 'Avanzado / Optimización Fina') + '</strong>' +
                    '</div>' +
                  '</td>' +
                '</tr>' +
              '</table>' +
              '<div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 5px solid #ef4444; border-radius: 8px; padding: 16px 18px; margin-bottom: 26px;">' +
                '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' +
                  '<tr>' +
                    '<td width="28" valign="top" style="font-size: 20px;">⏱️</td>' +
                    '<td>' +
                      '<div style="font-size: 14px; font-weight: 800; color: #991b1b;">' +
                        'Fuga estimada en procesos repetitivos:' +
                      '</div>' +
                      '<div style="font-size: 13px; line-height: 20px; color: #b91c1c; margin-top: 4px;">' +
                        'Tu equipo invierte aprox. <strong>~' + horasMes + ' horas al mes</strong> en tareas operativas que podrían sistematizarse, equivalente a una pérdida de <strong>~$' + costoMes + ' MXN mensuales</strong> en costo operativo y prospectos no atendidos a tiempo.' +
                      '</div>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</div>' +
              '<h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">' +
                '¿Por qué obtuviste esta calificación? Desglose por áreas' +
              '</h2>' +
              '<p style="font-size: 13px; line-height: 19px; color: #64748b; margin: 0 0 18px 0;">' +
                'Analizamos cuatro dimensiones clave para entender exactamente dónde están los cuellos de botella de tu negocio:' +
              '</p>' +
              '<div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; margin-bottom: 12px; background-color: #ffffff;">' +
                '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' +
                  '<tr>' +
                    '<td align="left"><strong style="font-size: 14px; color: #0f172a;">1. Operación y Gestión Digital</strong></td>' +
                    '<td align="right"><span style="background-color: ' + stOp.bg + '; color: ' + stOp.text + '; border: 1px solid ' + stOp.border + '; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">' + areas.operacion + '/100 · ' + stOp.label + '</span></td>' +
                  '</tr>' +
                  '<tr><td colspan="2" style="padding-top: 6px;"><p style="margin: 0; font-size: 13px; line-height: 19px; color: #475569;">' + descOperacion + '</p></td></tr>' +
                '</table>' +
              '</div>' +
              '<div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; margin-bottom: 12px; background-color: #ffffff;">' +
                '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' +
                  '<tr>' +
                    '<td align="left"><strong style="font-size: 14px; color: #0f172a;">2. Automatización y Productividad</strong></td>' +
                    '<td align="right"><span style="background-color: ' + stAut.bg + '; color: ' + stAut.text + '; border: 1px solid ' + stAut.border + '; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">' + areas.automatizacion + '/100 · ' + stAut.label + '</span></td>' +
                  '</tr>' +
                  '<tr><td colspan="2" style="padding-top: 6px;"><p style="margin: 0; font-size: 13px; line-height: 19px; color: #475569;">' + descAutomatizacion + '</p></td></tr>' +
                '</table>' +
              '</div>' +
              '<div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; margin-bottom: 12px; background-color: #ffffff;">' +
                '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' +
                  '<tr>' +
                    '<td align="left"><strong style="font-size: 14px; color: #0f172a;">3. Ventas Web y Captación Comercial</strong></td>' +
                    '<td align="right"><span style="background-color: ' + stVw.bg + '; color: ' + stVw.text + '; border: 1px solid ' + stVw.border + '; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">' + areas.ventas_web + '/100 · ' + stVw.label + '</span></td>' +
                  '</tr>' +
                  '<tr><td colspan="2" style="padding-top: 6px;"><p style="margin: 0; font-size: 13px; line-height: 19px; color: #475569;">' + descVentasWeb + '</p></td></tr>' +
                '</table>' +
              '</div>' +
              '<div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; margin-bottom: 22px; background-color: #ffffff;">' +
                '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' +
                  '<tr>' +
                    '<td align="left"><strong style="font-size: 14px; color: #0f172a;">4. Experiencia Móvil y Autoservicio</strong></td>' +
                    '<td align="right"><span style="background-color: ' + stUx.bg + '; color: ' + stUx.text + '; border: 1px solid ' + stUx.border + '; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">' + areas.ux + '/100 · ' + stUx.label + '</span></td>' +
                  '</tr>' +
                  '<tr><td colspan="2" style="padding-top: 6px;"><p style="margin: 0; font-size: 13px; line-height: 19px; color: #475569;">' + descUx + '</p></td></tr>' +
                '</table>' +
              '</div>' +
              seccionWebHTML +
              '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #07131e 0%, #003659 100%); border-radius: 14px; padding: 28px 22px; text-align: center; margin-top: 6px;">' +
                '<tr>' +
                  '<td>' +
                    '<span style="display: inline-block; background-color: #00b4a6; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 20px;">' +
                      'SESIÓN ESTRATÉGICA SIN COSTO' +
                    '</span>' +
                    '<h3 style="color: #ffffff; font-size: 19px; font-weight: 900; margin: 12px 0 8px 0; line-height: 25px;">' +
                      '¿Cómo corregir estas fugas? Revisemos tu plan en 15 minutos' +
                    '</h3>' +
                    '<p style="color: #cbd5e1; font-size: 13px; line-height: 19px; margin: 0 auto 18px auto; max-width: 480px;">' +
                      'En esta breve sesión te mostraremos exactamente los 2 o 3 cambios con mayor retorno de inversión para <strong>' + empresa + '</strong>. Sin compromiso ni venta forzada.' +
                    '</p>' +
                    '<div>' +
                      '<a href="' + calUrl + '" target="_blank" style="display: inline-block; background-color: #00b4a6; color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 13px 26px; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,180,166,0.4);">' +
                        'Agendar mi llamada de 15 minutos en Cal.com →' +
                      '</a>' +
                    '</div>' +
                    '<div style="color: #94a3b8; font-size: 11px; margin-top: 10px;">' +
                      '⚡ Sesión 1 a 1 por Google Meet o Teléfono · 100% Gratuita · Horarios de México (CDMX)' +
                    '</div>' +
                  '</td>' +
                '</tr>' +
              '</table>' +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td bgcolor="#f8fafc" style="padding: 22px 28px; text-align: center; border-top: 1px solid #e2e8f0;">' +
              '<p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #475569;">' +
                'Idealy · Tecnología, Páginas Web y Automatizaciones para Negocios' +
              '</p>' +
              '<p style="margin: 0; font-size: 11px; color: #94a3b8;">' +
                'Puebla, México · <a href="https://idealy.com.mx" target="_blank" style="color: #0069a9; text-decoration: none;">idealy.com.mx</a> · <a href="https://wa.me/522223253597" target="_blank" style="color: #00b4a6; text-decoration: none;">WhatsApp Directo</a>' +
              '</p>' +
            '</td>' +
          '</tr>' +
        '</table>' +
      '</td>' +
    '</tr>' +
  '</table>' +
'</body>' +
'</html>';

// 5. WhatsApp copy de alto valor agregado con insight personalizado
let cuelloBotella = '';
let quickWin = '';

if (areas.automatizacion <= 40) {
  cuelloBotella = 'La recaptura manual de datos y la falta de flujos automáticos consumen tiempo crítico que tu equipo debería usar en cerrar ventas.';
  quickWin = 'Crear un flujo automatizado de bienvenida y cotización por WhatsApp ahorraría hasta el 70% de ese tiempo repetitivo.';
} else if (areas.ventas_web <= 40) {
  cuelloBotella = 'Tu captación depende de recomendaciones tradicionales; no tienes un canal digital activo trabajando por ti 24/7.';
  quickWin = 'Una página rápida con botón directo a WhatsApp captaría a clientes que buscan tus servicios en Google fuera de tu horario.';
} else if (areas.operacion <= 40) {
  cuelloBotella = 'La dispersión de información en hojas de cálculo o papel genera riesgo de pedidos extraviados y lentitud en presupuestos.';
  quickWin = 'Centralizar tus prospectos en un CRM ligero te da visibilidad total de cada venta y recordatorios automáticos.';
} else {
  cuelloBotella = 'Tu base operativa es buena, pero la velocidad de contacto y el seguimiento continuo pueden estar enfriando prospectos.';
  quickWin = 'Implementar respuestas instantáneas en menos de 5 minutos eleva la probabilidad de cierre hasta un 300%.';
}

let textoWhatsApp = '';
if (data.web_audit_realizada && data.sitio_url) {
  // CASO A: CON SITIO WEB
  textoWhatsApp = 'Hola ' + nombre + ' 👋, soy Mauricio de Idealy.\\n\\n' +
    'Acabo de revisar tu Diagnóstico Digital para *' + empresa + '* y le corrimos una auditoría técnica en celular a tu sitio (*' + data.sitio_url + '*):\\n\\n' +
    '📊 *BALANCE DE MADUREZ DIGITAL:*\\n' +
    '• Calificación Global: *' + score + '/100*\\n' +
    '• ⚙️ Operación: *' + areas.operacion + '/100*\\n' +
    '• ⚡ Automatización: *' + areas.automatizacion + '/100*\\n' +
    '• 🎯 Ventas Web: *' + areas.ventas_web + '/100*\\n' +
    '• 📱 Experiencia Móvil: *' + areas.ux + '/100*\\n\\n' +
    '🌐 *AUDITORÍA TÉCNICA WEB (Google Lighthouse en Celular):*\\n' +
    '• Velocidad móvil: *' + data.web_perf_score + '/100*\\n' +
    '• Tiempo de carga inicial: *' + data.web_load_time + '*\\n' +
    '• Salud SEO en buscadores: *' + data.web_seo_score + '/100*\\n' +
    '• Diagnóstico: _' + data.web_audit_summary + '_\\n\\n' +
    '⚠️ *TU MAYOR CUELLO DE BOTELLA HOY:*\\n' +
    cuelloBotella + '\\n' +
    '⏱️ Pérdida estimada en tareas manuales: *~' + horasMes + ' hrs/mes* (~$' + costoMes + ' MXN mensuales).\\n\\n' +
    '💡 *OPORTUNIDAD DE MEJORA RÁPIDA:*\\n' +
    quickWin + ' _(Nota: Cada segundo que tarda en cargar tu web en celular reduce tus conversiones entre 7% y 15%)._\\n\\n' +
    '📩 Te acabo de enviar a *' + email + '* tu reporte gráfico completo con el desglose a detalle.\\n\\n' +
    '¿Quieres que revisemos juntos en 15 minutos cómo corregir estas fugas técnicas y operativas?\\n' +
    '👉 Puedes apartar tu espacio aquí:\\n' + calUrl + '\\n\\n' +
    '(O si te es más cómodo, respóndeme directo a este mensaje y platicamos por aquí 🙌)';
} else {
  // CASO B: SIN SITIO WEB
  textoWhatsApp = 'Hola ' + nombre + ' 👋, soy Mauricio de Idealy.\\n\\n' +
    'Acabo de revisar tu Diagnóstico Digital para *' + empresa + '* y detectamos oportunidades comerciales clave para tu sector:\\n\\n' +
    '📊 *BALANCE DE MADUREZ DIGITAL:*\\n' +
    '• Calificación Global: *' + score + '/100*\\n' +
    '• ⚙️ Operación: *' + areas.operacion + '/100*\\n' +
    '• ⚡ Automatización: *' + areas.automatizacion + '/100*\\n' +
    '• 🎯 Ventas Web: *' + areas.ventas_web + '/100* (Fuga prioritaria)\\n' +
    '• 📱 Experiencia Móvil: *' + areas.ux + '/100*\\n\\n' +
    '🚨 *DIAGNÓSTICO DE PRESENCIA DIGITAL:*\\n' +
    '• Visibilidad en Google: *0% (Inexistente)*\\n' +
    '• Dependencia comercial: *100% de recomendaciones boca a boca*\\n' +
    '• El 81% de los compradores en México investigan en Google antes de contratar. Al no tener sitio propio, hoy esos clientes se van con tu competencia.\\n\\n' +
    '⚠️ *TU MAYOR CUELLO DE BOTELLA HOY:*\\n' +
    cuelloBotella + '\\n' +
    '⏱️ Pérdida estimada en tareas manuales: *~' + horasMes + ' hrs/mes* (~$' + costoMes + ' MXN mensuales).\\n\\n' +
    '💡 *OPORTUNIDAD DE ALTO IMPACTO:*\\n' +
    quickWin + ' Con una Página Express lista en 5 días y conectada a WhatsApp, puedes empezar a captar prospectos de Google de inmediato.\\n\\n' +
    '📩 Te acabo de enviar a *' + email + '* tu reporte completo con la explicación de cada calificación.\\n\\n' +
    '¿Te gustaría que en 15 minutos te muestre una propuesta de estructura web y automatización para *' + empresa + '*?\\n' +
    '👉 Puedes apartar tu llamada sin costo aquí:\\n' + calUrl + '\\n\\n' +
    '(O si prefieres, escríbeme por aquí mismo tu principal duda y te oriento con gusto 🙌)';
}

const emailAsunto = nombre + ', aquí tienes tu Reporte de Madurez Digital (' + empresa + ' · Score: ' + score + '/100)';

return {
  ...data,
  whatsapp_message_body: textoWhatsApp,
  email_asunto: emailAsunto,
  html_reporte_email: htmlReporte
};`;

// Actualizar nodo 'Preparar Mensajes de Seguimiento'
const codeNode = workflow.nodes.find(n => n.id === 'code-consolidar-mensajes');
if (codeNode) {
  codeNode.parameters.jsCode = codeConsolidar;
}

// Actualizar nodo 'email-reporte-lead' para usar las variables
const emailNode = workflow.nodes.find(n => n.id === 'email-reporte-lead');
if (emailNode) {
  emailNode.parameters.subject = "={{ $json.email_asunto }}";
  emailNode.parameters.html = "={{ $json.html_reporte_email }}";
}

fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2), 'utf-8');
console.log('Workflow actualizado con mensajes de WhatsApp de alto valor.');
