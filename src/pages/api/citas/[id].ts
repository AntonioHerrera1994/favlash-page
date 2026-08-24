import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

// PATCH /api/citas/:id — reagendar, cambiar estado o editar notas
export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const campos: Record<string, unknown> = {};
  for (const key of ['fecha', 'hora_inicio', 'hora_fin', 'estado', 'notas']) {
    if (body[key] !== undefined) campos[key] = body[key];
  }

  if (Object.keys(campos).length === 0) {
    return json({ error: 'Nada que actualizar' }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('citas')
    .update(campos)
    .eq('id', id)
    .select('id, fecha, hora_inicio, hora_fin, estado')
    .single();

  if (error) {
    if ((error as any).code === '23P01') {
      return json({ error: 'Ese horario se traslapa con otra cita confirmada.' }, 409);
    }
    return json({ error: error.message }, 500);
  }

  return json({ cita: data });
};

// DELETE /api/citas/:id — cancela la cita (soft delete: estado = 'cancelada')
export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from('citas')
    .update({ estado: 'cancelada' })
    .eq('id', id)
    .select('id')
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ cancelada: data });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}