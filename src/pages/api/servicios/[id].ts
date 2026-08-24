import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

// PATCH /api/servicios/:id — editar (protegido)
export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const campos: Record<string, unknown> = {};
  for (const key of ['nombre', 'categoria', 'duracion_minutos', 'precio', 'activo']) {
    if (body[key] !== undefined) campos[key] = body[key];
  }

  if (Object.keys(campos).length === 0) {
    return json({ error: 'Nada que actualizar' }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('servicios')
    .update(campos)
    .eq('id', id)
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ servicio: data });
};

// DELETE /api/servicios/:id — "eliminar" = desactivar (soft delete, protege el historial de citas)
export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from('servicios')
    .update({ activo: false })
    .eq('id', id)
    .select('id')
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ desactivado: data });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}