// Fuente única de servicios y precios del sitio público.
// Transcrito de las listas de precios 2026 publicadas en favlash.com
// (preciosnuevos1, preciosnuevos1b, preciosnuevos1d, cejas, unas-precios y el popup de Korean UV LED).
// NO se lee del CRM. Para cambiar un precio, edítalo aquí.
import type { ImageMetadata } from 'astro';
import classicBeauty from '../assets/servicios/classic-beauty.webp';
import mascaraEffect from '../assets/servicios/mascara-effect.webp';
import alohaLashes from '../assets/servicios/aloha-lashes.webp';
import pureAura from '../assets/servicios/pure-aura.webp';
import goddessLook from '../assets/servicios/goddess-look.webp';
import cleopatraVolume from '../assets/servicios/cleopatra-volume.webp';
import luxeWispy from '../assets/servicios/luxe-wispy.webp';
import kawaiiLook from '../assets/servicios/kawaii-look.webp';
import mangaEffect from '../assets/servicios/manga-effect.webp';
import fairyWispy from '../assets/servicios/fairy-wispy.webp';
import medusaEffect from '../assets/servicios/medusa-effect.webp';
import koreanLashLift from '../assets/servicios/korean-lash-lift.webp';
import laminacion from '../assets/servicios/laminacion-cejas.webp';
import depilacion from '../assets/servicios/depilacion-diseno.webp';
import pigmento from '../assets/servicios/pigmento-cejas.webp';
import organicBrows from '../assets/servicios/organic-brows.webp';
import uvLed from '../assets/servicios/korean-uv-led.webp';

export type T = { es: string; en: string };

/** textura: soft = clásico/volumen liso · wispy = picos suaves · spiky = picos marcados */
export type Textura = 'soft' | 'wispy' | 'spiky';

export interface LashSet {
  slug: string;
  name: string;
  alias?: T;
  desc: T;
  /** 1 = muy natural … 5 = dramático. Orientativo para el filtro y el quiz. */
  intensidad: 1 | 2 | 3 | 4 | 5;
  textura: Textura;
  precios: { nuevo: number; retoque?: number; uv: number };
  img: ImageMetadata;
}

