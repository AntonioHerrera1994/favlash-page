// Datos de contacto y enlaces globales del sitio público.
// Cambia BOOKING_URL a '/agendar' cuando el módulo de citas propio esté listo.
export const SITE = {
  url: 'https://favlash.com',
  name: 'FavLash by Sandy Herrera',
  bookingUrl: 'https://calendly.com/contacto-favlash/citas',
  clubUrl: 'https://club.favlash.com/?utm_source=favlash.com&utm_medium=navbar&utm_campaign=club',
  whatsapp: '526631208318',
  phone: '+526631208318',
  phoneDisplay: '(663) 120-8318',
  email: 'sundae.hq@gmail.com',
  address: {
    street: 'Lázaro Cárdenas 4, Zermeño',
    postalCode: '22120',
    city: 'Tijuana',
    region: 'B.C.',
    country: 'MX',
  },
  geo: { lat: 32.4806767, lng: -116.9364357 },
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3365.70143371384!2d-116.93643569999999!3d32.4806767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d939d6f5d98b3b%3A0x291193318f2e7b15!2sFavlash!5e0!3m2!1sen!2smx!4v1748458839727!5m2!1sen!2smx',
  mapsLink: 'https://maps.google.com/?q=Favlash+L%C3%A1zaro+C%C3%A1rdenas+4+Zerme%C3%B1o+Tijuana',
  social: {
    instagram: 'https://www.instagram.com/favlash.sandyh/',
    facebook: 'https://www.facebook.com/favlash.sandyh',
    tiktok: 'https://www.tiktok.com/@favlash',
  },
};

export const wa = (msg: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

export const mxn = (n: number) => '$' + n.toLocaleString('en-US');
