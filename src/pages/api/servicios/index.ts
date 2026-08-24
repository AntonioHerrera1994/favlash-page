import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

// GET /api/servicios — catálogo público (solo activos)
// GET /api/servicios?incluir_inactivos=1 — para el panel admin (todos)
export const GET: APIRoute = async ({ url }) => {
  const incluirInactivos = url.searchParams.get('incluir_inactivos') === '1';

  let query = supabaseAdmin
    .from('servicios')
    .select('id, nombre, categoria, duracion_minutos, precio, activo');

  if (!incluirInactivos) {
    query = query.eq('activo', true);
  }

  const { data, error } = await query.order('categoria').order('nombre');

  if (error) return json({ error: error.message }, 500);
  return json({ servicios: data });
};

// POST /api/servicios — crear servicio (protegido en el middleware)
export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const { nombre, categoria, duracion_minutos, precio, activo } = body ?? {};

  if (!nombre || !categoria || !duracion_minutos) {
    return json({ error: 'Faltan campos requeridos' }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('servicios')
    .insert({
      nombre,
      categoria,
      duracion_minutos,
      precio: precio ?? null,
      activo: activo ?? true,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ servicio: data }, 201);
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}