export const LASH_SETS: LashSet[] = [
  {
    slug: 'classic-beauty', name: 'Classic Beauty', intensidad: 1, textura: 'soft',
    desc: { es: 'Ideal para quien busca algo sutil y natural para su día a día.', en: 'For anyone who wants something subtle and natural for every day.' },
    precios: { nuevo: 850, retoque: 550, uv: 1150 }, img: classicBeauty,
  },
  {
    slug: 'pure-aura', name: 'Pure Aura', intensidad: 2, textura: 'soft',
    desc: { es: 'Sensación de ligereza en tus ojos: un look de frescura y suavidad.', en: 'A feather-light feel with a fresh, soft look.' },
    precios: { nuevo: 1100, retoque: 650, uv: 1400 }, img: pureAura,
  },
  {
    slug: 'goddess-look', name: 'Goddess Look', alias: { es: 'Volumen griego', en: 'Greek volume' }, intensidad: 2, textura: 'soft',
    desc: { es: 'Volumen ligero para tu look del día a día, elegante y discreto.', en: 'Light volume for everyday wear: elegant and understated.' },
    precios: { nuevo: 1100, retoque: 650, uv: 1400 }, img: goddessLook,
  },
  {
    slug: 'luxe-wispy', name: 'Luxe Wispy', intensidad: 3, textura: 'wispy',
    desc: { es: 'Combinación de texturas para crear una mirada natural y definida.', en: 'A mix of textures for a natural yet defined look.' },
    precios: { nuevo: 1100, retoque: 650, uv: 1400 }, img: luxeWispy,
  },
  {
    slug: 'aloha-lashes', name: 'Aloha Lashes', alias: { es: 'Hawaianas', en: 'Hawaiian lashes' }, intensidad: 3, textura: 'spiky',
    desc: { es: 'Realizadas con fibras YY: efecto abierto y más texturizado, ideales para unas vacaciones en la playa.', en: 'Made with YY fibers for an open, textured effect. Perfect for a beach getaway.' },
    precios: { nuevo: 950, retoque: 650, uv: 1250 }, img: alohaLashes,
  },
  {
    slug: 'kawaii-look', name: 'Kawaii Look', alias: { es: 'Anime set', en: 'Anime set' }, intensidad: 3, textura: 'spiky',
    desc: { es: 'La nueva tendencia de Japón y Corea: mirada más expresiva y ojos más abiertos.', en: 'The latest trend from Japan and Korea: more expressive, wide-open eyes.' },
    precios: { nuevo: 1100, retoque: 650, uv: 1400 }, img: kawaiiLook,
  },
  {
    // Descripción redactada para el sitio: validar con Sandy (la lista de precios no trae texto).
    slug: 'manga-effect', name: 'Manga Effect', intensidad: 3, textura: 'spiky',
    desc: { es: 'Puntas definidas estilo manga para una mirada gráfica y juvenil.', en: 'Defined, manga-style spikes for a graphic, youthful look.' },
    precios: { nuevo: 1150, uv: 1450 }, img: mangaEffect,
  },
  {
    // Descripción redactada para el sitio: validar con Sandy.
    slug: 'fairy-wispy', name: 'Fairy Wispy Effect', intensidad: 3, textura: 'wispy',
    desc: { es: 'Textura wispy ligera con picos suaves, como de hada.', en: 'Light wispy texture with soft, fairy-like spikes.' },
    precios: { nuevo: 1150, uv: 1450 }, img: fairyWispy,
  },
  {
    slug: 'mascara-effect', name: 'Mascara Effect', intensidad: 4, textura: 'soft',
    desc: { es: 'Amarás este efecto si te encanta lo intenso y definido.', en: 'You will love this effect if you like bold, defined lashes.' },
    precios: { nuevo: 850, retoque: 550, uv: 1150 }, img: mascaraEffect,
  },
  {
    slug: 'cleopatra-volume', name: 'Cleopatra Volume', alias: { es: 'Volumen egipcio', en: 'Egyptian volume' }, intensidad: 5, textura: 'soft',
    desc: { es: 'Ideal para las amantes de lo dramático, pero elegante.', en: 'For lovers of drama, kept elegant.' },
    precios: { nuevo: 1100, retoque: 650, uv: 1400 }, img: cleopatraVolume,
  },
  {
    // Descripción redactada para el sitio: validar con Sandy.
    slug: 'medusa-effect', name: 'The Medusa Effect', intensidad: 5, textura: 'wispy',
    desc: { es: 'Nuestro set con más textura y presencia, para una mirada que no pasa desapercibida.', en: 'Our most textured, statement set for eyes that get noticed.' },
    precios: { nuevo: 1250, uv: 1550 }, img: medusaEffect,
  },
];

export const LASH_LIFT = {
  slug: 'korean-lash-lift',
  name: 'Korean Lash Lift',
  alias: { es: 'Banhada', en: 'Banhada' },
  desc: { es: 'Lash lift, hidratación profunda y tinte para tus pestañas naturales.', en: 'Lash lift, deep hydration and tint for your natural lashes.' },
  precio: 1099,
  img: koreanLashLift,
};

export const UV_LED = {
  img: uvLed,
  beneficios: [
    { es: '0 alergias', en: '0 allergies' },
    { es: '0 comezón o irritación', en: '0 itching or irritation' },
    { es: '0 grumos', en: '0 clumps' },
    { es: '100% más cómodas', en: '100% more comfortable' },
  ],
  duracion: { es: 'Duración de hasta 1 mes o más.', en: 'Lasts up to 1 month or more.' },
  disponible: { es: 'Disponible para cualquier tipo de extensiones: híbridas, volumen, clásica y más.', en: 'Available for any extension type: hybrid, volume, classic and more.' },
  garantia: { es: 'Garantía de 7 días con esta nueva técnica.', en: '7-day guarantee with this new technique.' },
};

export interface BrowService { slug: string; name: T; desc: T; precio: number; img: ImageMetadata; incluye?: T }

