import Script from 'next/script';

interface SeoJsonLdProps {
  data: Record<string, unknown>;
  id: string;
}

export default function SeoJsonLd({ data, id }: SeoJsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
