import React from 'react';

// ─── Constantes de la organización ───────────────────────────────────────────
const BASE_URL = 'https://www.idealy.com.mx';

const ORG_ID      = `${BASE_URL}/#organization`;
const WEBSITE_ID  = `${BASE_URL}/#website`;
const LOCAL_BIZ_ID = `${BASE_URL}/#localbusiness`;

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

  // ── 1. ProfessionalService para PyMEs ───────────────────────────────────────
  const professionalServiceSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
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
      ? 'Custom web design, high-performance software engineering, and AI automation for growing SMBs and companies in Mexico and the United States.'
      : 'Diseño de páginas web, desarrollo de software a la medida y automatización con IA para PyMEs y empresas en Puebla y todo México. Sitios web rápidos y sistemas para captar clientes.',
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
      'AI Agents',
      'LLM Integration',
      'Nearshore Software Development',
    ],
    sameAs: [
      'https://www.linkedin.com/company/idealy-studio',
      'https://github.com/idealy-mx',
    ],
  };

  // ── 2. LocalBusiness ─────────────────────────────────────────────────────────
  const localBusinessSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': LOCAL_BIZ_ID,
    name: 'Idea.ly Puebla',
    parentOrganization: { '@id': ORG_ID },
    url: `${BASE_URL}/${locale}`,
    telephone: '+52-222-717-9352',
    image: `${BASE_URL}/img/Consulting-leo-idealy.jpg`,
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
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'MXN, USD',
  };

  // ── 3. WebSite ──────────────────────────────────────────────────────────────
  const websiteSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: BASE_URL,
    name: 'Idea.ly',
    publisher: { '@id': ORG_ID },
    inLanguage: ['es', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // ── 4. WebPage ──────────────────────────────────────────────────────────────
  const webPageSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageTitle ?? (isEn
      ? 'Idea.ly | High-Performance Solutions & Custom AI'
      : 'Idea.ly | Soluciones de Alto Rendimiento y Automatización de IA'),
    description: pageDescription ?? (isEn
      ? 'Scale your business with Next.js & Go software. Experts in custom AI, intelligent automation & high-impact UX for US & MX markets.'
      : 'Escala tu negocio con software de Next.js y Go. Expertos en agentes de IA personalizados, automatización de flujos y UX de alto impacto para mercados de EE.UU. y México.'),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: locale,
  };

  // ── 5. Services ─────────────────────────────────────────────────────────────
  const servicesSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isEn ? 'Core Services' : 'Servicios Principales',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: isEn
            ? 'Custom Software & Mobile App Development'
            : 'Desarrollo de Software y Aplicaciones a Medida',
          description: isEn
            ? 'Engineering full-scale web platforms, mobile apps, and robust microservices powered by Next.js and Go.'
            : 'Ingeniería de plataformas web a gran escala, aplicaciones móviles y microservicios robustos impulsados por Next.js y Go.',
          url: `${BASE_URL}/${locale}/desarrollo-a-la-medida`,
          provider: { '@id': ORG_ID },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          name: isEn
            ? 'AI Automation & Enterprise Workflow Agents'
            : 'Automatización con IA y Agentes Autónomos',
          description: isEn
            ? 'Autonomous agentic workflows, LLM orchestration, and smart process automation reducing overhead and boosting team velocity.'
            : 'Flujos de trabajo agénticos autónomos, orquestación de LLMs y automatización inteligente de procesos.',
          url: `${BASE_URL}/${locale}/services/ai-automation`,
          provider: { '@id': ORG_ID },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: isEn
            ? 'Conversion-Centered UX/UI Design'
            : 'Diseño UX/UI Centrado en Conversión',
          description: isEn
            ? 'High-impact digital product design engineered for maximum retention, usability, and measurable commercial results.'
            : 'Diseño de productos digitales de alto impacto diseñado para máxima retención, usabilidad y resultados comerciales medibles.',
          url: `${BASE_URL}/${locale}/services/ux-ui-design`,
          provider: { '@id': ORG_ID },
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Service',
          name: isEn
            ? 'SEO & Algorithmic Growth Marketing'
            : 'SEO y Marketing Digital Algorítmico',
          description: isEn
            ? 'Full-funnel digital marketing combining generative engine optimization (GEO), technical SEO, and data-driven ad management.'
            : 'Marketing digital de embudo completo combinando optimización para motores generativos (GEO), SEO técnico y gestión de anuncios basada en datos.',
          url: `${BASE_URL}/${locale}/sitio-crecimiento`,
          provider: { '@id': ORG_ID },
        },
      },
    ],
  };

  // ── Combinar todos los schemas ───────────────────────────────────────────────
  const allSchemas = [
    professionalServiceSchema,
    localBusinessSchema,
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
