import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n/config';
 
export default createMiddleware({
  locales,
 
  // Se usa cuando ningún idioma coincide
  defaultLocale
});
 
export const config = {
  // Solo aplicar a las rutas internacionalizadas
  matcher: ['/', '/(es|en)/:path*']
};
