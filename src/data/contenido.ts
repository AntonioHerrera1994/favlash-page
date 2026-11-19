import type { ImageMetadata } from 'astro';
import type { T } from './servicios';
import { LASH_SETS, LASH_LIFT, BROWS, ORGANIC_BROWS } from './servicios';
import g1 from '../assets/galeria/galeria1.webp';
import g2 from '../assets/galeria/galeria2.webp';
import g4 from '../assets/galeria/galeria4.webp';
import g6 from '../assets/galeria/galeria6.webp';
import g8 from '../assets/galeria/galeria8.png';

export type Cat = 'pestanas' | 'cejas';
export interface GaleriaItem { img: ImageMetadata; title: T; cat: Cat[] }

export const GALERIA: GaleriaItem[] = [
  { img: g8, title: { es: 'Extensiones de pestañas y ceja orgánica', en: 'Lash extensions & organic brows' }, cat: ['pestanas', 'cejas'] },
  { img: g4, title: { es: 'Extensiones de pestañas, volumen ligero', en: 'Lash extensions, light volume' }, cat: ['pestanas'] },
  { img: g1, title: { es: 'Water Brows', en: 'Water Brows' }, cat: ['cejas'] },
  { img: g6, title: { es: 'Extensiones de pestañas híbridas', en: 'Hybrid lash extensions' }, cat: ['pestanas'] },
  { img: g2, title: { es: 'Laminado de ceja, diseño y depilación', en: 'Brow lamination, design & wax' }, cat: ['cejas'] },
  ...LASH_SETS.map((s) => ({ img: s.img, title: { es: s.name, en: s.name }, cat: ['pestanas'] as Cat[] })),
  { img: LASH_LIFT.img, title: { es: LASH_LIFT.name, en: LASH_LIFT.name }, cat: ['pestanas'] as Cat[] },
  ...BROWS.map((b) => ({ img: b.img, title: b.name, cat: ['cejas'] as Cat[] })),
  { img: ORGANIC_BROWS.img, title: { es: ORGANIC_BROWS.name, en: ORGANIC_BROWS.name }, cat: ['cejas'] as Cat[] },
];

export const TESTIMONIOS: { text: T; name: string }[] = [
  {
    text: {
      es: 'El proceso fue súper cómodo y el resultado es simplemente perfecto. Me siento mucho más segura y lista para cualquier ocasión. ¡Son las mejores!',
      en: 'The process was super comfortable and the result is simply perfect. I feel so much more confident and ready for anything. They are the best!',
    },
    name: 'Sofía G.',
  },
  {
    text: {
      es: 'La atención es de primera, siempre te hacen sentir bienvenida y escuchada. Además, la calidad de las extensiones es superior; me duran muchísimo y siempre lucen fabulosas.',
      en: 'First-class service: they always make you feel welcome and heard. The extensions are top quality, they last a long time and always look fabulous.',
    },
    name: 'Valeria M.',
  },
  {
    text: {
      es: 'El ambiente es relajante y el profesionalismo es evidente. Salgo de cada cita sintiéndome renovada y con unas pestañas espectaculares.',
      en: 'The atmosphere is relaxing and the professionalism shows. I leave every appointment feeling renewed, with spectacular lashes.',
    },
    name: 'Andrea P.',
  },
  {
    text: {
      es: 'La calidad del trabajo es excepcional y se nota que utilizan productos de alta gama.',
      en: 'The quality of the work is exceptional, and you can tell they use high-end products.',
    },
    name: 'Laura C.',
  },
];

export type Faq = { q: T; a: T };

