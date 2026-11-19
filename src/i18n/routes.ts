export type Lang = 'es' | 'en';

// Una clave por página; cada idioma tiene su propia URL (bueno para SEO local).
export const ROUTES = {
  home: { es: '/', en: '/en' },
  servicios: { es: '/servicios', en: '/en/services' },
  pestanas: { es: '/servicios/pestanas', en: '/en/services/lash-extensions' },
  cejas: { es: '/servicios/cejas', en: '/en/services/brows' },
  unas: { es: '/servicios/unas', en: '/en/services/nails' },
  maquillaje: { es: '/servicios/maquillaje', en: '/en/services/makeup' },
  quiz: { es: '/encuentra-tu-estilo', en: '/en/find-your-lash-style' },
  galeria: { es: '/galeria', en: '/en/gallery' },
  nosotras: { es: '/nosotras', en: '/en/about' },
  cuidados: { es: '/cuidados-y-faq', en: '/en/aftercare-faq' },
  privacidad: { es: '/aviso-de-privacidad', en: '/aviso-de-privacidad' },
  terminos: { es: '/terminos-y-condiciones', en: '/terminos-y-condiciones' },
} as const;

export type RouteKey = keyof typeof ROUTES;

export const r = (key: RouteKey, lang: Lang) => ROUTES[key][lang];

export const UI = {
  es: {
    skip: 'Saltar al contenido',
    nav: { servicios: 'Servicios', galeria: 'Galería', nosotras: 'Nosotras', cuidados: 'Cuidados y FAQ', quiz: 'Encuentra tu estilo', todos: 'Todos los servicios' },
    book: 'Agenda tu cita',
    bookShort: 'Agendar',
    whatsapp: 'WhatsApp',
    askWa: 'Preguntar por WhatsApp',
    club: 'Club FavLash',
    menu: 'Menú',
    close: 'Cerrar',
    langSwitch: 'English',
    langSwitchLabel: 'Ver sitio en inglés',
    from: 'desde',
    priceNote: 'Precios en pesos mexicanos (MXN).',
    home: 'Inicio',
    seeMore: 'Ver más',
    footer: {
      tagline: 'Estudio de belleza en Tijuana especializado en extensiones de pestañas, cejas y uñas. A minutos de la garita para clientas de San Diego.',
      contacto: 'Contacto',
      explora: 'Explora',
      legal: 'Legal',
      privacidad: 'Aviso de privacidad',
      terminos: 'Términos y condiciones',
      rights: 'Todos los derechos reservados.',
      dev: 'Desarrollado por',
    },
    waDefault: 'Hola, quiero información para agendar una cita en FavLash.',
    waService: (s: string) => `Hola, quiero agendar ${s} en FavLash.`,
  },
  en: {
    skip: 'Skip to content',
    nav: { servicios: 'Services', galeria: 'Gallery', nosotras: 'About', cuidados: 'Aftercare & FAQ', quiz: 'Find your style', todos: 'All services' },
    book: 'Book now',
    bookShort: 'Book',
    whatsapp: 'WhatsApp',
    askWa: 'Ask on WhatsApp',
    club: 'Club FavLash',
    menu: 'Menu',
    close: 'Close',
    langSwitch: 'Español',
    langSwitchLabel: 'Ver sitio en español',
    from: 'from',
    priceNote: 'Prices in Mexican pesos (MXN).',
    home: 'Home',
    seeMore: 'See more',
    footer: {
      tagline: 'Beauty studio in Tijuana specializing in lash extensions, brows and nails. Minutes from the border for San Diego clients.',
      contacto: 'Contact',
      explora: 'Explore',
      legal: 'Legal',
      privacidad: 'Privacy notice (Spanish)',
      terminos: 'Terms (Spanish)',
      rights: 'All rights reserved.',
      dev: 'Developed by',
    },
    waDefault: 'Hi, I would like information to book an appointment at FavLash.',
    waService: (s: string) => `Hi, I would like to book ${s} at FavLash.`,
  },
} as const;
