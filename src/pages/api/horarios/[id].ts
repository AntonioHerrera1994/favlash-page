import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

// PATCH /api/horarios/:id — editar horas o activar/desactivar (protegido)
export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const campos: Record<string, unknown> = {};
  for (const key of ['hora_inicio', 'hora_fin', 'activo']) {
    if (body[key] !== undefined) campos[key] = body[key];
  }

  if (Object.keys(campos).length === 0) {
    return json({ error: 'Nada que actualizar' }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('horario_laboral')
    .update(campos)
    .eq('id', id)
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ horario: data });
};

// DELETE /api/horarios/:id — quitar una ventana de horario (protegido)
export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  const { error } = await supabaseAdmin.from('horario_laboral').delete().eq('id', id);

  if (error) return json({ error: error.message }, 500);
  return json({ eliminado: true });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}