import { useEffect, useState } from 'react';

type Servicio = {
  id: string;
  nombre: string;
  categoria: string;
  duracion_minutos: number;
  precio: number | null;
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
      .then((data) => setServicios(data.servicios ?? []));
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
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setCargandoSlots(false));
  }, [servicioId, fecha]);

  const minFecha = new Date().toISOString().split('T')[0];

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado('enviando');
    setMensajeError('');

    const res = await fetch('/api/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        servicio_id: servicioId,
        fecha,
        hora_inicio: horaInicio,
        ...datos,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMensajeError(data.error ?? 'No se pudo agendar la cita.');
      setEstado('error');
      return;
    }
    setEstado('listo');
  }

  if (estado === 'listo') {
    return (
      <div>
        <h3>¡Cita agendada! 🎉</h3>
        <p>Te esperamos el {fecha} a las {horaInicio}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar}>
      <h3>Agenda tu cita</h3>

      <select value={servicioId} onChange={(e) => setServicioId(e.target.value)} required>
        <option value="">Elige un servicio…</option>
        {servicios.map((s) => (
          <option value={s.id} key={s.id}>
            {s.nombre} ({s.duracion_minutos} min)
          </option>
        ))}
      </select>

      <input
        type="date"
        min={minFecha}
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
        disabled={!servicioId}
      />

      {fecha && servicioId && (
        <div>
          {cargandoSlots && <p>Buscando horarios…</p>}
          {!cargandoSlots && slots.length === 0 && <p>Sin horarios disponibles ese día.</p>}
          {!cargandoSlots &&
            slots.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setHoraInicio(s)}
                style={{ fontWeight: s === horaInicio ? 'bold' : 'normal' }}
              >
                {s}
              </button>
            ))}
        </div>
      )}

      {horaInicio && (
        <>
          <input
            type="text"
            placeholder="Nombre completo"
            required
            value={datos.nombre}
            onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Teléfono / WhatsApp"
            required
            value={datos.telefono}
            onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
          />
          <input
            type="email"
            placeholder="Correo (opcional)"
            value={datos.email}
            onChange={(e) => setDatos({ ...datos, email: e.target.value })}
          />

          {estado === 'error' && <p style={{ color: 'red' }}>{mensajeError}</p>}

          <button type="submit" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Agendando…' : 'Confirmar cita'}
          </button>
        </>
      )}
    </form>
  );
}