import { useEffect, useState } from 'react';
import { IconPlus, IconClose } from './icons';

type Horario = {
  id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
};

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function HorariosPanel() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [formularioDia, setFormularioDia] = useState<number | null>(null);
  const [horaInicio, setHoraInicio] = useState('10:00');
  const [horaFin, setHoraFin] = useState('19:00');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cargarHorarios() {
    setCargando(true);
    fetch('/api/horarios')
      .then((r) => r.json())
      .then((data) => setHorarios(data.horarios ?? []))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarHorarios();
  }, []);

  async function agregarVentana(dia: number) {
    setGuardando(true);
    setError('');
    const res = await fetch('/api/horarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dia_semana: dia, hora_inicio: horaInicio, hora_fin: horaFin }),
    });
    const data = await res.json();
    setGuardando(false);

    if (!res.ok) {
      setError(data.error ?? 'No se pudo guardar.');
      return;
    }
    setFormularioDia(null);
    cargarHorarios();
  }

  async function alternarActivo(h: Horario) {
    await fetch(`/api/horarios/${h.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !h.activo }),
    });
    cargarHorarios();
  }

  async function eliminarVentana(id: string) {
    if (!window.confirm('¿Quitar este horario?')) return;
    await fetch(`/api/horarios/${id}`, { method: 'DELETE' });
    cargarHorarios();
  }

  if (cargando) return <p className="hint-oscuro">Cargando horario…</p>;

  return (
    <div className="horarios-lista">
      {DIAS.map((nombreDia, dia) => {
        const ventanas = horarios.filter((h) => h.dia_semana === dia);
        return (
          <div className="horario-dia" key={dia}>
            <div className="horario-dia-header">
              <span className="horario-dia-nombre">{nombreDia}</span>
              <button className="icon-btn" onClick={() => setFormularioDia(dia)} aria-label={`Agregar horario a ${nombreDia}`}>
                <IconPlus size={15} />
              </button>
            </div>

            {ventanas.length === 0 ? (
              <p className="horario-vacio">Sin horario — día cerrado</p>
            ) : (
              <div className="horario-chips">
                {ventanas.map((h) => (
                  <div className={h.activo ? 'horario-chip' : 'horario-chip inactivo'} key={h.id}>
                    <button className="horario-chip-toggle" onClick={() => alternarActivo(h)}>
                      {h.hora_inicio.slice(0, 5)}–{h.hora_fin.slice(0, 5)}
                    </button>
                    <button className="horario-chip-quitar" onClick={() => eliminarVentana(h.id)} aria-label="Quitar">
                      <IconClose size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formularioDia === dia && (
              <div className="horario-form-inline">
                <input className="input-oscuro" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                <span className="horario-form-guion">–</span>
                <input className="input-oscuro" type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
                <button className="btn-secundario" onClick={() => agregarVentana(dia)} disabled={guardando}>
                  {guardando ? 'Guardando…' : 'Agregar'}
                </button>
                <button className="icon-btn" onClick={() => setFormularioDia(null)} aria-label="Cancelar">
                  <IconClose size={14} />
                </button>
              </div>
            )}
          </div>
        );
      })}
      {error && <p className="error-oscuro">{error}</p>}
    </div>
  );
}