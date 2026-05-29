import React from 'react';

interface StructuredDataProps {
  locale?: string;
}

const StructuredData = ({ locale = 'es' }: StructuredDataProps) => {
  const isEn = locale === 'en';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.idealy.com.mx/#organization",
    "name": "Idea.ly",
    "url": "https://www.idealy.com.mx",
    "logo": "https://www.idealy.com.mx/img/Logo-Idealy.png",
    "image": "https://www.idealy.com.mx/img/Consulting-leo-idealy.jpg",
    "description": isEn 
      ? "High-Performance Software, AI Automation & UX Design. Nearshore Strategic Studio driving exponential growth for US & MX markets."
      : "Desarrollo de Software de Alto Rendimiento, Automatización con IA y Diseño UX. Estudio estratégico Nearshore que impulsa el crecimiento exponencial para los mercados de EE. UU. y México.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Puebla",
      "addressCountry": "MX"
    },
    "sameAs": [
      "https://www.facebook.com/idealy.com.mx",
      "https://www.instagram.com/idealy.com.mx",
      "https://x.com/idealy_mx",
      "https://www.linkedin.com/company/idealy",
      "https://www.tiktok.com/@idealy.com.mx"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": isEn ? "customer support" : "soporte al cliente",
      "email": "hello@idealy.com.mx",
      "url": `https://www.idealy.com.mx/${locale}#contact`
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.idealy.com.mx/#website",
    "url": `https://www.idealy.com.mx/${locale}`,
    "name": "Idea.ly",
    "publisher": {
      "@id": "https://www.idealy.com.mx/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://www.idealy.com.mx/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": isEn ? "Software Development & AI Automation" : "Desarrollo de Software y Automatización con IA",
    "provider": {
      "@id": "https://www.idealy.com.mx/#organization"
    },
    "areaServed": ["MX", "US"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isEn ? "Idea.ly Services" : "Servicios de Idea.ly",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEn ? "Custom Software Development" : "Desarrollo de Software a la Medida",
            "description": isEn 
              ? "Scalable web and mobile applications built with Next.js and Go."
              : "Aplicaciones web y móviles escalables construidas con Next.js y Go."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEn ? "AI Automation & Agents" : "Automatización y Agentes de IA",
            "description": isEn 
              ? "Custom AI agents and LLM integration for business workflow optimization."
              : "Agentes de IA personalizados e integración de modelos LLM para la optimización de flujos de trabajo empresariales."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEn ? "UX/UI Design" : "Diseño UX/UI",
            "description": isEn 
              ? "Intuitive and premium user experience design for digital products."
              : "Diseño de experiencia de usuario intuitivo y premium para productos digitales."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEn ? "Digital Marketing" : "Marketing Digital y Crecimiento",
            "description": isEn 
              ? "Conversion funnel engineering and high-ROI growth marketing."
              : "Ingeniería de embudos de conversión y marketing de crecimiento con alto retorno de inversión."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEn ? "Digital Transformation Consulting" : "Consultoría de Transformación Digital",
            "description": isEn 
              ? "Practical technological strategy driven by AI workflows and LEO."
              : "Estrategia tecnológica práctica impulsada por flujos de trabajo de IA y LEO."
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organizationSchema, websiteSchema, servicesSchema]),
      }}
    />
  );
};

export default StructuredData;
