import { useEffect, useState } from 'react';

type Servicio = {
  id: string;
  nombre: string;
  categoria: string;
  duracion_minutos: number;
  precio: number | null;
};

const CATEGORIA_LABEL: Record<string, string> = {
  'pestañas': 'Pestañas',
  cejas: 'Cejas',
  maquillaje: 'Maquillaje',
  manicura: 'Manicura y Pedicura',
};

export default function BookingWidget() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioId, setServicioId] = useState('');
  const [fecha, setFecha] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [datos, setDatos] = useState({ nombre: '', telefono: '', email: '', notas: '' });
  const [estado, setEstado] = useState<'form' | 'enviando' | 'listo' | 'error'>('form');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    fetch('/api/servicios')
      .then((r) => r.json())
      .then((d) => setServicios(d.servicios ?? []));
  }, []);

  useEffect(() => {
    if (!servicioId || !fecha) {
      setSlots([]);
      return;
    }
    setCargandoSlots(true);
    setHoraInicio('');
    fetch(`/api/disponibilidad?servicio_id=${servicioId}&fecha=${fecha}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .finally(() => setCargandoSlots(false));
  }, [servicioId, fecha]);

  const servicioSeleccionado = servicios.find((s) => s.id === servicioId);
  const minFecha = new Date().toISOString().split('T')[0];

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado('enviando');
    setMensajeError('');
    try {
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicio_id: servicioId, fecha, hora_inicio: horaInicio, ...datos }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensajeError(data.error ?? 'No se pudo agendar la cita.');
        setEstado('error');
        return;
      }
      setEstado('listo');
    } catch {
      setMensajeError('Error de conexión. Intenta de nuevo.');
      setEstado('error');
    }
  }

  if (estado === 'listo') {
    return (
      <div className="booking-card booking-confirmacion">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <polyline points="8,12.5 11,15.5 16,9" />
        </svg>
        <h3>Cita agendada</h3>
        <p>
          {datos.nombre}, te esperamos el <strong>{fecha}</strong> a las <strong>{horaInicio}</strong> para tu{' '}
          <strong>{servicioSeleccionado?.nombre}</strong>.
        </p>
        <p className="booking-detalle">Cualquier cambio, contáctanos por WhatsApp.</p>
      </div>
    );
  }

  const porCategoria = servicios.reduce<Record<string, Servicio[]>>((acc, s) => {
    (acc[s.categoria] ??= []).push(s);
    return acc;
  }, {});

  return (
    <form className="booking-card" onSubmit={enviar}>
      <label className="booking-label">
        Servicio
        <select className="booking-input" value={servicioId} onChange={(e) => setServicioId(e.target.value)} required>
          <option value="">Elige un servicio…</option>
          {Object.entries(porCategoria).map(([cat, lista]) => (
            <optgroup label={CATEGORIA_LABEL[cat] ?? cat} key={cat}>
              {lista.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.nombre} ({s.duracion_minutos} min{s.precio ? ` · $${s.precio}` : ''})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <label className="booking-label">
        Fecha
        <input
          className="booking-input"
          type="date"
          min={minFecha}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          disabled={!servicioId}
        />
      </label>

      {fecha && servicioId && (
        <div className="booking-slots">
          {cargandoSlots && <p className="booking-hint">Buscando horarios…</p>}
          {!cargandoSlots && slots.length === 0 && <p className="booking-hint">Sin horarios disponibles ese día.</p>}
          {!cargandoSlots &&
            slots.map((s) => (
              <button
                type="button"
                key={s}
                className={s === horaInicio ? 'booking-slot activo' : 'booking-slot'}
                onClick={() => setHoraInicio(s)}
              >
                {s}
              </button>
            ))}
        </div>
      )}

      {horaInicio && (
        <>
          <label className="booking-label">
            Nombre completo
            <input className="booking-input" type="text" required value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
          </label>
          <label className="booking-label">
            Teléfono / WhatsApp
            <input className="booking-input" type="tel" required value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} />
          </label>
          <label className="booking-label">
            Correo (opcional)
            <input className="booking-input" type="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} />
          </label>

          {estado === 'error' && <p className="booking-error">{mensajeError}</p>}

          <button type="submit" className="booking-enviar" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Agendando…' : 'Confirmar cita'}
          </button>
        </>
      )}

      <style>{estilos}</style>
    </form>
  );
}

const estilos = `
  .booking-card { display: flex; flex-direction: column; gap: 1.1rem; }
  .booking-label { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem; color: #9a938c; }
  .booking-input { background: #18171a; border: 1px solid #2a282d; border-radius: 8px; padding: 0.7rem 0.8rem; color: #f2ede7; font-family: inherit; font-size: 0.95rem; color-scheme: dark; }
  .booking-input:focus { outline: 2px solid #a67c52; outline-offset: 1px; }
  .booking-slots { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .booking-slot { padding: 0.55rem 0.9rem; border-radius: 999px; border: 1px solid #2a282d; background: #18171a; color: #9a938c; cursor: pointer; font-size: 0.9rem; }
  .booking-slot.activo { background: #a67c52; color: #17130f; border-color: #a67c52; font-weight: 600; }
  .booking-hint { color: #9a938c; font-size: 0.85rem; margin: 0; }
  .booking-error { color: #e2a49b; background: rgba(138,106,99,0.15); padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.85rem; margin: 0; }
  .booking-enviar { background: #a67c52; color: #17130f; border: none; padding: 0.85rem; border-radius: 999px; font-weight: 600; font-size: 1rem; cursor: pointer; }
  .booking-enviar:disabled { opacity: 0.6; cursor: not-allowed; }
  .booking-confirmacion { align-items: flex-start; color: #a67c52; }
  .booking-confirmacion h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #f2ede7; margin: 0.75rem 0 0; }
  .booking-confirmacion p { color: #f2ede7; font-size: 0.9rem; margin: 0.4rem 0 0; }
  .booking-detalle { color: #9a938c !important; font-size: 0.82rem !important; }
`;