/**
 * idealy.com.mx — Keywords estratégicas 2026
 * ============================================================
 * ARQUITECTURA BILINGÜE RECOMENDADA:
 *
 *   idealy.com.mx/          → versión ES (mercado MX + LATAM)
 *   idealy.com.mx/en/       → versión EN (mercado US + nearshore)
 *
 * Usar keywords del grupo ES en páginas bajo /
 * Usar keywords del grupo EN en páginas bajo /en/
 * Las keywords "Shared" aplican en ambas versiones.
 *
 * Estrategia: formato pregunta conversacional para GEO/AEO
 * (ChatGPT, Perplexity, Claude, Google AI Overviews).
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
// ESPAÑOL — Mercado México y LATAM  (idealy.com.mx/)
// ─────────────────────────────────────────────────────────────

export const keywordsES = {

  // — GEO prioritario: preguntas conversacionales —
  // Estas son las queries exactas que los usuarios le hacen a
  // ChatGPT, Perplexity y Google AI. Usarlas como H1/H2 en
  // artículos del blog y como FAQ schema en cada página.
  geo: [
    '¿cuánto cuesta implementar inteligencia artificial en una empresa mexicana en 2026?',
    '¿cómo automatizar procesos empresariales con inteligencia artificial en México?',
    '¿qué son los agentes de IA autónomos y para qué sirven en empresas mexicanas?',
    '¿qué es RAG y cómo puede mejorar los procesos de mi empresa?',
    '¿cómo implementar un chatbot con IA en WhatsApp Business para mi empresa?',
    '¿cuánto retorno de inversión genera una estrategia de marketing digital con IA?',
    '¿cómo crear un embudo de ventas digital para empresas B2B en México?',
    'casos de éxito de inteligencia artificial en empresas medianas de México',
  ],

  // — Local SEO: Puebla + México —
  // Usar en meta title, meta description, H1 de páginas de
  // servicios y en el schema LocalBusiness del homepage.
  local: [
    'consultora de inteligencia artificial en Puebla México',
    'agencia de automatización con inteligencia artificial Puebla',
    'mejor agencia de inteligencia artificial en Puebla México',
    'desarrollo de software con inteligencia artificial para empresas en México',
    'consultoría de inteligencia artificial para PyMEs en México 2026',
    'diseño web puebla',
    'desarrollo web profesional puebla',
    'agencia de transformación digital Puebla México',
  ],

  // — Servicios core (una keyword maestra por servicio) —
  // Cada una debe tener su propia landing page optimizada.
  // NO crear páginas separadas para variaciones de la misma.
  servicios: [
    'diseño y desarrollo web para empresas en México',       // consolida: diseño web, desarrollo web, creación de sitios web
    'desarrollo de aplicaciones móviles a la medida',
    'software a la medida para empresas',
    'diseño UX/UI para aplicaciones empresariales en México',
    'automatización de procesos con inteligencia artificial',
    'integración de LLMs en procesos empresariales México',
    'consultoría de transformación digital para empresas',
    'arquitectura de software escalable para startups y PyMEs',
  ],

  // — Long-tail de alta conversión (fondo de embudo) —
  // Quien busca estas frases está evaluando contratación.
  // Usar en páginas de servicios específicos y casos de éxito.
  conversion: [
    'empresa de desarrollo de software en Puebla',
    'agencia de diseño web responsivo para pymes México',
    'consultoría de negocios digitales para emprendedores',
    'desarrollo web con Next.js para empresas en México',
    'implementación de chatbots con IA para atención al cliente',
    'automatización con Make Zapier y agentes IA México',
  ],

} as const

// ─────────────────────────────────────────────────────────────
// ENGLISH — US Market & Nearshore  (idealy.com.mx/en/)
// ─────────────────────────────────────────────────────────────

export const keywordsEN = {

  // — GEO conversational (EN) —
  // Queries that US decision-makers type into ChatGPT/Perplexity
  // when evaluating nearshore or AI consulting options.
  geo: [
    'how much does AI implementation cost in Mexico?',
    'what are autonomous AI agents and how can they help my business?',
    'how to implement a RAG system for enterprise use cases?',
    'best AI consulting agency in Mexico for US companies',
    'AI automation case studies for mid-size companies in Mexico',
    'how to build a high-converting B2B digital sales funnel with AI?',
  ],

  // — Nearshore: US companies looking for Mexican partners —
  // Use in /en/ page H1, meta title, and Organization schema.
  nearshore: [
    'nearshore software development in Puebla Mexico for US companies',
    'nearshore AI development team Mexico 2026',
    'AI consulting agency Mexico for US companies',
    'bilingual tech partner Mexico USA',
    'custom software development Mexico nearshore',
    'digital transformation consultancy North America',
  ],

  // — Services (EN) —
  // One master keyword per service, used in /en/services/ pages.
  services: [
    'custom AI agents for business automation',
    'AI-driven workflow automation for enterprises',
    'custom software development with AI Mexico',
    'premium UX/UI design agency Mexico',
    'full-stack development Next.js and Go',
    'scalable cloud solutions for growing companies',
    'high-performance web engineering Mexico',
    'LLM integration and RAG systems for business',
  ],

  // — Long-tail conversion (EN) —
  conversion: [
    'how to hire an AI consulting firm in Mexico',
    'cost of nearshore AI development vs US agencies',
    'AI chatbot implementation for customer service Mexico',
    'strategic digital growth funnels for B2B SaaS',
  ],

} as const

// ─────────────────────────────────────────────────────────────
// SHARED — Términos de marca (ambas versiones)
// ─────────────────────────────────────────────────────────────
// Estas se posicionan solas conforme crece la autoridad de
// dominio. No requieren esfuerzo editorial activo hoy.

export const keywordsBrand = [
  'idealy',
  'idealy.com.mx',
  'idea.ly',
  'idealy puebla',
  'idealy mexico',
  'idealy AI consulting',
] as const

// ─────────────────────────────────────────────────────────────
// EXPORT UNIFICADO — para metadata de Next.js / Astro / etc.
// ─────────────────────────────────────────────────────────────
// Uso en layout.tsx o en el head de cada página:
//
//   import { getKeywordsForLocale } from '@/config/keywords'
//   export const metadata = {
//     keywords: getKeywordsForLocale('es').join(', '),
//   }

type Locale = 'es' | 'en'

export function getKeywordsForLocale(locale: Locale): string[] {
  const brand = [...keywordsBrand]

  if (locale === 'en') {
    return [
      ...keywordsEN.geo,
      ...keywordsEN.nearshore,
      ...keywordsEN.services,
      ...keywordsEN.conversion,
      ...brand,
    ]
  }

  return [
    ...keywordsES.geo,
    ...keywordsES.local,
    ...keywordsES.servicios,
    ...keywordsES.conversion,
    ...brand,
  ]
}

// ─────────────────────────────────────────────────────────────
// MAPA DE KEYWORDS POR PÁGINA
// ─────────────────────────────────────────────────────────────
// Cada página debe tener sus propias keywords específicas.
// Nunca usar la lista completa en todas las páginas —
// eso diluye la relevancia y genera canibalización.

export const keywordsByPage = {

  // Homepage ES
  'home-es': [
    'consultora de inteligencia artificial en Puebla México',
    'consultoría de inteligencia artificial para PyMEs en México 2026',
    'automatización de procesos con inteligencia artificial',
    'desarrollo de software con inteligencia artificial para empresas en México',
    'agencia de transformación digital Puebla México',
  ],

  // Homepage EN
  'home-en': [
    'AI consulting agency Mexico for US companies',
    'nearshore software development in Puebla Mexico for US companies',
    'custom AI agents for business automation',
    'bilingual tech partner Mexico USA',
    'digital transformation consultancy North America',
  ],

  // Página de servicios: IA y automatización
  'service-ai': [
    '¿cómo automatizar procesos empresariales con inteligencia artificial en México?',
    'automatización de procesos con inteligencia artificial',
    'integración de LLMs en procesos empresariales México',
    '¿qué son los agentes de IA autónomos y para qué sirven en empresas mexicanas?',
    'implementación de chatbots con IA para atención al cliente',
  ],

  // Página de servicios: desarrollo web y software
  'service-dev': [
    'diseño y desarrollo web para empresas en México',
    'desarrollo de aplicaciones móviles a la medida',
    'software a la medida para empresas',
    'desarrollo web con Next.js para empresas en México',
    'diseño UX/UI para aplicaciones empresariales en México',
    'arquitectura de software escalable para startups y PyMEs',
  ],

  // Blog / artículo A1: costos de IA
  'blog-costos-ia': [
    '¿cuánto cuesta implementar inteligencia artificial en una empresa mexicana en 2026?',
    'consultoría de inteligencia artificial para PyMEs en México 2026',
    'casos de éxito de inteligencia artificial en empresas medianas de México',
  ],

  // Blog / artículo A3: chatbots WhatsApp
  'blog-chatbot-whatsapp': [
    '¿cómo implementar un chatbot con IA en WhatsApp Business para mi empresa?',
    'implementación de chatbots con IA para atención al cliente',
    'automatización con Make Zapier y agentes IA México',
  ],

  // Blog / artículo A6: nearshore EN
  'blog-nearshore-en': [
    'AI consulting agency Mexico for US companies',
    'nearshore AI development team Mexico 2026',
    'how much does AI implementation cost in Mexico?',
    'cost of nearshore AI development vs US agencies',
  ],

} as const

// ─────────────────────────────────────────────────────────────
// KEYWORDS ELIMINADAS (referencia — no usar)
// ─────────────────────────────────────────────────────────────
// Razón de eliminación documentada para evitar que vuelvan.

export const _removedKeywords = {
  duplicados: [
    // Duplicados de capitalización — Google y LLMs los tratan igual
    'Desarrollo de software a la medida',
    'Desarrollo de aplicaciones web',
    'Desarrollo de aplicaciones móviles',
    'Desarrollo de sitios web',
    'Desarrollo de sitios web responsivos',
    'Desarro web profesional',   // también tiene typo
    'Diseño UX',
    'Consultoria Diseño UX',
    'Diseño Web puebla',
    'Desarrollo Nearshoring',
    'Innovacion tecnologica',
  ],
  sinVolumen: [
    // Frases aspiracionales sin búsquedas reales
    'Ideas y soluciones',
    'estrategia de crecimiento digital exponencial',
    'diseño de productos digitales premium',
    'marketing basado en resultados ROI',
    'high-performance web engineering',          // demasiado genérico EN
  ],
  canibalizacion: [
    // Fusionadas en 'diseño y desarrollo web para empresas en México'
    'diseño web',
    'desarrollo web',
    'Diseño web',
    'Desarrollo web',
    'creación de sitios web',
    'diseño de páginas web para pymes',
    'diseño de páginas web para empresas',
    'diseño de páginas web para startups',
    'diseño de páginas web para emprendedores',
    'desarrollo de sitios web',
    'desarrollo de sitios web responsivos',
    'desarro web profesional',
  ],
} as const
