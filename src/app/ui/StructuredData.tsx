import React from 'react';

// ─── Constantes de la organización ───────────────────────────────────────────
const BASE_URL = 'https://www.idealy.com.mx';

const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

// ─── Tipos ────────────────────────────────────────────────────────────────────
type SchemaObject = Record<string, unknown>;

interface StructuredDataProps {
  /** Locale activo: 'es' | 'en' */
  locale?: string;
  /**
   * Ruta relativa de la página actual, e.g. '/services/ai-automation'.
   * Se usa para construir el schema WebPage con la URL canónica correcta.
   */
  pagePath?: string;
  /**
   * Título de la página actual para el schema WebPage.
   * Si se omite, se usa el nombre del sitio por defecto.
   */
  pageTitle?: string;
  /**
   * Descripción de la página actual para el schema WebPage.
   */
  pageDescription?: string;
  /**
   * Schemas adicionales específicos de la página (BlogPosting, Service, etc.).
   * Se combinan con los schemas globales en un único <script>.
   */
  extraSchemas?: SchemaObject[];
}

// ─── Componente ───────────────────────────────────────────────────────────────
const StructuredData = ({
  locale = 'es',
  pagePath = '',
  pageTitle,
  pageDescription,
  extraSchemas = [],
}: StructuredDataProps) => {
  const isEn = locale === 'en';

  // URL canónica de la página actual
  const pageUrl = pagePath
    ? `${BASE_URL}/${locale}${pagePath.startsWith('/') ? pagePath : `/${pagePath}`}`
    : `${BASE_URL}/${locale}`;

  // ── 1. Organization ─────────────────────────────────────────────────────────
  const organizationSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Idea.ly',
    legalName: 'Idea.ly',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/img/Logo-Idealy.png`,
      width: 300,
      height: 60,
    },
    image: `${BASE_URL}/img/Consulting-leo-idealy.jpg`,
    description: isEn
      ? 'High-Performance Software, AI Automation & UX Design. Nearshore Strategic Studio driving exponential growth for US & MX markets.'
      : 'Desarrollo de Software de Alto Rendimiento, Automatización con IA y Diseño UX. Estudio estratégico Nearshore que impulsa el crecimiento exponencial para los mercados de EE. UU. y México.',
    foundingDate: '2022',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 18 #40 San José Vista Hermosa',
      addressLocality: 'Puebla',
      addressRegion: 'PUE',
      postalCode: '72190',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.0136,
      longitude: -98.2007,
    },
    telephone: '+52-222-717-9352',
    email: 'hello@idealy.com.mx',
    priceRange: '$$',
    currenciesAccepted: 'MXN, USD',
    paymentAccepted: 'Credit Card, Bank Transfer',
    areaServed: [
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'United States' },
    ],
    knowsAbout: [
      'Custom Software Development',
      'Artificial Intelligence',
      'UX/UI Design',
      'Digital Marketing',
      'Digital Transformation',
      'Next.js',
      'Go (Golang)',
    ],
    sameAs: [
      'https://www.facebook.com/idealymx',
      'https://www.instagram.com/idea.ly_design/',
      'https://x.com/idealy_mx',
      'https://www.linkedin.com/company/idea-ly-mx',
      'https://www.tiktok.com/@idealy.com.mx',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: isEn ? 'customer support' : 'soporte al cliente',
        email: 'hello@idealy.com.mx',
        availableLanguage: ['Spanish', 'English'],
        url: `${BASE_URL}/${locale}#contact`,
      },
      {
        '@type': 'ContactPoint',
        contactType: isEn ? 'sales' : 'ventas',
        email: 'hello@idealy.com.mx',
        availableLanguage: ['Spanish', 'English'],
      },
    ],
  };

  // ── 2. WebSite ──────────────────────────────────────────────────────────────
  const websiteSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: BASE_URL,
    name: 'Idea.ly',
    description: isEn
      ? 'Custom Software & AI Automation Studio for US & MX markets'
      : 'Estudio de Software a la Medida y Automatización con IA para mercados de EE.UU. y México',
    inLanguage: [isEn ? 'en' : 'es', isEn ? 'es' : 'en'],
    publisher: { '@id': ORG_ID },
  };

  // ── 3. WebPage — específico por URL ─────────────────────────────────────────
  const defaultTitle = isEn
    ? 'Idea.ly | High-Performance Software & AI Automation'
    : 'Idea.ly | Software de Alto Rendimiento y Automatización de IA';

  const defaultDescription = isEn
    ? 'Custom software engineering and AI-driven workflows for forward-thinking companies.'
    : 'Ingeniería de software a la medida y flujos automatizados con IA para empresas innovadoras.';

  const webPageSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageTitle ?? defaultTitle,
    description: pageDescription ?? defaultDescription,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: isEn ? 'en' : 'es',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'ReadAction',
      target: pageUrl,
    },
  };

  // ── 4. Catálogo de servicios (global, presente en todo el sitio) ─────────────
  const servicesSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE_URL}/#services`,
    serviceType: isEn
      ? 'Software Development & AI Automation'
      : 'Desarrollo de Software y Automatización con IA',
    provider: { '@id': ORG_ID },
    areaServed: [
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'United States' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isEn ? 'Idea.ly Services' : 'Servicios de Idea.ly',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isEn
              ? 'Custom Software Development'
              : 'Desarrollo de Software a la Medida',
            description: isEn
              ? 'Scalable web and mobile applications built with Next.js and Go.'
              : 'Aplicaciones web y móviles escalables construidas con Next.js y Go.',
            url: `${BASE_URL}/${locale}/services/software-development`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isEn ? 'AI Automation & Agents' : 'Automatización y Agentes de IA',
            description: isEn
              ? 'Custom AI agents and LLM integration for business workflow optimization.'
              : 'Agentes de IA personalizados e integración de modelos LLM para la optimización de flujos de trabajo empresariales.',
            url: `${BASE_URL}/${locale}/services/ai-automation`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isEn ? 'UX/UI Design' : 'Diseño UX/UI',
            description: isEn
              ? 'Intuitive and premium user experience design for digital products.'
              : 'Diseño de experiencia de usuario intuitivo y premium para productos digitales.',
            url: `${BASE_URL}/${locale}/services/ux-ui-design`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isEn ? 'Digital Marketing' : 'Marketing Digital y Crecimiento',
            description: isEn
              ? 'Conversion funnel engineering and high-ROI growth marketing.'
              : 'Ingeniería de embudos de conversión y marketing de crecimiento con alto retorno de inversión.',
            url: `${BASE_URL}/${locale}/services/digital-marketing`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isEn
              ? 'Digital Transformation Consulting'
              : 'Consultoría de Transformación Digital',
            description: isEn
              ? 'Practical technological strategy driven by AI workflows and LEO.'
              : 'Estrategia tecnológica práctica impulsada por flujos de trabajo de IA y LEO.',
            url: `${BASE_URL}/${locale}/services/consulting`,
          },
        },
      ],
    },
  };

  // ── Combinar todos los schemas ───────────────────────────────────────────────
  const allSchemas = [
    organizationSchema,
    websiteSchema,
    webPageSchema,
    servicesSchema,
    ...extraSchemas,
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(allSchemas),
      }}
    />
  );
};

export default StructuredData;
