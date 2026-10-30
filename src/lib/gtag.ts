declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag_report_conversion?: (url?: string) => boolean;
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

/**
 * Reporte de conversión de Google Ads
 */
export function gtagReportConversion(url?: string): boolean {
  if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
    return window.gtag_report_conversion(url);
  }
  return false;
}

/**
 * Disparador unificado de eventos y conversiones para:
 * - Google Analytics 4 (GA4)
 * - Google Tag Manager (DataLayer)
 * - Meta Pixel (Facebook Pixel)
 * - Microsoft Clarity
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  // 1. Google Tag Manager (DataLayer)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  // 2. Google Analytics 4 directo vía gtag
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // 3. Microsoft Clarity Tags / Events
  if (typeof window.clarity === 'function') {
    try {
      window.clarity('event', eventName);
    } catch {
      // Ignorar si clarity aún no está listo
    }
  }

  // 4. Meta Pixel (Facebook)
  if (typeof window.fbq === 'function') {
    try {
      if (eventName === 'generate_lead') {
        window.fbq('track', 'Lead', params);
      } else if (eventName === 'click_whatsapp') {
        window.fbq('track', 'Contact', { content_name: 'WhatsApp', ...params });
        window.fbq('trackCustom', 'WhatsAppClick', params);
      } else if (eventName === 'schedule_meeting' || eventName === 'schedule') {
        window.fbq('track', 'Schedule', params);
      } else if (eventName === 'click_cta_diagnostico') {
        window.fbq('trackCustom', 'ClickCtaDiagnostico', params);
      } else {
        window.fbq('trackCustom', eventName, params);
      }
    } catch {
      // Ignorar errores de fbq
    }
  }
}

/**
 * Evento específico de conversión de agenda (Cal.com / Diagnóstico)
 */
export function trackScheduleConversion(details?: Record<string, unknown>) {
  trackEvent('schedule', {
    method: 'cal.com',
    event_category: 'conversion',
    event_label: 'diagnostico_gratis',
    ...details,
  });
}

/**
 * Evento específico de contacto vía WhatsApp
 */
export function trackWhatsAppConversion(ubicacion: string) {
  trackEvent('click_whatsapp', {
    ubicacion,
    event_category: 'engagement',
    event_label: `whatsapp_${ubicacion}`,
  });
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'contact', {
      method: 'whatsapp',
      location: ubicacion,
    });
  }
}

/**
 * Evento de generación de Lead completado
 */
export function trackLeadConversion(tipo: string, value: number = 6000) {
  trackEvent('generate_lead', {
    currency: 'MXN',
    value,
    lead_type: tipo,
  });
  gtagReportConversion();
}
