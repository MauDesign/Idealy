/**
 * PageSchema — emite un <script type="application/ld+json"> en el <head>
 * para schemas específicos de cada página (WebPage, BlogPosting, Service, etc.)
 *
 * Uso:
 *   import PageSchema from '@/app/ui/PageSchema';
 *   // En el JSX de la página, fuera de <body>:
 *   <PageSchema schemas={[webPageSchema, serviceSchema]} />
 *
 * Next.js App Router eleva automáticamente los <script> declarados en el
 * server component de la página al <head> del documento.
 */

interface PageSchemaProps {
  schemas: Record<string, unknown>[];
}

const PageSchema = ({ schemas }: PageSchemaProps) => {
  if (!schemas || schemas.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas),
      }}
    />
  );
};

export default PageSchema;
