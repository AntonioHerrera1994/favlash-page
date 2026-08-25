import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

// GET /api/bloqueos — listar bloqueos (protegido)
export const GET: APIRoute = async ({ url }) => {
  const desde = url.searchParams.get('desde');

  let query = supabaseAdmin
    .from('bloqueos')
    .select('id, fecha, hora_inicio, hora_fin, motivo')
    .order('fecha', { ascending: true });

  if (desde) query = query.gte('fecha', desde);

  const { data, error } = await query;
  if (error) return json({ error: error.message }, 500);
  return json({ bloqueos: data });
};

// POST /api/bloqueos — crear bloqueo (protegido)
// body: { fecha, hora_inicio?, hora_fin?, motivo? } — sin horas = bloquea el día completo
export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const { fecha, hora_inicio, hora_fin, motivo } = body ?? {};

  if (!fecha) return json({ error: 'Falta la fecha' }, 400);

  // Si mandan una hora, deben mandar ambas
  if ((hora_inicio && !hora_fin) || (!hora_inicio && hora_fin)) {
    return json({ error: 'Si defines un rango de horas, indica inicio y fin' }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('bloqueos')
    .insert({
      fecha,
      hora_inicio: hora_inicio || null,
      hora_fin: hora_fin || null,
      motivo: motivo || null,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ bloqueo: data }, 201);
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}