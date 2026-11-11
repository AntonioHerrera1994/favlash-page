const wa = document.getElementById('headWa');
const label = document.getElementById('headWaLabel');
const live = document.getElementById('headLive');
const chips = [...document.querySelectorAll('.head__chip')];

if (wa && label && chips.length) {
  const number = wa.dataset.wa;
  const link = (msg) => `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

  const select = (chip) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    if (chip) {
      wa.href = link(chip.dataset.msg);
      label.textContent = `Pedir cita de ${chip.dataset.label.toLowerCase()} por WhatsApp`;
      if (live) live.textContent = `Seleccionado: ${chip.dataset.label}. El botón de WhatsApp ya lleva tu mensaje.`;
    } else {
      wa.href = link(wa.dataset.default);
      label.textContent = 'Escríbenos por WhatsApp';
      if (live) live.textContent = 'Selección quitada.';
    }
  };

  chips.forEach((chip) =>
    chip.addEventListener('click', () => select(chip.getAttribute('aria-pressed') === 'true' ? null : chip))
  );
}