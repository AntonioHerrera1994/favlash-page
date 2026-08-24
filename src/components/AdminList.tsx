import { useState } from 'react';
import Modal from './Modal';
import { IconPhone, IconBan, IconCheck, IconClose } from './icons';

type Cita = {
  id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  notas: string | null;
  clienta: { id: string; nombre: string; telefono: string; email: string | null; notas: string | null };
  servicio: { nombre: string };
};

type Props = {
  citas: Cita[];
  onCambio: () => void;
};

const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

function partesFecha(fechaStr: string) {
  const f = new Date(`${fechaStr}T00:00:00`);
  return { dia: f.getDate(), mes: MESES[f.getMonth()], diaSemana: DIAS[f.getDay()] };
}

function etiquetaEstado(c: Cita): { texto: string; color: string; bg: string } {
  const hoy = new Date().toISOString().split('T')[0];
  if (c.estado === 'cancelada') return { texto: 'Cancelada', color: '#c9a89f', bg: 'rgba(138,106,99,0.18)' };
  if (c.estado === 'completada') return { texto: 'Completada', color: '#b3c7a8', bg: 'rgba(124,148,115,0.18)' };
  if (c.estado === 'no_asistio') return { texto: 'No asistió', color: '#c9a89f', bg: 'rgba(138,106,99,0.18)' };
  if (c.fecha === hoy) return { texto: 'Hoy', color: '#a67c52', bg: 'rgba(166,124,82,0.18)' };
  if (c.fecha > hoy) return { texto: 'Próxima', color: '#9a938c', bg: 'rgba(154,147,140,0.14)' };
  return { texto: 'Pasada', color: '#726b65', bg: 'rgba(114,107,101,0.12)' };
}

export default function AdminList({ citas, onCambio }: Props) {
  const [seleccion, setSeleccion] = useState<Cita | null>(null);
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);

  function seleccionar(c: Cita) {
    setSeleccion(c);
    setNotas(c.clienta.notas ?? '');
  }

  async function cancelarCita(id: string) {
    if (!window.confirm('¿Seguro que quieres cancelar esta cita?')) return;
    await fetch(`/api/citas/${id}`, { method: 'DELETE' });
    setSeleccion(null);
    onCambio();
  }

  async function guardarNotas(clientaId: string) {
    setGuardando(true);
    const res = await fetch(`/api/clientas/${clientaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas }),
    });
    setGuardando(false);
    if (!res.ok) return alert('No se pudieron guardar las notas.');
    onCambio();
  }

  const citasOrdenadas = [...citas].sort((a, b) =>
    `${a.fecha}${a.hora_inicio}`.localeCompare(`${b.fecha}${b.hora_inicio}`)
  );

  if (citasOrdenadas.length === 0) {
    return (
      <div className="vacio">
        <p>Todavía no hay citas registradas.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid-tarjetas">
        {citasOrdenadas.map((c) => {
          const { dia, mes, diaSemana } = partesFecha(c.fecha);
          const badge = etiquetaEstado(c);
          return (
            <button key={c.id} className="tarjeta" onClick={() => seleccionar(c)}>
              <div className="tarjeta-fecha">
                <span className="tarjeta-dia">{dia}</span>
                <span className="tarjeta-mes">{mes}</span>
                <span className="tarjeta-diasemana">{diaSemana}</span>
              </div>
              <div className="tarjeta-cuerpo">
                <span className="tarjeta-badge" style={{ color: badge.color, background: badge.bg }}>
                  {badge.texto}
                </span>
                <h3>{c.clienta.nombre}</h3>
                <p className="tarjeta-servicio">{c.servicio.nombre}</p>
                <div className="tarjeta-meta">
                  <span>{c.hora_inicio.slice(0, 5)}–{c.hora_fin.slice(0, 5)}</span>
                  <span className="tarjeta-telefono">
                    <IconPhone size={12} /> {c.clienta.telefono}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {seleccion && (
        <Modal onClose={() => setSeleccion(null)} width="440px">
          <div className="detalle-header">
            <div>
              <h2>{seleccion.clienta.nombre}</h2>
              <p className="detalle-sub">
                {seleccion.fecha} · {seleccion.hora_inicio.slice(0, 5)}–{seleccion.hora_fin.slice(0, 5)} ·{' '}
                {seleccion.servicio.nombre}
              </p>
            </div>
            <button className="icon-btn" onClick={() => setSeleccion(null)}>
              <IconClose />
            </button>
          </div>

          <p className="detalle-contacto">
            <IconPhone /> {seleccion.clienta.telefono}
          </p>

          <label className="campo-label">
            Notas de la clienta
            <textarea
              className="textarea-oscuro"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Alergias, preferencias, historial…"
            />
          </label>
          <button className="btn-secundario" onClick={() => guardarNotas(seleccion.clienta.id)} disabled={guardando}>
            <IconCheck size={14} /> {guardando ? 'Guardando…' : 'Guardar notas'}
          </button>

          {seleccion.estado === 'confirmada' && (
            <button className="btn-peligro" onClick={() => cancelarCita(seleccion.id)}>
              <IconBan size={14} /> Cancelar cita
            </button>
          )}
        </Modal>
      )}
    </>
  );
}