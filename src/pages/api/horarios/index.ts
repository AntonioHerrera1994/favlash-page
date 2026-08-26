import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

// GET /api/horarios — listar todas las ventanas de horario (protegido)
export const GET: APIRoute = async () => {
  const { data, error } = await supabaseAdmin
    .from('horario_laboral')
    .select('id, dia_semana, hora_inicio, hora_fin, activo')
    .order('dia_semana')
    .order('hora_inicio');

  if (error) return json({ error: error.message }, 500);
  return json({ horarios: data });
};

// POST /api/horarios — agregar una ventana de horario a un día (protegido)
export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const { dia_semana, hora_inicio, hora_fin } = body ?? {};

  if (dia_semana === undefined || !hora_inicio || !hora_fin) {
    return json({ error: 'Faltan campos requeridos' }, 400);
  }
  if (hora_inicio >= hora_fin) {
    return json({ error: 'La hora de inicio debe ser antes que la de fin' }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('horario_laboral')
    .insert({ dia_semana, hora_inicio, hora_fin, activo: true })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ horario: data }, 201);
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}