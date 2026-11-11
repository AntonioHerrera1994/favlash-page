const burger = document.getElementById('flBurger');
const menu = document.getElementById('flMenu');
const header = document.getElementById('flHeader');
const sentinel = document.getElementById('flSentinel');

if (burger && menu && header) {
  const mq = window.matchMedia('(min-width: 900px)');

  const setOpen = (open, returnFocus = false) => {
    menu.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (!open && returnFocus) burger.focus();
  };

  burger.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));

  // Cierra al elegir una opción, con Esc, al tocar fuera o al pasar a escritorio
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false, true);
  });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
  });
  mq.addEventListener('change', () => setOpen(false));
}

// Header compacto al bajar
if (sentinel && header && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

// Resalta la sección visible en el menú
const spyLinks = [...document.querySelectorAll('.fl-links a[data-spy], .fl-menu ul a[data-spy]')];
const sections = [...new Set(spyLinks.map((a) => a.getAttribute('href')))]
  .map((id) => document.querySelector(id))
  .filter(Boolean);

if (sections.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = '#' + en.target.id;
        spyLinks.forEach((a) => {
          if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => io.observe(s));
}