export const FAQ_PESTANAS: Faq[] = [
  {
    q: { es: '¿Cada cuánto necesito retoque?', en: 'How often do I need a fill?' },
    a: { es: 'El retoque se agenda entre 15 y 21 días después de tu set. Así tus pestañas se mantienen llenas y parejas.', en: 'Fills are booked 15 to 21 days after your full set, to keep your lashes full and even.' },
  },
  {
    q: { es: '¿Qué es el sistema Korean UV LED?', en: 'What is the Korean UV LED system?' },
    a: { es: 'Es lo más nuevo de Corea en extensiones: el adhesivo se cura con luz UV LED. Dura hasta 1 mes o más, sin alergias, sin comezón ni irritación y sin grumos. Está disponible para cualquier tipo de set y tiene garantía de 7 días.', en: 'The newest lash technique from Korea: the adhesive is cured with UV LED light. It lasts up to 1 month or more, with no allergies, itching, irritation or clumps. It works with any set and comes with a 7-day guarantee.' },
  },
  {
    q: { es: 'No sé qué set elegir, ¿me ayudan?', en: 'I am not sure which set to choose. Can you help?' },
    a: { es: 'Haz nuestro quiz de 30 segundos para ver qué sets van contigo. En tu cita, Sandy revisa la forma de tu ojo y ajusta el diseño.', en: 'Take our 30-second quiz to see which sets suit you. At your appointment, Sandy checks your eye shape and fine-tunes the design.' },
  },
  {
    q: { es: '¿Manga, Fairy Wispy y Medusa tienen retoque?', en: 'Do Manga, Fairy Wispy and Medusa have fills?' },
    a: { es: 'Estos sets se manejan como set nuevo o con Korean UV LED. Escríbenos por WhatsApp para opciones de mantenimiento.', en: 'These sets are offered as a new set or with Korean UV LED. Message us on WhatsApp for maintenance options.' },
  },
  {
    q: { es: '¿Vengo de San Diego, qué tan lejos están?', en: 'I am coming from San Diego. How far are you?' },
    a: { es: 'Estamos en Lázaro Cárdenas 4, Zermeño, Tijuana, a minutos de la garita. Te mandamos la ubicación por WhatsApp al confirmar tu cita.', en: 'We are at Lázaro Cárdenas 4, Zermeño, Tijuana, just minutes from the border. We send you the location on WhatsApp when your appointment is confirmed.' },
  },
];

export const FAQ_CEJAS: Faq[] = [
  {
    q: { es: '¿Qué incluye Organic Brows?', en: 'What does Organic Brows include?' },
    a: { es: 'Laminación de ceja, depilación y diseño, y pigmento en una sola cita por $650 MXN. Por separado sumarían $750 MXN.', en: 'Brow lamination, wax & design, and tint in one appointment for $650 MXN. Booked separately they add up to $750 MXN.' },
  },
  {
    q: { es: '¿La laminación incluye productos para casa?', en: 'Does lamination include aftercare products?' },
    a: { es: 'Sí. Incluye suero regenerador y gel para usar después de 3 semanas del laminado.', en: 'Yes. It includes a regenerating serum and a gel to use after week 3.' },
  },
  {
    q: { es: '¿Puedo combinar cejas con pestañas el mismo día?', en: 'Can I combine brows and lashes on the same day?' },
    a: { es: 'Sí, muchas clientas lo hacen. Avísanos al agendar para reservar el tiempo de ambos servicios.', en: 'Yes, many clients do. Let us know when booking so we reserve time for both.' },
  },
];

export const FAQ_UNAS: Faq[] = [
  {
    q: { es: '¿Cómo sé qué tamaño pedir?', en: 'How do I know which length to ask for?' },
    a: { es: 'Chica es largo 1-2, mediana 3-4-5, grande 6-7 y XL 8-9-10. Si tienes dudas, mándanos una foto de referencia por WhatsApp.', en: 'Short is length 1-2, medium 3-4-5, long 6-7 and XL 8-9-10. If in doubt, send us a reference photo on WhatsApp.' },
  },
  {
    q: { es: '¿El estimador es el precio final?', en: 'Is the estimator the final price?' },
    a: { es: 'Es una referencia con los precios de lista. Los diseños elaborados y rellenos tienen rango de precio; el total se confirma en el salón.', en: 'It is a reference based on list prices. Detailed art and fills have a price range; the total is confirmed at the salon.' },
  },
  {
    q: { es: '¿Las herramientas están esterilizadas?', en: 'Are tools sterilized?' },
    a: { es: 'Sí. Trabajamos manos y pies con herramientas previamente desinfectadas y esterilizadas para tu protección.', en: 'Yes. We work with tools that are disinfected and sterilized beforehand for your protection.' },
  },
];

export const FAQ_GENERAL: Faq[] = [
  {
    q: { es: '¿Cómo agendo mi cita?', en: 'How do I book?' },
    a: { es: 'Agenda en línea con el botón “Agenda tu cita” o escríbenos por WhatsApp al (663) 120-8318.', en: 'Book online with the “Book now” button or message us on WhatsApp at +52 (663) 120-8318.' },
  },
  {
    q: { es: '¿Los precios son en pesos o dólares?', en: 'Are prices in pesos or dollars?' },
    a: { es: 'Todos los precios del sitio están en pesos mexicanos (MXN).', en: 'All prices on this site are in Mexican pesos (MXN).' },
  },
];
