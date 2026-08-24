import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const servicioId = url.searchParams.get('servicio_id');
  const fecha = url.searchParams.get('fecha'); // formato YYYY-MM-DD

  if (!servicioId || !fecha) {
    return json({ error: 'Faltan parámetros servicio_id y fecha' }, 400);
  }

  const fechaObj = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(fechaObj.getTime())) {
    return json({ error: 'Fecha inválida' }, 400);
  }
  const diaSemana = fechaObj.getDay(); // 0=domingo, coincide con tu tabla horario_laboral

// 1. Servicio (para saber la duración)
  const { data: servicio, error: servicioErr } = await supabaseAdmin
    .from('servicios')
    .select('id, duracion_minutos, activo')
    .eq('id', servicioId)
    .single();

  if (servicioErr || !servicio || !servicio.activo) {
    return json({ error: 'Servicio no encontrado' }, 404);
  }

  // 2. Horario laboral de ese día de la semana
  const { data: horarios, error: horarioErr } = await supabaseAdmin
    .from('horario_laboral')
    .select('hora_inicio, hora_fin')
    .eq('dia_semana', diaSemana)
    .eq('activo', true);

  if (horarioErr) return json({ error: horarioErr.message }, 500);
  if (!horarios || horarios.length === 0) {
    return json({ slots: [] }); // día sin horario laboral (ej. domingo si no trabajas)
  }

  // 3. Bloqueos puntuales de ese día (vacaciones, día festivo, etc.)
  const { data: bloqueos } = await supabaseAdmin
    .from('bloqueos')
    .select('hora_inicio, hora_fin')
    .eq('fecha', fecha);

  const diaBloqueadoCompleto = bloqueos?.some((b) => !b.hora_inicio && !b.hora_fin);
  if (diaBloqueadoCompleto) {
    return json({ slots: [] });
  }

  // 4. Citas ya confirmadas ese día
  const { data: citas, error: citasErr } = await supabaseAdmin
    .from('citas')
    .select('hora_inicio, hora_fin')
    .eq('fecha', fecha)
    .eq('estado', 'confirmada');

  if (citasErr) return json({ error: citasErr.message }, 500);

  const ocupados = [
    ...(citas ?? []).map((c) => ({ inicio: c.hora_inicio, fin: c.hora_fin })),
    ...(bloqueos ?? [])
      .filter((b) => b.hora_inicio && b.hora_fin)
      .map((b) => ({ inicio: b.hora_inicio, fin: b.hora_fin })),
  ];

  const duracion = servicio.duracion_minutos;
  const slots: string[] = [];
  const hoy = new Date();
  const esHoy = fechaObj.toDateString() === hoy.toDateString();

  for (const ventana of horarios) {
    let cursor = toMinutes(ventana.hora_inicio);
    const finVentana = toMinutes(ventana.hora_fin);

    while (cursor + duracion <= finVentana) {
      const inicioMin = cursor;
      const finMin = cursor + duracion;

      const seTraslapa = ocupados.some((o) => {
        const oInicio = toMinutes(o.inicio);
        const oFin = toMinutes(o.fin);
        return inicioMin < oFin && finMin > oInicio;
      });

      const horaStr = minutesToTime(inicioMin);
      const esPasado = esHoy && inicioMin <= hoy.getHours() * 60 + hoy.getMinutes();

      if (!seTraslapa && !esPasado) {
        slots.push(horaStr);
      }
      cursor += 15;
    }
  }

  return json({ slots, duracion_minutos: duracion });
};

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}