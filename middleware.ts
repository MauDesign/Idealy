import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // Una lista de todos los idiomas que están soportados
  locales: ['en', 'es'],
 
  // Se usa cuando ningún idioma coincide
  defaultLocale: 'es'
});
 
export const config = {
  // Solo aplicar a las rutas internacionalizadas
  matcher: ['/', '/(es|en)/:path*']
};