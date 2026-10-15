declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag_report_conversion?: (url?: string) => boolean;
    gtag?: (...args: any[]) => void;
  }
}

export function gtagReportConversion(url?: string): boolean {
  if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
    return window.gtag_report_conversion(url);
  }
  return false;
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}
