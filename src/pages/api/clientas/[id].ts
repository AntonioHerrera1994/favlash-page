import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

// PATCH /api/clientas/:id — editar notas (historial, alergias, preferencias)
export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const { notas } = body ?? {};

  const { data, error } = await supabaseAdmin
    .from('clientas')
    .update({ notas: notas ?? null })
    .eq('id', id)
    .select('id, notas')
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ clienta: data });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}