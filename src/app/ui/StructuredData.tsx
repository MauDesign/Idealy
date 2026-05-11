import React from 'react';

const StructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.idealy.com.mx/#organization",
    "name": "Idea.ly",
    "url": "https://www.idealy.com.mx",
    "logo": "https://www.idealy.com.mx/img/Logo-Idealy.png",
    "image": "https://www.idealy.com.mx/img/Consulting-leo-idealy.jpg",
    "description": "High-Performance Software, AI Automation & UX Design. Nearshore Strategic Studio driving exponential growth for US & MX markets.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Puebla",
      "addressCountry": "MX"
    },
    "sameAs": [
      "https://www.linkedin.com/company/idealy",
      "https://twitter.com/idealy",
      "https://www.instagram.com/idealy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "hello@idealy.com.mx",
      "url": "https://www.idealy.com.mx/#contact"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.idealy.com.mx/#website",
    "url": "https://www.idealy.com.mx",
    "name": "Idea.ly",
    "publisher": {
      "@id": "https://www.idealy.com.mx/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.idealy.com.mx/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Software Development & AI Automation",
    "provider": {
      "@id": "https://www.idealy.com.mx/#organization"
    },
    "areaServed": ["MX", "US"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Idea.ly Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Software Development",
            "description": "Scalable web and mobile applications built with Next.js and Go."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Automation",
            "description": "Custom AI agents and LLM integration for business workflow optimization."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "UX/UI Design",
            "description": "Intuitive and premium user experience design for digital products."
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
