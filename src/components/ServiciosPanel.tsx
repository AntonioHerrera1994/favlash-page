import { useEffect, useState } from 'react';
import Modal from './Modal';
import { IconPlus, IconBan, IconCheck } from './icons';

type Servicio = {
  id: string;
  nombre: string;
  categoria: string;
  duracion_minutos: number;
  precio: number | null;
  activo: boolean;
};

const CATEGORIAS_SUGERIDAS = ['pestañas', 'cejas', 'maquillaje', 'manicura'];

export default function ServiciosPanel() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<Servicio | 'nuevo' | null>(null);

  function cargarServicios() {
    setCargando(true);
    fetch('/api/servicios?incluir_inactivos=1')
      .then((r) => r.json())
      .then((data) => setServicios(data.servicios ?? []))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarServicios();
  }, []);

  async function alternarActivo(s: Servicio) {
    await fetch(`/api/servicios/${s.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !s.activo }),
    });
    cargarServicios();
  }

  const grupos = servicios.reduce<Record<string, Servicio[]>>((acc, s) => {
    (acc[s.categoria] ??= []).push(s);
    return acc;
  }, {});

  if (cargando) return <p className="hint-oscuro">Cargando servicios…</p>;

  return (
    <>
      <button className="btn-crear btn-crear-secundario" onClick={() => setEditando('nuevo')}>
        <IconPlus size={15} /> Nuevo servicio
      </button>

      {Object.keys(grupos).length === 0 && (
        <div className="vacio">
          <p>Todavía no hay servicios registrados.</p>
        </div>
      )}

      {Object.entries(grupos).map(([categoria, lista]) => (
        <div className="servicio-grupo" key={categoria}>
          <h3 className="servicio-grupo-titulo">{categoria}</h3>
          <div className="servicio-lista">
            {lista.map((s) => (
              <div className={s.activo ? 'servicio-row' : 'servicio-row inactivo'} key={s.id}>
                <div className="servicio-info">
                  <span className="servicio-nombre">{s.nombre}</span>
                  <span className="servicio-meta">
                    {s.duracion_minutos} min {s.precio ? `· $${s.precio}` : ''}
                  </span>
                </div>
                <div className="servicio-acciones">
                  <button className="icon-btn" onClick={() => setEditando(s)} title="Editar">
                    Editar
                  </button>
                  <button className="icon-btn" onClick={() => alternarActivo(s)} title={s.activo ? 'Desactivar' : 'Reactivar'}>
                    {s.activo ? <IconBan size={14} /> : <IconCheck size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {editando && (
        <ServicioForm
          servicio={editando === 'nuevo' ? null : editando}
          onGuardado={() => {
            setEditando(null);
            cargarServicios();
          }}
          onCerrar={() => setEditando(null)}
        />
      )}
    </>
  );
}

function ServicioForm({
  servicio,
  onGuardado,
  onCerrar,
}: {
  servicio: Servicio | null;
  onGuardado: () => void;
  onCerrar: () => void;
}) {
  const [nombre, setNombre] = useState(servicio?.nombre ?? '');
  const [categoria, setCategoria] = useState(servicio?.categoria ?? '');
  const [duracion, setDuracion] = useState(servicio?.duracion_minutos?.toString() ?? '');
  const [precio, setPrecio] = useState(servicio?.precio?.toString() ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError('');

    const body = {
      nombre,
      categoria,
      duracion_minutos: Number(duracion),
      precio: precio ? Number(precio) : null,
    };

    const res = servicio
      ? await fetch(`/api/servicios/${servicio.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      : await fetch('/api/servicios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

    setGuardando(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'No se pudo guardar el servicio.');
      return;
    }
    onGuardado();
  }

  return (
    <Modal onClose={onCerrar} width="380px">
      <h2 className="modal-titulo">{servicio ? 'Editar servicio' : 'Nuevo servicio'}</h2>
      <form className="form-oscuro" onSubmit={enviar}>
        <label className="campo-label">
          Nombre
          <input className="input-oscuro" type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>

        <label className="campo-label">
          Categoría
          <input
            className="input-oscuro"
            type="text"
            required
            list="categorias-sugeridas"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <datalist id="categorias-sugeridas">
            {CATEGORIAS_SUGERIDAS.map((c) => (
              <option value={c} key={c} />
            ))}
          </datalist>
        </label>

        <label className="campo-label">
          Duración (minutos)
          <input className="input-oscuro" type="number" min={5} step={5} required value={duracion} onChange={(e) => setDuracion(e.target.value)} />
        </label>

        <label className="campo-label">
          Precio (opcional)
          <input className="input-oscuro" type="number" min={0} step={1} value={precio} onChange={(e) => setPrecio(e.target.value)} />
        </label>

        {error && <p className="error-oscuro">{error}</p>}

        <button className="btn-primario" type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : servicio ? 'Guardar cambios' : 'Crear servicio'}
        </button>
      </form>
    </Modal>
  );
}