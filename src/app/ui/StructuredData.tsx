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
      'AI Agents',
      'LLM Integration',
      'Nearshore Software Development',
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
        contactType: 'customer support',
        email: 'hello@idealy.com.mx',
        availableLanguage: ['Spanish', 'English'],
        url: `${BASE_URL}/${locale}#contact`,
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'hello@idealy.com.mx',
        availableLanguage: ['Spanish', 'English'],
      },
    ],
    hasOfferCatalog: { '@id': `${BASE_URL}/#services` },
  };

  // ── 2. LocalBusiness ─────────────────────────────────────────────────────────
  // Amplía Organization con señales locales y operativas que los LLMs y buscadores
  // usan para respuestas de IA ("¿Cuál es la mejor agencia de software en Puebla?").
  const localBusinessSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': LOCAL_BIZ_ID,
    name: 'Idea.ly',
    alternateName: isEn ? 'Idealy Software Studio' : 'Idealy Estudio de Software',
    url: BASE_URL,
    image: `${BASE_URL}/img/Consulting-leo-idealy.jpg`,
    logo: `${BASE_URL}/img/Logo-Idealy.png`,
    description: isEn
      ? 'Nearshore software studio specializing in custom software development, AI agents, UX/UI design, and digital growth marketing for US and Mexican companies.'
      : 'Estudio de software nearshore especializado en desarrollo de software a la medida, agentes de IA, diseño UX/UI y marketing digital para empresas de EE.UU. y México.',
    telephone: '+52-222-717-9352',
    email: 'hello@idealy.com.mx',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 18 #40 San José Vista Hermosa',
      addressLocality: 'Puebla',
      addressRegion: 'Puebla',
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
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'MXN, USD',
    paymentAccepted: 'Credit Card, Bank Transfer, Wire Transfer',
    areaServed: [
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'United States' },
    ],
    hasMap: 'https://maps.app.goo.gl/Puebla',
    parentOrganization: { '@id': ORG_ID },
    sameAs: [
      'https://www.facebook.com/idealymx',
      'https://www.instagram.com/idea.ly_design/',
      'https://x.com/idealy_mx',
      'https://www.linkedin.com/company/idea-ly-mx',
    ],
    hasOfferCatalog: { '@id': `${BASE_URL}/#services` },
  };

  // ── 3. WebSite ──────────────────────────────────────────────────────────────
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

  // ── 4. WebPage — específico por URL ─────────────────────────────────────────
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

  // ── 5. Catálogo de servicios (global, presente en todo el sitio) ─────────────
  const servicesSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${BASE_URL}/#services`,
    name: isEn ? 'Idea.ly Services' : 'Servicios de Idea.ly',
    description: isEn
      ? 'Scalable web applications, AI agents, UX/UI systems and digital growth strategies'
      : 'Aplicaciones web escalables, agentes de IA, sistemas UX/UI y estrategias de crecimiento digital',
    itemListElement: [
      {
        '@type': 'Offer',
        position: 1,
        itemOffered: {
          '@type': 'Service',
          name: isEn
            ? 'Custom Software Development'
            : 'Desarrollo de Software a la Medida',
          description: isEn
            ? 'Scalable web and mobile applications built with Next.js and Go. High-performance architecture for US and MX enterprise clients.'
            : 'Aplicaciones web y móviles escalables construidas con Next.js y Go. Arquitectura de alto rendimiento para clientes empresariales en EE.UU. y México.',
          url: `${BASE_URL}/${locale}/services/software-development`,
          provider: { '@id': ORG_ID },
        },
      },
      {
        '@type': 'Offer',
        position: 2,
        itemOffered: {
          '@type': 'Service',
          name: isEn ? 'AI Automation & Agents' : 'Automatización y Agentes de IA',
          description: isEn
            ? 'Custom AI agents and LLM integration for business workflow optimization. Reduce operational costs with intelligent automation.'
            : 'Agentes de IA personalizados e integración de modelos LLM para la optimización de flujos de trabajo empresariales. Reduce costos operativos con automatización inteligente.',
          url: `${BASE_URL}/${locale}/services/ai-automation`,
          provider: { '@id': ORG_ID },
        },
      },
      {
        '@type': 'Offer',
        position: 3,
        itemOffered: {
          '@type': 'Service',
          name: isEn ? 'UX/UI Design' : 'Diseño UX/UI',
          description: isEn
            ? 'Intuitive and premium user experience design for digital products. High-fidelity prototyping and scalable design systems.'
            : 'Diseño de experiencia de usuario intuitivo y premium para productos digitales. Prototipado de alta fidelidad y sistemas de diseño escalables.',
          url: `${BASE_URL}/${locale}/services/ux-ui-design`,
          provider: { '@id': ORG_ID },
        },
      },
      {
        '@type': 'Offer',
        position: 4,
        itemOffered: {
          '@type': 'Service',
          name: isEn ? 'Digital Marketing & Growth' : 'Marketing Digital y Crecimiento',
          description: isEn
            ? 'Conversion funnel engineering and high-ROI growth marketing. SEO, SEM and performance analytics for scalable acquisition.'
            : 'Ingeniería de embudos de conversión y marketing de crecimiento con alto retorno de inversión. SEO, SEM y analítica de rendimiento para adquisición escalable.',
          url: `${BASE_URL}/${locale}/services/digital-marketing`,
          provider: { '@id': ORG_ID },
        },
      },
      {
        '@type': 'Offer',
        position: 5,
        itemOffered: {
          '@type': 'Service',
          name: isEn
            ? 'Digital Transformation Consulting'
            : 'Consultoría de Transformación Digital',
          description: isEn
            ? 'Practical technological strategy driven by AI workflows and LEO. Operational modernization and technology adoption roadmaps.'
            : 'Estrategia tecnológica práctica impulsada por flujos de trabajo de IA y LEO. Modernización operativa y hojas de ruta de adopción tecnológica.',
          url: `${BASE_URL}/${locale}/services/consulting`,
          provider: { '@id': ORG_ID },
        },
      },
    ],
  };

  // ── 6. FAQPage ───────────────────────────────────────────────────────────────
  // Palanca #1 de GEO: los LLMs extraen respuestas directamente de FAQPage para
  // responder preguntas conversacionales sobre la empresa y sus servicios.
  const faqSchema: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BASE_URL}/${locale}#faq`,
    mainEntity: isEn
      ? [
          {
            '@type': 'Question',
            name: 'Does Idea.ly work with companies in the United States?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Idea.ly operates as a nearshore software studio for U.S. clients, delivering real-time collaboration in CST/EST business hours, bilingual communication, and engineering standards aligned with the North American market — at a fraction of the cost of domestic agencies. Our team in Puebla, Mexico works as a seamless extension of your in-house team, with no timezone friction and no communication barriers.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is LEO and how does it help my project?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "LEO is Idea.ly's Applied Intelligence system — a proprietary consulting layer that combines over 10 years of design and engineering expertise with advanced AI language models. Before a single line of code is written, LEO analyzes your business, maps your operational inefficiencies, and recommends the most effective technical solution for your specific context. It's not a chatbot — it's the strategic backbone behind every Idea.ly project.",
            },
          },
          {
            '@type': 'Question',
            name: 'How much does it cost to build software with Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Investment depends on scope and complexity. A high-performance landing page or marketing site built with Next.js starts at $1,000 USD and is delivered in 21 days. Full web applications, custom systems with AI agents, backend integrations, or workflow automation generally range between $5,000 and $20,000 USD. Every project starts with a free strategic consultation to define scope, timeline, and exact pricing — no commitment required.',
            },
          },
          {
            '@type': 'Question',
            name: 'What makes Idea.ly different from other software agencies in Mexico?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Three things set Idea.ly apart. First, our stack — we build with Next.js and Go, the same technologies used by high-scale companies like Vercel and Cloudflare, not WordPress templates or low-code tools. Second, LEO — every project is backed by an AI-powered consulting layer that diagnoses your business before we build anything. Third, our nearshore model — we operate on U.S. business hours, communicate in English, and deliver to North American standards, making us a true extension of your team rather than a vendor.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Idea.ly design websites, or only develop them?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Both — and the distinction matters. At Idea.ly, design and development are a single integrated process, not two separate handoffs. Our UX/UI team, backed by 10+ years of experience, designs every interface with conversion psychology and user behavior in mind before development begins. The result is a website that doesn't just look premium — it's engineered to reduce friction, guide users toward action, and perform at the technical standards required by the North American market. Every pixel has a business purpose.",
            },
          },
          {
            '@type': 'Question',
            name: 'Does Idea.ly offer digital marketing services, or only software development?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Idea.ly offers both, and the combination is intentional. Most agencies either build the product or market it — we do both because a high-performing digital product without a growth strategy is an incomplete investment. Our digital marketing services include SEO and GEO optimization (visibility on Google, ChatGPT, and Perplexity), Meta Ads and Google Ads campaign management, conversion funnel design, and content strategy. We don't run ads for a website we didn't build — we build the website knowing exactly how it will be marketed.",
            },
          },
          {
            '@type': 'Question',
            name: 'Why is Puebla, Mexico a strategic location for software development?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Puebla is one of Mexico's fastest-growing tech hubs, home to a dense ecosystem of engineers, designers, and digital talent trained at institutions like BUAP, UDLAP, and Iberoamericana Puebla. The city operates in CST — the same timezone as Chicago, Houston, and Dallas — making real-time collaboration with U.S. teams natural, not forced. Idea.ly is based in Puebla by design: we combine the talent density and cost efficiency of a top-tier Mexican tech city with the delivery standards and communication fluency demanded by the North American market.",
            },
          }
        ]
      : [
          {
            '@type': 'Question',
            name: '¿Idea.ly trabaja con empresas en Estados Unidos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. Idea.ly opera como un estudio de software nearshore para clientes en EE.UU., ofreciendo colaboración en tiempo real en horarios comerciales CST/EST, comunicación bilingüe y estándares de ingeniería alineados con el mercado norteamericano, a una fracción del costo de las agencias locales. Nuestro equipo en Puebla, México, trabaja como una extensión fluida de tu equipo interno, sin fricciones por diferencia de horario ni barreras de comunicación.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué es LEO y cómo ayuda a mi proyecto?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'LEO es el sistema de Inteligencia Aplicada de Idea.ly: una capa de consultoría propietaria que combina más de 10 años de experiencia en diseño e ingeniería con modelos avanzados de lenguaje de IA. Antes de escribir una sola línea de código, LEO analiza tu negocio, mapea tus ineficiencias operativas y recomienda la solución técnica más efectiva para tu contexto específico. No es un chatbot; es la columna vertebral estratégica detrás de cada proyecto de Idea.ly.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cuánto cuesta desarrollar software con Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'La inversión depende del alcance y la complejidad. Una página de destino (landing page) o sitio de marketing de alto rendimiento construido con Next.js comienza en $1,000 USD y se entrega en 21 días. Las aplicaciones web completas, los sistemas personalizados con agentes de IA, las integraciones de backend o la automatización de flujos de trabajo generalmente oscilan entre $5,000 y $20,000 USD. Cada proyecto comienza con una consulta estratégica gratuita para definir el alcance, el cronograma y el precio exacto, sin ningún compromiso.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué hace a Idea.ly diferente de otras agencias de software en México?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tres cosas distinguen a Idea.ly. Primero, nuestro stack: construimos con Next.js y Go, las mismas tecnologías utilizadas por empresas de gran escala como Vercel y Cloudflare, no con plantillas de WordPress o herramientas low-code. Segundo, LEO: cada proyecto está respaldado por una capa de consultoría impulsada por IA que diagnostica tu negocio antes de construir cualquier cosa. Tercero, nuestro modelo nearshore: operamos en horarios comerciales de EE.UU., nos comunicamos en inglés y entregamos con estándares norteamericanos, lo que nos convierte en una verdadera extensión de tu equipo en lugar de un simple proveedor.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Idea.ly diseña sitios web o solo los desarrolla?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ambos, y la distinción importa. En Idea.ly, el diseño y el desarrollo son un único proceso integrado, no dos entregas separadas. Nuestro equipo de UX/UI, respaldado por más de 10 años de experiencia, diseña cada interfaz teniendo en cuenta la psicología de conversión y el comportamiento del usuario antes de que comience el desarrollo. El resultado es un sitio web que no solo se ve premium, sino que está diseñado para reducir la fricción, guiar a los usuarios hacia la acción y funcionar con los estándares técnicos requeridos por el mercado norteamericano. Cada píxel tiene un propósito de negocio.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Idea.ly ofrece servicios de marketing digital o solo desarrollo de software?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly ofrece ambos, y la combinación es intencional. La mayoría de las agencias construyen el producto o lo comercializan; nosotros hacemos ambas cosas porque un producto digital de alto rendimiento sin una estrategia de crecimiento es una inversión incompleta. Nuestros servicios de marketing digital incluyen optimización SEO y GEO (visibilidad en Google, ChatGPT y Perplexity), gestión de campañas de Meta Ads y Google Ads, diseño de embudos de conversión y estrategia de contenido. No realizamos anuncios para un sitio web que no construimos: creamos el sitio web sabiendo exactamente cómo se comercializará.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Por qué Puebla, México, es una ubicación estratégica para el desarrollo de software?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Puebla es uno de los hubs tecnológicos de más rápido crecimiento en México, hogar de un denso ecosistema de ingenieros, diseñadores y talento digital formados en instituciones como la BUAP, UDLAP e Iberoamericana Puebla. La ciudad opera en el huso horario CST (el mismo que Chicago, Houston y Dallas), lo que hace que la colaboración en tiempo real con equipos de EE.UU. sea natural y sin complicaciones. Idea.ly está basada en Puebla por diseño: combinamos la densidad de talento y la rentabilidad de una ciudad tecnológica mexicana de primer nivel con los estándares de entrega y la fluidez de comunicación que exige el mercado norteamericano.',
            },
          }
        ],
  };

  // ── Combinar todos los schemas ───────────────────────────────────────────────
  const allSchemas = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    webPageSchema,
    servicesSchema,
    faqSchema,
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