export const BROWS: BrowService[] = [
  {
    slug: 'laminacion', name: { es: 'Laminación de ceja', en: 'Brow lamination' }, precio: 350, img: laminacion,
    desc: { es: 'Cejas peinadas, con más cuerpo y forma por semanas.', en: 'Brushed-up, fuller, shaped brows that last for weeks.' },
    incluye: { es: 'Incluye suero regenerador y gel para después de 3 semanas del laminado.', en: 'Includes regenerating serum and gel for after week 3.' },
  },
  {
    slug: 'depilacion-diseno', name: { es: 'Depilación y diseño', en: 'Brow wax & design' }, precio: 200, img: depilacion,
    desc: { es: 'Diseño a la medida de tu rostro y depilación de precisión.', en: 'A shape designed for your face, with precise waxing.' },
  },
  {
    slug: 'pigmento', name: { es: 'Pigmento de cejas', en: 'Brow tint' }, precio: 200, img: pigmento,
    desc: { es: 'Color que rellena y define sin maquillaje diario.', en: 'Color that fills and defines, no daily makeup needed.' },
  },
];

export const ORGANIC_BROWS = {
  slug: 'organic-brows', name: 'Organic Brows', precio: 650, img: organicBrows,
  desc: { es: 'El paquete completo: laminación + depilación y diseño + pigmento.', en: 'The full package: lamination + wax & design + tint.' },
  separado: 350 + 200 + 200,
};

export type SizeKey = 'chica' | 'mediana' | 'grande' | 'xl';
export const NAIL_SIZES: { key: SizeKey; label: T; largo: string }[] = [
  { key: 'chica', label: { es: 'Chica', en: 'Short' }, largo: '1-2' },
  { key: 'mediana', label: { es: 'Mediana', en: 'Medium' }, largo: '3-4-5' },
  { key: 'grande', label: { es: 'Grande', en: 'Long' }, largo: '6-7' },
  { key: 'xl', label: { es: 'XL', en: 'XL' }, largo: '8-9-10' },
];

export const NAIL_SETS = [
  { key: 'acrilicas', name: { es: 'Uñas acrílicas', en: 'Acrylic nails' }, precios: { chica: 350, mediana: 400, grande: 450, xl: 550 } as Partial<Record<SizeKey, number>> },
  { key: 'softgel', name: { es: 'Soft-gel', en: 'Soft gel' }, precios: { chica: 400, mediana: 450, grande: 500 } as Partial<Record<SizeKey, number>> },
];

export const NAIL_EXTRAS: { key: string; name: T; min: number; max?: number }[] = [
  { key: 'gel1', name: { es: 'Gel (1 tono)', en: 'Gel polish (1 color)' }, min: 180 },
  { key: 'gel23', name: { es: 'Gel (2-3 tonos)', en: 'Gel polish (2-3 colors)' }, min: 250 },
  { key: 'diseno', name: { es: 'Diseño sencillo', en: 'Simple nail art' }, min: 100 },
  { key: 'disenoe', name: { es: 'Diseño elaborado', en: 'Detailed nail art' }, min: 150, max: 230 },
  { key: 'efecto', name: { es: 'Efecto', en: 'Effect finish' }, min: 150 },
  { key: 'rubber', name: { es: 'Rubber', en: 'Rubber base' }, min: 200 },
  { key: 'bano', name: { es: 'Baño de acrílico', en: 'Acrylic overlay' }, min: 250 },
  { key: 'relleno', name: { es: 'Relleno', en: 'Fill' }, min: 200, max: 280 },
  { key: 'retiro', name: { es: 'Retiro de uñas', en: 'Nail removal' }, min: 180 },
  { key: 'reposicion', name: { es: 'Reposición de uña', en: 'Single nail repair' }, min: 50 },
];

export const MANI_PEDI: { key: string; name: T; precio: number }[] = [
  { key: 'mani-express', name: { es: 'Manicura express', en: 'Express manicure' }, precio: 250 },
  { key: 'mani-spa', name: { es: 'Manicura SPA', en: 'Spa manicure' }, precio: 350 },
  { key: 'pedi-express', name: { es: 'Pedicure express', en: 'Express pedicure' }, precio: 450 },
  { key: 'pedi-spa', name: { es: 'Pedicure SPA', en: 'Spa pedicure' }, precio: 550 },
];

export const MAQUILLAJE = {
  desc: {
    es: 'Realza tu belleza con un look personalizado, desde natural hasta glamuroso, para cada ocasión especial.',
    en: 'Enhance your beauty with a personalized look, from natural to glam, for every special occasion.',
  },
};
