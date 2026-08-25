import { useState } from 'react';
import Modal from './Modal';

type Props = {
  onCreado: () => void;
  onCerrar: () => void;
};

export default function BloqueoForm({ onCreado, onCerrar }: Props) {
  const [fecha, setFecha] = useState('');
  const [diaCompleto, setDiaCompleto] = useState(true);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError('');

    const body: Record<string, unknown> = { fecha, motivo: motivo || undefined };
    if (!diaCompleto) {
      body.hora_inicio = horaInicio;
      body.hora_fin = horaFin;
    }

    const res = await fetch('/api/bloqueos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setEnviando(false);

    if (!res.ok) {
      setError(data.error ?? 'No se pudo crear el bloqueo.');
      return;
    }
    onCreado();
  }

  const minFecha = new Date().toISOString().split('T')[0];

  return (
    <Modal onClose={onCerrar} width="380px">
      <h2 className="modal-titulo">Bloquear día u horario</h2>
      <form className="form-oscuro" onSubmit={enviar}>
        <label className="campo-label">
          Fecha
          <input className="input-oscuro" type="date" min={minFecha} required value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>

        <label className="campo-check">
          <input type="checkbox" checked={diaCompleto} onChange={(e) => setDiaCompleto(e.target.checked)} />
          Bloquear el día completo
        </label>

        {!diaCompleto && (
          <div className="campo-fila">
            <label className="campo-label">
              Desde
              <input className="input-oscuro" type="time" required={!diaCompleto} value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </label>
            <label className="campo-label">
              Hasta
              <input className="input-oscuro" type="time" required={!diaCompleto} value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
            </label>
          </div>
        )}

        <label className="campo-label">
          Motivo (opcional)
          <input className="input-oscuro" type="text" placeholder="Vacaciones, cita médica…" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </label>

        {error && <p className="error-oscuro">{error}</p>}

        <button className="btn-primario" type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Bloquear'}
        </button>
      </form>
    </Modal>
  );
}