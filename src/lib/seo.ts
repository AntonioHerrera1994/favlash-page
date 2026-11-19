import { SITE } from '../config/site';
import type { Faq } from '../data/contenido';
import type { Lang } from '../i18n/routes';

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE.url + it.path })),
});

export const faqLd = (faqs: Faq[], lang: Lang) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q[lang], acceptedAnswer: { '@type': 'Answer', text: f.a[lang] } })),
});

/** Catálogo de servicios con precios en MXN, ligado al salón. */
export const offerCatalogLd = (name: string, url: string, offers: { name: string; price?: number; description?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  url: SITE.url + url,
  provider: { '@id': SITE.url + '/#salon' },
  areaServed: [{ '@type': 'City', name: 'Tijuana' }, { '@type': 'City', name: 'San Diego' }],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name,
    itemListElement: offers.map((o) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: o.name, ...(o.description ? { description: o.description } : {}) },
      ...(o.price ? { price: o.price, priceCurrency: 'MXN' } : {}),
    })),
  },
});
