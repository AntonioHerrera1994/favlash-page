// Interacciones globales del sitio público (sin dependencias).
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Header compacto + barra móvil */
const hdr = $('#hdr');
const mbar = $('#mbar');
let ticking = false;
const onScroll = () => {
  const y = scrollY;
  hdr?.classList.toggle('is-stuck', y > 40);
  mbar?.classList.toggle('is-on', y > 520);
  ticking = false;
};
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
onScroll();

/* Menú desplegable de servicios */
$$('[data-dd]').forEach((dd) => {
  const btn = $('button', dd);
  const set = (open) => { open ? dd.setAttribute('data-open', '') : dd.removeAttribute('data-open'); btn.setAttribute('aria-expanded', String(open)); };
  let t;
  dd.addEventListener('mouseenter', () => { clearTimeout(t); set(true); });
  dd.addEventListener('mouseleave', () => { t = setTimeout(() => set(false), 160); });
  btn.addEventListener('click', () => set(!dd.hasAttribute('data-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  document.addEventListener('click', (e) => { if (!dd.contains(e.target)) set(false); });
});

/* Menú móvil */
const burger = $('.burger');
const drawer = $('#drawer');
burger?.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') !== 'true';
  burger.setAttribute('aria-expanded', String(open));
  drawer.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('#drawer a').forEach((a) => a.addEventListener('click', () => { burger.click(); }));

/* Aparición al hacer scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
$$('[data-reveal]').forEach((el) => io.observe(el));

/* Lista de categorías: foto que sigue al cursor */
const catImg = $('.cats__img');
if (catImg && matchMedia('(hover: hover)').matches) {
  const pic = $('img', catImg);
  let x = 0, y = 0, cx = 0, cy = 0, raf;
  const loop = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; catImg.style.left = cx + 'px'; catImg.style.top = cy + 'px'; raf = requestAnimationFrame(loop); };
  $$('.cats a[data-img]').forEach((a) => {
    a.addEventListener('mouseenter', (e) => {
      pic.src = a.dataset.img; x = cx = e.clientX; y = cy = e.clientY;
      catImg.classList.add('is-on'); cancelAnimationFrame(raf); if (!reduce) loop();
    });
    a.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; if (reduce) { catImg.style.left = x + 'px'; catImg.style.top = y + 'px'; } });
    a.addEventListener('mouseleave', () => { catImg.classList.remove('is-on'); cancelAnimationFrame(raf); });
  });
}

/* Selector de modalidad de precio (Set nuevo / Retoque / Korean UV LED) */
$$('[data-pricemode]').forEach((group) => {
  const scope = document.getElementById(group.dataset.pricemode) || document;
  $$('button', group).forEach((b) => b.addEventListener('click', () => {
    $$('button', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const mode = b.dataset.mode;
    $$('[data-price]', scope).forEach((el) => {
      const v = el.dataset[mode];
      const label = el.dataset['l' + mode];
      el.classList.toggle('is-na', !v);
      el.innerHTML = v ? `<small>${label}</small>$${Number(v).toLocaleString('en-US')}` : `<small>${label}</small>${el.dataset.na}`;
      el.classList.remove('price-flash'); void el.offsetWidth; el.classList.add('price-flash');
    });
  }));
});

/* Filtro por intensidad */
$$('[data-intensity]').forEach((input) => {
  const scope = document.getElementById(input.dataset.intensity);
  const out = input.parentElement.querySelector('output');
  const count = document.querySelector(`[data-count="${input.dataset.intensity}"]`);
  const labels = JSON.parse(input.dataset.labels);
  const apply = () => {
    const v = Number(input.value);
    input.style.setProperty('--p', (v / 5) * 100 + '%');
    out.textContent = labels[v];
    let n = 0;
    $$('[data-int]', scope).forEach((c) => {
      const show = v === 0 || Math.abs(Number(c.dataset.int) - v) <= 1;
      c.classList.toggle('is-hidden', !show);
      if (show) n++;
    });
    if (count) count.textContent = count.dataset.tpl.replace('{n}', n);
  };
  input.addEventListener('input', apply);
  apply();
});

/* Galería: filtros + visor */
$$('[data-gallery]').forEach((gal) => {
  const figs = $$('figure', gal);
  const btns = $$(`[data-filter-for="${gal.id}"] button`);
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    figs.forEach((f) => f.classList.toggle('is-hidden', b.dataset.f !== 'all' && !f.dataset.cat.split(' ').includes(b.dataset.f)));
  }));
  const lb = $('#lb');
  if (!lb) return;
  const img = $('img', lb), cap = $('p', lb);
  let i = 0;
  const visible = () => figs.filter((f) => !f.classList.contains('is-hidden'));
  const show = (f) => { const im = $('img', f); img.src = f.dataset.full; img.alt = im.alt; cap.textContent = $('figcaption', f)?.textContent || ''; };
  figs.forEach((f) => {
    f.tabIndex = 0;
    const open = () => { i = visible().indexOf(f); show(f); lb.showModal(); };
    f.addEventListener('click', open);
    f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  const step = (d) => { const v = visible(); i = (i + d + v.length) % v.length; show(v[i]); };
  $('.lb__prev', lb).addEventListener('click', () => step(-1));
  $('.lb__next', lb).addEventListener('click', () => step(1));
  $('.lb__x', lb).addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
});

/* Popup promocional (una vez por sesión) */
const promo = $('#promo');
if (promo) {
  let seen = false;
  try { seen = sessionStorage.getItem('fl-promo') === '1'; } catch (e) {}
  if (!seen) setTimeout(() => { promo.showModal(); try { sessionStorage.setItem('fl-promo', '1'); } catch (e) {} }, 1600);
  $$('[data-close]', promo).forEach((b) => b.addEventListener('click', () => promo.close()));
  promo.addEventListener('click', (e) => { if (e.target === promo) promo.close(); });
}

/* Medición: clics en "Agendar" */
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-book], a[href*="wa.me"]');
  if (!a) return;
  const isWa = a.href.includes('wa.me');
  try {
    window.gtag?.('event', isWa ? 'contact_whatsapp' : 'begin_booking', { link_url: a.href, page_path: location.pathname });
    window.fbq?.('track', isWa ? 'Contact' : 'Schedule');
  } catch (err) {}
});
