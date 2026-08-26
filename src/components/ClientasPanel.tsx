import { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import { IconPhone, IconCheck } from './icons';

type Clienta = {
  id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  notas: string | null;
  totalCitas: number;
  servicioFavorito: string | null;
  ultimaVisita: string | null;
};

export default function ClientasPanel() {
  const [clientas, setClientas] = useState<Clienta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [seleccion, setSeleccion] = useState<Clienta | null>(null);
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cargarClientas() {
    setCargando(true);
    fetch('/api/clientas')
      .then((r) => r.json())
      .then((data) => setClientas(data.clientas ?? []))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarClientas();
  }, []);

  function seleccionar(c: Clienta) {
    setSeleccion(c);
    setNotas(c.notas ?? '');
  }

  async function guardarNotas(id: string) {
    setGuardando(true);
    const res = await fetch(`/api/clientas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas }),
    });
    setGuardando(false);
    if (!res.ok) return alert('No se pudieron guardar las notas.');
    setSeleccion(null);
    cargarClientas();
  }

  const clientasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return clientas;
    return clientas.filter(
      (c) => c.nombre.toLowerCase().includes(q) || c.telefono.includes(q)
    );
  }, [clientas, busqueda]);

  if (cargando) return <p className="hint-oscuro">Cargando clientas…</p>;

  return (
    <>
      <input
        className="input-oscuro clientas-buscador"
        placeholder="Buscar por nombre o teléfono…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {clientasFiltradas.length === 0 ? (
        <div className="vacio">
          <p>No hay clientas que coincidan.</p>
        </div>
      ) : (
        <div className="clientas-lista">
          {clientasFiltradas.map((c) => (
            <button key={c.id} className="clienta-row" onClick={() => seleccionar(c)}>
              <div className="clienta-info">
                <span className="clienta-nombre">{c.nombre}</span>
                <span className="clienta-meta">
                  <IconPhone size={12} /> {c.telefono}
                </span>
              </div>
              <div className="clienta-stats">
                {c.servicioFavorito && (
                  <span className="clienta-badge">{c.servicioFavorito}</span>
                )}
                <span className="clienta-total">{c.totalCitas} visitas</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {seleccion && (
        <Modal onClose={() => setSeleccion(null)} width="420px">
          <h2 className="modal-titulo">{seleccion.nombre}</h2>
          <p className="detalle-contacto">
            <IconPhone /> {seleccion.telefono}
          </p>
          {seleccion.email && <p className="detalle-contacto">{seleccion.email}</p>}

          <div className="clienta-resumen">
            <div>
              <span className="clienta-resumen-num">{seleccion.totalCitas}</span>
              <span className="clienta-resumen-label">Visitas</span>
            </div>
            <div>
              <span className="clienta-resumen-num">{seleccion.servicioFavorito ?? '—'}</span>
              <span className="clienta-resumen-label">Servicio favorito</span>
            </div>
            <div>
              <span className="clienta-resumen-num">{seleccion.ultimaVisita ?? '—'}</span>
              <span className="clienta-resumen-label">Última visita</span>
            </div>
          </div>

          <label className="campo-label">
            Notas (alergias, preferencias, historial…)
            <textarea
              className="textarea-oscuro"
              rows={4}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </label>
          <button className="btn-secundario" onClick={() => guardarNotas(seleccion.id)} disabled={guardando}>
            <IconCheck size={14} /> {guardando ? 'Guardando…' : 'Guardar notas'}
          </button>
        </Modal>
      )}
    </>
  );
}