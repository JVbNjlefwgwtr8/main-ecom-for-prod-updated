import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
const baseUrl ='https://commerce.codetolittech.qzz.io';
  return {
    rules: [
      // MAIN RULESET FOR ALL NORMAL CRAWLERS
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*/admin-profile/',
          '/api/',
          '/auth/',
          '/onboarding/',
          '/_next/',
          '/public/',
        ],
        crawlDelay: 1,
      },

      // GOOGLEBOT MUST HAVE ITS OWN BLOCK (TO OVERWRITE CLOUDFLARE DEFAULT)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/*/admin-profile/',
          '/api/',
          '/auth/',
          '/onboarding/',
          '/_next/',
          '/public/',
        ],
      },

      // BLOCK SPECIFIC SEO BOTS
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
