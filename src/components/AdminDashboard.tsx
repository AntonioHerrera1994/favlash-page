import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AdminList from './AdminList';
import NuevaCitaForm from './NuevaCitaForm';
import ServiciosPanel from './ServiciosPanel';
import ClientasPanel from './ClientasPanel';
import HorariosPanel from './HorariosPanel';
import CompartirModal from './CompartirModal';

import './admin-theme.css';

import BloqueoForm from './BloqueoForm';
import { IconList, IconCalendar, IconPlus, IconLogout, IconTag, IconLock,IconClose, IconUsers, IconClock, IconShare } from './icons';



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

type Bloqueo = {
  id:string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin:string | null;
  motivo: string | null;
}

export default function AdminDashboard() {
  const [vista, setVista] = useState<'lista' | 'calendario' | 'servicios' | 'clientas' | 'horarios'>('lista');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
  const [mostrarBloqueo, setMostrarBloqueo] = useState(false);  
  const [mostrarCompartir, setMostrarCompartir] = useState(false);


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

const eventos = useMemo(() => {
  const deCitas = citas
    .filter((c) => c.estado !== 'cancelada')
    .map((c) => ({
      id: c.id,
      title: `${c.clienta.nombre} — ${c.servicio.nombre}`,
      start: `${c.fecha}T${c.hora_inicio}`,
      end: `${c.fecha}T${c.hora_fin}`,
    }));

  const deBloqueos = bloqueos.map((b) => ({
    id: `bloqueo-${b.id}`,
    title: b.motivo || 'Bloqueado',
    start: b.hora_inicio ? `${b.fecha}T${b.hora_inicio}` : b.fecha,
    end: b.hora_fin ? `${b.fecha}T${b.hora_fin}` : undefined,
    allDay: !b.hora_inicio,
    display: 'background',
    color: '#8a6a63',
  }));

  return [...deCitas, ...deBloqueos];
}, [citas, bloqueos]);

  function cargarBloqueos() {
  fetch('/api/bloqueos')
    .then((r) => r.json())
    .then((data) => setBloqueos(data.bloqueos ?? []));
}

useEffect(() => {
  cargarCitas();
  cargarBloqueos();
}, []);

async function eliminarBloqueo(id: string) {
  if (!window.confirm('¿Quitar este bloqueo?')) return;
  await fetch(`/api/bloqueos/${id}`, { method: 'DELETE' });
  cargarBloqueos();
}



  const opcionesVista = [
  { valor: 'lista' as const, label: 'Lista', Icono: IconList },
  { valor: 'calendario' as const, label: 'Calendario', Icono: IconCalendar },
  { valor: 'clientas' as const, label: 'Clientas', Icono: IconUsers },
  { valor: 'servicios' as const, label: 'Servicios', Icono: IconTag },
  {valor: 'horarios' as const, label:'Horario', Icono:IconClock},
];

//diccionario de titulos
const TITULOS: Record<typeof vista, { titulo: string; subtitulo: string }> = {
  lista: { titulo: 'Citas', subtitulo: 'Actuales y próximas' },
  calendario: { titulo: 'Calendario', subtitulo: 'Vista semanal de tus citas' },
  clientas: { titulo: 'Clientas', subtitulo: 'Historial y preferencias' },
  servicios: { titulo: 'Servicios', subtitulo: 'Catálogo, precios y duraciones' },
  horarios: { titulo: ' Horario Laboral', subtitulo: 'Días y horas en que se puede agendar'},
};

 return (
  <div className="admin-shell">
    {/* Sidebar — solo visible en escritorio */}
    <aside className="sidebar">
      <div className="sidebar-brand">
        FavLash <span>Admin</span>
      </div>

      <nav className="sidebar-nav">
        {opcionesVista.map(({ valor, label, Icono }) => (
          <button
            key={valor}
            className={vista === valor ? 'sidebar-item activo' : 'sidebar-item'}
            onClick={() => setVista(valor)}
          >
            <Icono /> {label}
          </button>
        ))}
      </nav>

      <form className="sidebar-footer" method="POST" action="/api/auth/logout">
        <button type="submit" className="sidebar-item">
          <IconLogout /> Cerrar sesión
        </button>
      </form>
    </aside>

    {/* Barra superior — solo visible en móvil */}
    <header className="mobile-topbar">
      <div className="sidebar-brand">
        FavLash <span>Admin</span>
      </div>
      <form method="POST" action="/api/auth/logout">
        <button type="submit" className="icon-btn" aria-label="Cerrar sesión">
          <IconLogout size={20} />
        </button>
      </form>
    </header>

    <main className="main-area">
      <div className="header-bar">
        <div>
          <h1>{TITULOS[vista].titulo}</h1>
          <p className="subtitulo">{TITULOS[vista].subtitulo}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {vista === 'calendario' && (
            <button className="btn-crear btn-crear-secundario" onClick={() => setMostrarBloqueo(true)}>
              <IconLock size={15} /> Bloquear
            </button>
          )}
          <button className='btn-crear btn-crear-secundario' onClick={() => setMostrarCompartir(true)}>
          <IconClock size={15} /> Compartir
          </button>
          <button className="btn-crear btn-crear-secundario" onClick={() => setMostrarForm(true)}>
            <IconPlus size={15} /> Nueva cita
          </button>
        </div>
      </div>

      {cargando ? (
        <p className="hint-oscuro">Cargando citas…</p>
      ) : vista === 'lista' ? (
        <AdminList citas={citas} onCambio={cargarCitas} />
      ) : vista === 'calendario' ? (
        <>
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

          {bloqueos.length > 0 && (
            <div className="bloqueos-lista">
              {bloqueos.map((b) => (
                <div className="bloqueo-row" key={b.id}>
                  <div className="bloqueo-info">
                    <span>
                      {b.fecha} {b.hora_inicio ? `· ${b.hora_inicio.slice(0, 5)}–${b.hora_fin?.slice(0, 5)}` : '· Día completo'}
                    </span>
                    {b.motivo && <span className="bloqueo-motivo">{b.motivo}</span>}
                  </div>
                  <button className="icon-btn" onClick={() => eliminarBloqueo(b.id)} aria-label="Quitar bloqueo">
                    <IconClose size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
        </>
        
   ) : vista === 'clientas' ? (
        <ClientasPanel />
   ) : vista === 'horarios' ?(
    <HorariosPanel />
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

      {mostrarBloqueo && (
        <BloqueoForm
          onCreado={() => {
            setMostrarBloqueo(false);
            cargarBloqueos();
          }}
          onCerrar={() => setMostrarBloqueo(false)}
        />
      )}
      {mostrarCompartir && 
      <CompartirModal onCerrar={() =>  setMostrarCompartir(false)}

      />
      }
    </main>

    {/* Barra inferior fija — solo visible en móvil, solo iconos */}
    <nav className="mobile-bottomnav">
      {opcionesVista.map(({ valor, label, Icono }) => (
        <button
          key={valor}
          className={vista === valor ? 'bottomnav-item activo' : 'bottomnav-item'}
          onClick={() => setVista(valor)}
          aria-label={label}
        >
          <Icono size={22} />
        </button>
      ))}
    </nav>
  </div>
);
}