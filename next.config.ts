import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // ─── Tree-shaking de librerías pesadas ────────────────────────────────────
  // Evita importar el bundle completo de lucide-react, gsap, etc.
  // Cada ícono/función se importa individualmente → bundle JS más pequeño.
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'gsap',
      '@headlessui/react',
    ],
  },

  // Prisma y nodemailer no deben incluirse en el bundle del cliente
  serverExternalPackages: ['@prisma/client', 'prisma', 'nodemailer'],

  // ─── Redirects 301 permanentes ────────────────────────────────────────────
  async redirects() {
    return [
      {
        source:
          '/en/blog/tema-titulo-sugeridopalabras-clave-keywordspor-que-funciona-seo-2026nearshoring-to-mexico-2026-the-new-standard-for-high-velocity-teams',
        destination:
          '/en/blog/nearshoring-to-mexico-2026-the-new-standard-for-high-velocity-teams',
        permanent: true,
      },
    ];
  },

  // ─── Compresión Gzip/Brotli ───────────────────────────────────────────────
  compress: true,

  // Quita el header X-Powered-By (reduce bytes de respuesta)
  poweredByHeader: false,

  // ─── HTTP Cache-Control headers para activos estáticos ───────────────────
  // Elimina solicitudes de bloqueo en visitas repetidas (Lighthouse repeat-view)
  async headers() {
    return [
      {
        // JS/CSS compilados por Next.js — inmutables con hash en el nombre
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Imágenes, fuentes y otros activos en /public
        source: '/:path((?!_next).*\\.(?:png|jpg|jpeg|webp|avif|gif|svg|ico|woff|woff2|ttf|otf|eot))$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Habilita formatos modernos (AVIF → WebP → fallback)
    formats: ['image/avif', 'image/webp'],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
