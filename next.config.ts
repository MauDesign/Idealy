import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // ─── Redirects 301 permanentes ────────────────────────────────────────────
  // Artículos con slugs incorrectos que cambiaron de URL.
  // Google transfiere el 100% del link juice con un 301.
  async redirects() {
    return [
      {
        // Artículo EN: slug roto generado por el sistema de automatización
        source:
          '/en/blog/tema-titulo-sugeridopalabras-clave-keywordspor-que-funciona-seo-2026nearshoring-to-mexico-2026-the-new-standard-for-high-velocity-teams',
        destination:
          '/en/blog/nearshoring-to-mexico-2026-the-new-standard-for-high-velocity-teams',
        permanent: true, // HTTP 301
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        // Allow any HTTPS image URL — needed for CMS where images come from external sources
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
