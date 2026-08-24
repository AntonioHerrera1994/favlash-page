import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AdminList from './AdminList';
import NuevaCitaForm from './NuevaCitaForm';
import { IconList, IconCalendar, IconPlus, IconLogout, IconTag } from './icons';
import './admin-theme.css';
import ServiciosPanel from './ServiciosPanel';

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

export default function AdminDashboard() {
const [vista, setVista] = useState<'lista' | 'calendario' | 'servicios'>('lista');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  function cargarCitas() {
    setCargando(true);
    fetch('/api/citas')
      .then((r) => r.json())
      .then((data) => setCitas(data.citas ?? []))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarCitas();
  }, []);

  const eventos = useMemo(
    () =>
      citas
        .filter((c) => c.estado !== 'cancelada')
        .map((c) => ({
          id: c.id,
          title: `${c.clienta.nombre} — ${c.servicio.nombre}`,
          start: `${c.fecha}T${c.hora_inicio}`,
          end: `${c.fecha}T${c.hora_fin}`,
        })),
    [citas]
  );

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          FavLash <span>Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={vista === 'lista' ? 'sidebar-item activo' : 'sidebar-item'}
            onClick={() => setVista('lista')}
          >
            <IconList /> Lista
          </button>
          <button
            className={vista === 'calendario' ? 'sidebar-item activo' : 'sidebar-item'}
            onClick={() => setVista('calendario')}
          >
            <IconCalendar /> Calendario
          </button>

          <button
  className={vista === 'servicios' ? 'sidebar-item activo' : 'sidebar-item'}
  onClick={() => setVista('servicios')}
>
  <IconTag /> Servicios
</button>
        </nav>

        <form className="sidebar-footer" method="POST" action="/api/auth/logout">
          <button type="submit" className="sidebar-item">
            <IconLogout /> Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="main-area">
        <div className="header-bar">
          <div>
            <h1>Citas</h1>
            <p className="subtitulo">Actuales y próximas</p>
          </div>
          <button className="btn-crear" onClick={() => setMostrarForm(true)}>
            <IconPlus size={15} /> Nueva cita
          </button>
        </div>

       {cargando ? (
  <p className="hint-oscuro">Cargando citas…</p>
) : vista === 'lista' ? (
  <AdminList citas={citas} onCambio={cargarCitas} />
) : vista === 'calendario' ? (
  <div className="calendario-wrap">
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      locale="es"
      firstDay={1}
      height="auto"
      events={eventos}
    />
  </div>
) : (
  <ServiciosPanel />
)}

        {mostrarForm && (
          <NuevaCitaForm
            onCreada={() => {
              setMostrarForm(false);
              cargarCitas();
            }}
            onCerrar={() => setMostrarForm(false)}
          />
        )}
      </main>
    </div>
  );
}