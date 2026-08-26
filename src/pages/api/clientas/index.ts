import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

type ResumenClienta = {
  total: number;
  ultimaVisita: string | null;
  conteoServicios: Record<string, number>;
};

// GET /api/clientas — listado con resumen de su historial (protegido)
export const GET: APIRoute = async () => {
  const { data: clientas, error: clientasErr } = await supabaseAdmin
    .from('clientas')
    .select('id, nombre, telefono, email, notas');

  if (clientasErr) return json({ error: clientasErr.message }, 500);

  const { data: citas, error: citasErr } = await supabaseAdmin
    .from('citas')
    .select('clienta_id, fecha, estado, servicio:servicios(nombre)')
    .neq('estado', 'cancelada');

  if (citasErr) return json({ error: citasErr.message }, 500);

  const resumenPorClienta = new Map<string, ResumenClienta>();

  for (const c of citas ?? []) {
    const actual: ResumenClienta = resumenPorClienta.get(c.clienta_id) ?? {
      total: 0,
      ultimaVisita: null,
      conteoServicios: {},
    };

    actual.total += 1;
    if (!actual.ultimaVisita || c.fecha > actual.ultimaVisita) {
      actual.ultimaVisita = c.fecha;
    }
    const nombreServicio = (c.servicio as any)?.nombre;
    if (nombreServicio) {
      actual.conteoServicios[nombreServicio] = (actual.conteoServicios[nombreServicio] ?? 0) + 1;
    }

    resumenPorClienta.set(c.clienta_id, actual);
  }

  const resultado = (clientas ?? []).map((cl) => {
    const resumen = resumenPorClienta.get(cl.id);
    let servicioFavorito: string | null = null;
    let maxConteo = 0;

    if (resumen) {
      for (const [nombre, conteo] of Object.entries(resumen.conteoServicios)) {
        if (conteo > maxConteo) {
          maxConteo = conteo;
          servicioFavorito = nombre;
        }
      }
    }

    return {
      id: cl.id,
      nombre: cl.nombre,
      telefono: cl.telefono,
      email: cl.email,
      notas: cl.notas,
      totalCitas: resumen?.total ?? 0,
      servicioFavorito,
      ultimaVisita: resumen?.ultimaVisita ?? null,
    };
  });

  resultado.sort((a, b) => b.totalCitas - a.totalCitas);

  return json({ clientas: resultado });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}