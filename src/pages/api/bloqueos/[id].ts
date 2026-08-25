import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";

export const prerender = false;

// DELETE /api/bloqueos/:id — quitar un bloqueo (protegido)
export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  const { error } = await supabaseAdmin.from('bloqueos').delete().eq('id', id);

  if (error) return json({ error: error.message }, 500);
  return json({ eliminado: true });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}