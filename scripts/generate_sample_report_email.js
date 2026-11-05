// Script de prueba para validar la generación del reporte HTML enriquecido
function generarReporteHTML(data) {
  const nombre = (data.nombre || 'Emprendedor').trim();
  const empresa = (data.empresa || 'Empresa').trim();
  const email = (data.email || '').trim();
  const calUrl = `https://cal.com/idealy-o2fiqr/idealy-auditorias?name=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}`;

  const score = data.score_global || 50;
  const areas = data.areas || { operacion: 50, automatizacion: 50, ventas_web: 50, ux: 50 };
  const horasMes = data.horas_mes || 20;
  const costoMes = (data.costo_mes || 2400).toLocaleString('es-MX');

  // Interpretación de los 4 pilares
  // 1. Operación
  let descOperacion = '';
  if (data.registro_ventas === 'papel') {
    descOperacion = 'Tu control comercial se lleva en papel o notas físicas. Esto genera riesgo alto de extravío de pedidos y nula visibilidad para planear compras o ventas.';
  } else if (data.registro_ventas === 'excel') {
    descOperacion = 'Tu información vive en hojas de cálculo aisladas. Aunque ayuda al registro, requiere recaptura manual continua y no avisa de seguimientos pendientes.';
  } else if (data.registro_ventas === 'sistema_basico') {
    descOperacion = 'Cuentas con un software básico, pero al no comunicarse con tus otros canales se producen islas de datos y procesos desarticulados.';
  } else {
    descOperacion = 'Cuentas con un CRM o sistema estructurado que centraliza tu operación, ofreciendo una base sólida para crecer.';
  }

  // 2. Automatización
  let descAutomatizacion = '';
  if (data.horas_repetitivas === '30+' || data.horas_repetitivas === '15-30') {
    descAutomatizacion = `Inviertes más de 15 horas a la semana en tareas repetitivas (cotizar, facturar, responder dudas de rutina). Esto representa una fuga de aproximadamente $${costoMes} MXN al mes en tiempo de equipo.`;
  } else if (data.horas_repetitivas === '5-15') {
    descAutomatizacion = 'Dedicas entre 5 y 15 horas semanales a tareas que un flujo automático o bot de WhatsApp podría resolver en segundos.';
  } else {
    descAutomatizacion = 'Tus procesos manuales son relativamente ágiles, lo que te permite concentrarte en el cierre de ventas y la entrega del servicio.';
  }

  // 3. Ventas Web y Captación
  let descVentasWeb = '';
  if (data.sitio_web === 'no_tengo') {
    descVentasWeb = 'Al no contar con página web propia, dependes al 100% del boca a boca o redes sociales. Cada cliente que busca tus servicios en Google termina comprando a tu competencia.';
  } else if (data.sitio_web === 'no_trae') {
    descVentasWeb = 'Tu sitio web actual no convierte visitas en prospectos. Suele deberse a falta de textos persuasivos orientados a la venta, tiempos de carga lentos o ausencia de botón directo a WhatsApp.';
  } else {
    descVentasWeb = 'Tu presencia digital atrae prospectos, pero existen oportunidades para optimizar el embudo y aumentar el porcentaje de conversión.';
  }

  // 4. Experiencia de Usuario y Móvil
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

  // Sección dinámica de Sitio Web
  let seccionWebHTML = '';
  if (data.web_audit_realizada && data.sitio_url) {
    const perfScore = data.web_perf_score || 0;
    const perfColor = perfScore >= 80 ? '#10b981' : perfScore >= 50 ? '#f59e0b' : '#ef4444';

    seccionWebHTML = `
      <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding-bottom: 12px;">
              <span style="background-color: #00b4a6; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 6px;">
                Auditoría Técnica en Celular · Google Lighthouse
              </span>
              <h3 style="margin: 10px 0 4px 0; color: #0f172a; font-size: 18px; font-weight: 800;">
                Diagnóstico de tu sitio: <a href="${data.sitio_url}" target="_blank" style="color: #0069a9; text-decoration: underline;">${data.sitio_url}</a>
              </h3>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 12px 0;">
                <tr>
                  <td width="33%" align="center" style="background: #ffffff; border: 1px solid #ccfbf1; border-radius: 8px; padding: 12px;">
                    <div style="font-size: 24px; font-weight: 900; color: ${perfColor};">${data.web_perf_score}/100</div>
                    <div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Velocidad Móvil</div>
                  </td>
                  <td width="5%"></td>
                  <td width="33%" align="center" style="background: #ffffff; border: 1px solid #ccfbf1; border-radius: 8px; padding: 12px;">
                    <div style="font-size: 24px; font-weight: 900; color: #0069a9;">${data.web_load_time}</div>
                    <div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Carga Inicial</div>
                  </td>
                  <td width="5%"></td>
                  <td width="33%" align="center" style="background: #ffffff; border: 1px solid #ccfbf1; border-radius: 8px; padding: 12px;">
                    <div style="font-size: 24px; font-weight: 900; color: #0f766e;">${data.web_seo_score}/100</div>
                    <div style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Salud SEO</div>
                  </td>
                </tr>
              </table>
              <div style="background-color: #ffffff; border-left: 4px solid #00b4a6; border-radius: 6px; padding: 12px 14px; margin-top: 14px;">
                <p style="margin: 0; font-size: 13px; line-height: 20px; color: #334155;">
                  <strong>Hallazgo clave:</strong> ${data.web_audit_summary}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 18px; color: #0f766e;">
                  💡 <em>Regla de conversión: Cada segundo adicional de carga en celulares reduce la captación de prospectos entre un 7% y un 15%.</em>
                </p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;
  } else {
    seccionWebHTML = `
      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
        <span style="background-color: #d97706; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 6px;">
          Fuga Comercial Prioritaria · Ausencia de Sitio Web
        </span>
        <h3 style="margin: 12px 0 8px 0; color: #78350f; font-size: 18px; font-weight: 800;">
          ¿Por qué tu negocio necesita una presencia web moderna y bien estructurada?
        </h3>
        <p style="margin: 0 0 14px 0; font-size: 13px; line-height: 20px; color: #92400e;">
          Notamos que actualmente <strong>${empresa}</strong> no cuenta con un sitio web activo. En el mercado actual, esto representa la fuga de ventas más silenciosa y costosa:
        </p>
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding: 8px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="28" valign="top" style="font-size: 16px;">🔍</td>
                  <td style="font-size: 13px; line-height: 19px; color: #451a03;">
                    <strong>Captación de clientes en Google:</strong> Más del 81% de los compradores investigan en Google antes de contratar o comprar. Si no tienes web, esos prospectos se van directo con tu competencia.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="28" valign="top" style="font-size: 16px;">💬</td>
                  <td style="font-size: 13px; line-height: 19px; color: #451a03;">
                    <strong>Conversión directa a WhatsApp 24/7:</strong> Una web bien diseñada convierte visitas anónimas en chats calificados de WhatsApp incluso fuera de tu horario laboral.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="28" valign="top" style="font-size: 16px;">🛡️</td>
                  <td style="font-size: 13px; line-height: 19px; color: #451a03;">
                    <strong>Credibilidad y Autoridad de Marca:</strong> Los clientes desconfían de negocios que solo tienen perfiles informales en redes. Un sitio propio transmite solidez, garantía y respaldo profesional.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="28" valign="top" style="font-size: 16px;">⚡</td>
                  <td style="font-size: 13px; line-height: 19px; color: #451a03;">
                    <strong>Tu solución express:</strong> Con nuestro servicio de <em>Página Express</em>, tu negocio puede tener su web profesional publicada en 5 días hábiles, con hosting, dominio y textos vendedores incluidos por $6,000 + IVA.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Diagnóstico Digital · ${empresa}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f1f5f9" style="padding: 24px 12px;">
    <tr>
      <td align="center">
        
        <!-- Contenedor Principal (Max 620px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Hero Oscuro -->
          <tr>
            <td bgcolor="#07131e" style="padding: 32px 28px; text-align: center; background: linear-gradient(135deg, #07131e 0%, #0d2235 100%);">
              <img src="https://idealy.com.mx/img/Logo-Idealy.png" alt="Idealy" width="130" style="display: inline-block; margin-bottom: 16px;" />
              <div style="display: inline-block; background-color: rgba(0,180,166,0.15); border: 1px solid rgba(0,180,166,0.4); color: #00b4a6; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;">
                DIAGNÓSTICO DIGITAL EXPRESS
              </div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0 0 8px 0; line-height: 30px;">
                Reporte de Madurez Tecnológica
              </h1>
              <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 20px;">
                Resultados y plan de optimización comercial para <strong>${empresa}</strong>
              </p>
            </td>
          </tr>

          <!-- Saludo y Score Global -->
          <tr>
            <td style="padding: 32px 28px 20px 28px;">
              <p style="font-size: 15px; line-height: 24px; color: #334155; margin: 0 0 20px 0;">
                Hola <strong>${nombre}</strong>, gracias por completar el diagnóstico digital. Con base en la estructura operativa, herramientas y hábitos comerciales que nos compartiste, hemos generado el siguiente balance analítico:
              </p>

              <!-- Caja de Puntaje Global -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <div style="font-size: 48px; font-weight: 900; color: #00b4a6; line-height: 1;">
                      ${score}<span style="font-size: 22px; color: #94a3b8; font-weight: 700;">/100</span>
                    </div>
                    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #475569; letter-spacing: 0.8px; margin-top: 6px;">
                      Puntaje Global de Madurez Digital
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
                      Nivel: <strong style="color: #0f172a;">${score < 40 ? 'Inicial / Fuga Crítica' : score < 65 ? 'En Desarrollo / Oportunidad Alta' : 'Avanzado / Optimización Fina'}</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Caja de Fuga de Tiempo y Dinero -->
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 5px solid #ef4444; border-radius: 8px; padding: 16px 18px; margin-bottom: 28px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="28" valign="top" style="font-size: 20px;">⏱️</td>
                    <td>
                      <div style="font-size: 14px; font-weight: 800; color: #991b1b;">
                        Fuga estimada en procesos repetitivos:
                      </div>
                      <div style="font-size: 13px; line-height: 20px; color: #b91c1c; margin-top: 4px;">
                        Tu equipo invierte aprox. <strong>~${horasMes} horas al mes</strong> en tareas operativas que podrían sistematizarse, equivalente a una pérdida de <strong>~$${costoMes} MXN mensuales</strong> en costo operativo y prospectos no atendidos a tiempo.
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Título de Desglose de los 4 Pilares -->
              <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">
                ¿Por qué obtuviste esta calificación? Desglose por áreas
              </h2>
              <p style="font-size: 13px; line-height: 19px; color: #64748b; margin: 0 0 20px 0;">
                Analizamos cuatro dimensiones clave para entender exactamente dónde están los cuellos de botella de tu negocio:
              </p>

              <!-- PILAR 1: OPERACIÓN DIGITAL -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px; background-color: #ffffff;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left">
                      <strong style="font-size: 15px; color: #0f172a;">1. Operación y Gestión Digital</strong>
                    </td>
                    <td align="right">
                      <span style="background-color: ${stOp.bg}; color: ${stOp.text}; border: 1px solid ${stOp.border}; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">
                        ${areas.operacion}/100 · ${stOp.label}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 8px;">
                      <p style="margin: 0; font-size: 13px; line-height: 19px; color: #475569;">
                        ${descOperacion}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- PILAR 2: AUTOMATIZACIÓN DE PROCESOS -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px; background-color: #ffffff;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left">
                      <strong style="font-size: 15px; color: #0f172a;">2. Automatización y Productividad</strong>
                    </td>
                    <td align="right">
                      <span style="background-color: ${stAut.bg}; color: ${stAut.text}; border: 1px solid ${stAut.border}; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">
                        ${areas.automatizacion}/100 · ${stAut.label}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 8px;">
                      <p style="margin: 0; font-size: 13px; line-height: 19px; color: #475569;">
                        ${descAutomatizacion}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- PILAR 3: VENTAS WEB Y CAPTACIÓN -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px; background-color: #ffffff;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left">
                      <strong style="font-size: 15px; color: #0f172a;">3. Ventas Web y Captación Comercial</strong>
                    </td>
                    <td align="right">
                      <span style="background-color: ${stVw.bg}; color: ${stVw.text}; border: 1px solid ${stVw.border}; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">
                        ${areas.ventas_web}/100 · ${stVw.label}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 8px;">
                      <p style="margin: 0; font-size: 13px; line-height: 19px; color: #475569;">
                        ${descVentasWeb}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- PILAR 4: EXPERIENCIA DE USUARIO Y MÓVIL -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px; background-color: #ffffff;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="left">
                      <strong style="font-size: 15px; color: #0f172a;">4. Experiencia Móvil y Autoservicio</strong>
                    </td>
                    <td align="right">
                      <span style="background-color: ${stUx.bg}; color: ${stUx.text}; border: 1px solid ${stUx.border}; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">
                        ${areas.ux}/100 · ${stUx.label}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 8px;">
                      <p style="margin: 0; font-size: 13px; line-height: 19px; color: #475569;">
                        ${descUx}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- SECCIÓN DINÁMICA DE SITIO WEB (CON AUDITORÍA O VENTAJAS DE TENER UNA) -->
              ${seccionWebHTML}

              <!-- CAJA CTA: AGENDAR AUDITORÍA / LLAMADA DE 15 MINUTOS -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #07131e 0%, #003659 100%); border-radius: 14px; padding: 28px 24px; text-align: center; margin-top: 8px;">
                <tr>
                  <td>
                    <span style="background-color: #00b4a6; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 20px;">
                      SESIÓN ESTRATÉGICA SIN COSTO
                    </span>
                    <h3 style="color: #ffffff; font-size: 20px; font-weight: 900; margin: 12px 0 8px 0; line-height: 26px;">
                      ¿Cómo corregir estas fugas? Revisemos tu plan en 15 minutos
                    </h3>
                    <p style="color: #cbd5e1; font-size: 13px; line-height: 20px; margin: 0 auto 20px auto; max-width: 480px;">
                      En esta breve sesión te mostraremos exactamente los 2 o 3 cambios con mayor retorno de inversión para <strong>${empresa}</strong>. Sin compromiso ni venta forzada.
                    </p>
                    <div>
                      <a href="${calUrl}" target="_blank" style="display: inline-block; background-color: #00b4a6; color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,180,166,0.4);">
                        Agendar mi llamada de 15 minutos en Cal.com →
                      </a>
                    </div>
                    <div style="color: #94a3b8; font-size: 11px; margin-top: 12px;">
                      ⚡ Sesión 1 a 1 por Google Meet o Teléfono · Horarios en hora de México (CDMX)
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer corporativo -->
          <tr>
            <td bgcolor="#f8fafc" style="padding: 24px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #475569;">
                Idealy · Tecnología, Páginas Web y Automatizaciones para Negocios
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Puebla, México · <a href="https://idealy.com.mx" target="_blank" style="color: #0069a9; text-decoration: none;">idealy.com.mx</a> · <a href="https://wa.me/522223253597" target="_blank" style="color: #00b4a6; text-decoration: none;">WhatsApp de Soporte</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// Probar con caso A (con web) y caso B (sin web)
const pruebaConWeb = generarReporteHTML({
  nombre: 'Carlos López',
  empresa: 'Clínica Dental San Ángel',
  email: 'carlos@sanangel.com',
  score_global: 48,
  registro_ventas: 'excel',
  horas_repetitivas: '15-30',
  sitio_web: 'no_trae',
  movil: 'regular',
  autoservicio: 'no',
  horas_mes: 22,
  costo_mes: 2640,
  areas: { operacion: 50, automatizacion: 35, ventas_web: 40, ux: 45 },
  web_audit_realizada: true,
  sitio_url: 'https://sanangeldental.com',
  web_perf_score: 38,
  web_seo_score: 72,
  web_load_time: '4.8s',
  web_audit_summary: 'Tu web en celular tarda 4.8s en mostrar contenido y tiene 38/100 de velocidad. Estás perdiendo hasta el 40% de visitas que se van antes de cargar.'
});

const pruebaSinWeb = generarReporteHTML({
  nombre: 'María Fernández',
  empresa: 'Pastelería La Delicia',
  email: 'maria@ladelicia.com',
  score_global: 35,
  registro_ventas: 'papel',
  horas_repetitivas: '30+',
  sitio_web: 'no_tengo',
  movil: 'no_tengo',
  autoservicio: 'no',
  horas_mes: 35,
  costo_mes: 4200,
  areas: { operacion: 35, automatizacion: 20, ventas_web: 25, ux: 30 },
  web_audit_realizada: false,
  sitio_url: '',
  web_perf_score: 0,
  web_seo_score: 0,
  web_load_time: 'Sin sitio',
  web_audit_summary: ''
});

console.log('Longitud HTML con web:', pruebaConWeb.length);
console.log('Longitud HTML sin web:', pruebaSinWeb.length);

const fs = require('fs');
fs.writeFileSync('public/templates/reporte_diagnostico_con_web.html', pruebaConWeb, 'utf-8');
fs.writeFileSync('public/templates/reporte_diagnostico_sin_web.html', pruebaSinWeb, 'utf-8');
console.log('Plantillas de prueba guardadas en public/templates/reporte_diagnostico_con_web.html y sin_web.html');
