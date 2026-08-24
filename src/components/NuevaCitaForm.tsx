import { useEffect, useState } from 'react';
import Modal from './Modal';

type Servicio = { id: string; nombre: string; duracion_minutos: number };

type Props = {
  onCreada: () => void;
  onCerrar: () => void;
};

export default function NuevaCitaForm({ onCreada, onCerrar }: Props) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioId, setServicioId] = useState('');
  const [fecha, setFecha] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

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
    setHoraInicio('');
    fetch(`/api/disponibilidad?servicio_id=${servicioId}&fecha=${fecha}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []));
  }, [servicioId, fecha]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError('');

    const res = await fetch('/api/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ servicio_id: servicioId, fecha, hora_inicio: horaInicio, nombre, telefono }),
    });
    const data = await res.json();
    setEnviando(false);

    if (!res.ok) {
      setError(data.error ?? 'No se pudo crear la cita.');
      return;
    }
    onCreada();
  }

  const minFecha = new Date().toISOString().split('T')[0];

  return (
    <Modal onClose={onCerrar} width="420px">
      <h2 className="modal-titulo">Nueva cita</h2>
      <form className="form-oscuro" onSubmit={enviar}>
        <label className="campo-label">
          Servicio
          <select className="input-oscuro" value={servicioId} onChange={(e) => setServicioId(e.target.value)} required>
            <option value="">Elige un servicio…</option>
            {servicios.map((s) => (
              <option value={s.id} key={s.id}>
                {s.nombre} ({s.duracion_minutos} min)
              </option>
            ))}
          </select>
        </label>

        <label className="campo-label">
          Fecha
          <input
            className="input-oscuro"
            type="date"
            min={minFecha}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            disabled={!servicioId}
          />
        </label>

        {fecha && servicioId && (
          <div className="slots-wrap">
            {slots.length === 0 && <p className="hint-oscuro">Sin horarios disponibles ese día.</p>}
            {slots.map((s) => (
              <button
                type="button"
                key={s}
                className={s === horaInicio ? 'slot-chip activo' : 'slot-chip'}
                onClick={() => setHoraInicio(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {horaInicio && (
          <>
            <label className="campo-label">
              Nombre
              <input className="input-oscuro" type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <label className="campo-label">
              Teléfono
              <input className="input-oscuro" type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </label>

            {error && <p className="error-oscuro">{error}</p>}

            <button className="btn-primario" type="submit" disabled={enviando}>
              {enviando ? 'Creando…' : 'Crear cita'}
            </button>
          </>
        )}
      </form>
    </Modal>
  );
}