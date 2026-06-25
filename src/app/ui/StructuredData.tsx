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
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#services`,
    name: isEn ? 'Idea.ly Services' : 'Servicios de Idea.ly',
    description: isEn
      ? 'Scalable web applications, AI agents, UX/UI systems and digital growth strategies'
      : 'Aplicaciones web escalables, agentes de IA, sistemas UX/UI y estrategias de crecimiento digital',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
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
        '@type': 'ListItem',
        position: 2,
        item: {
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
        '@type': 'ListItem',
        position: 3,
        item: {
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
        '@type': 'ListItem',
        position: 4,
        item: {
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
        '@type': 'ListItem',
        position: 5,
        item: {
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
            name: 'What services does Idea.ly offer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly offers five core services: Custom Software Development (Next.js & Go), AI Automation & Agents (LLM integrations, custom agents), UX/UI Design (high-fidelity prototyping, design systems), Digital Marketing & Growth (SEO, SEM, conversion funnels), and Digital Transformation Consulting (LEO-powered strategy and operational modernization).',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is Idea.ly located and what markets do you serve?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly is a nearshore software studio based in Puebla, Mexico. We serve clients across Mexico and the United States, operating in Central Standard Time (CST) for seamless real-time collaboration with US-based teams.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is LEO, the AI developed by Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'LEO is Idea.ly\'s proprietary AI consulting intelligence — a synthesis of over 10 years of design expertise and cutting-edge AI logic. LEO audits operational processes, suggests infrastructure optimizations, and helps clients build data-driven transformation roadmaps in record time.',
            },
          },
          {
            '@type': 'Question',
            name: 'What technologies does Idea.ly use for software development?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly builds high-performance applications using Next.js for ultra-fast frontends and Go (Golang) for high-concurrency backends. For AI solutions, we work with OpenAI, LangChain, Python, and RAG (Retrieval-Augmented Generation) architectures. Our stack also includes PostgreSQL, Docker, and cloud-native deployments.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long does it take to build a custom software project with Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Project timelines vary depending on scope and complexity. A typical MVP takes 6–12 weeks, while enterprise-grade platforms may take 3–6 months. Our agile process ensures iterative delivery with regular reviews so you see progress from week one.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the cost of Idea.ly\'s software development services?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly offers competitive nearshore pricing ($$) in both USD and MXN. Costs are tailored to project scope — from fixed-price MVPs to dedicated team models. Contact us at hello@idealy.com.mx for a free project estimate.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Idea.ly build AI agents for businesses?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We design and deploy custom AI agents trained to execute operational workflows, resolve complex requests, and connect to your existing systems (CRM, ERP, databases). Our AI automation service uses LLMs, RAG pipelines, and custom API integrations to replace manual bottlenecks with intelligent automation.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can Idea.ly help with digital marketing and SEO?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely. Our Digital Marketing & Growth service covers SEO strategy, SEM campaigns, conversion funnel engineering, A/B testing, and advanced performance analytics. We design end-to-end customer journeys that turn cold traffic into high-value loyal clients.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I get started with Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Getting started is simple. Reach out via our contact form at idealy.com.mx, email us at hello@idealy.com.mx, or call +52-222-717-9352. Our team (and LEO) will respond within 24 hours with initial recommendations tailored to your challenge.',
            },
          },
        ]
      : [
          {
            '@type': 'Question',
            name: '¿Qué servicios ofrece Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly ofrece cinco servicios principales: Desarrollo de Software a la Medida (Next.js y Go), Automatización y Agentes de IA (integraciones LLM y agentes personalizados), Diseño UX/UI (prototipado de alta fidelidad y sistemas de diseño), Marketing Digital y Crecimiento (SEO, SEM, embudos de conversión), y Consultoría de Transformación Digital (estrategia impulsada por LEO y modernización operativa).',
            },
          },
          {
            '@type': 'Question',
            name: '¿Dónde está ubicado Idea.ly y a qué mercados sirve?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly es un estudio de software nearshore con sede en Puebla, México. Servimos a clientes en México y Estados Unidos, operando en la zona horaria Central (CST) para una colaboración en tiempo real sin fricciones con equipos basados en EE.UU.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué es LEO, la IA de Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'LEO es la inteligencia de consultoría propietaria de Idea.ly — una síntesis de más de 10 años de experiencia en diseño y lógica de IA de vanguardia. LEO audita procesos operativos, sugiere optimizaciones de infraestructura y ayuda a los clientes a construir hojas de ruta de transformación basadas en datos en tiempo récord.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué tecnologías usa Idea.ly para el desarrollo de software?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly construye aplicaciones de alto rendimiento usando Next.js para frontends ultra-rápidos y Go (Golang) para backends de alta concurrencia. Para soluciones de IA trabajamos con OpenAI, LangChain, Python y arquitecturas RAG (Retrieval-Augmented Generation). Nuestro stack incluye también PostgreSQL, Docker y despliegues cloud-native.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cuánto tiempo tarda un proyecto de software con Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Los plazos varían según el alcance y la complejidad. Un MVP típico tarda entre 6 y 12 semanas, mientras que plataformas empresariales pueden requerir de 3 a 6 meses. Nuestro proceso ágil garantiza entregas iterativas con revisiones periódicas para que veas avances desde la primera semana.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cuánto cuesta el desarrollo de software con Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Idea.ly ofrece precios nearshore competitivos ($$) en pesos mexicanos y dólares. Los costos se adaptan al alcance del proyecto — desde MVPs a precio fijo hasta modelos de equipo dedicado. Contáctanos en hello@idealy.com.mx para una estimación gratuita de tu proyecto.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Idea.ly desarrolla agentes de IA para empresas?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. Diseñamos y desplegamos agentes de IA personalizados entrenados para ejecutar flujos operativos, resolver solicitudes complejas y conectarse a tus sistemas existentes (CRM, ERP, bases de datos). Nuestro servicio de automatización usa LLMs, pipelines RAG e integraciones API personalizadas para reemplazar cuellos de botella manuales con automatización inteligente.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Idea.ly ayuda con marketing digital y SEO?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutamente. Nuestro servicio de Marketing Digital y Crecimiento cubre estrategia SEO, campañas SEM, ingeniería de embudos de conversión, pruebas A/B y analítica de rendimiento avanzada. Diseñamos recorridos del cliente de extremo a extremo que convierten tráfico frío en clientes de alto valor.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cómo puedo comenzar a trabajar con Idea.ly?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Comenzar es sencillo. Contáctanos a través de nuestro formulario en idealy.com.mx, escríbenos a hello@idealy.com.mx o llámanos al +52-222-717-9352. Nuestro equipo (y LEO) te responderá en menos de 24 horas con recomendaciones personalizadas para tu desafío.',
            },
          },
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
