import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";

export const prender = false;

export const POST: APIRoute = async ({ request}) =>{
    let body: any;
    try{
        body = await request.json();
    } catch {
        return json ({ error: 'JSON inválido' }, 400);
    }
    
    const {nombre, telefono, email, servicio_id, fecha, hora_inicio, notas } = body ?? {};
    if (!nombre || !telefono || !servicio_id || !fecha || !hora_inicio){
        return json({ error: 'Faltan campos requeridos'}, 400);
    }

    // Traer duración del servicio para calcular hora_fin

    const { data: servicio, error:servicioErr } = await supabaseAdmin
        .from('servicios')
        .select('duracion_minutos, activo')
        .eq('id', servicio_id)
        .single();
    
        if (servicioErr || !servicio || !servicio.activo) {
            return json ({error: 'Servicio inválido' }, 400);
        }

        const horaFin = sumarMinutos(hora_inicio, servicio.duracion_minutos);

        // Upsert de clienta por teléfono

        const { data: clienta, error:clientaErr } = await supabaseAdmin
        .from ('clientas')
        .upsert({ nombre, telefono, email: email || null}, { onConflict: 'telefono'})
        .select('id')
        .single();

        if (clientaErr || !clienta) {
            return json ({ error: clientaErr?.message ?? 'No se pudo registrar la clienta'}, 500);
        }

        //Doble-chequeo de conflicto nivel app
        const { data: conflictos } = await supabaseAdmin
        .from('citas')
        .select('id, hora_inicio, hora_fin')
        .eq('fecha', fecha)
        .eq('estado', 'confirmada');

        const hayTraslape = (conflictos ?? []).some((c) => {
            return hora_inicio < c.hora_fin && horaFin > c.hora_inicio;
        });

        if (hayTraslape) {
            return json ({ error: 'Ese horario ya no está disponible, elige otro.'}, 409);
        }


        // Crear la cita
        const { data: cita, error:citaErr } = await supabaseAdmin
        .from ('citas')
        .insert({
            clienta_id: clienta.id,
            servicio_id,
            fecha,
            hora_inicio,
            hora_fin: horaFin,
            notas: notas || null,
        })
        .select('id, fecha, hora_inicio, hora_fin')
        .single();

        if(citaErr) {
            if ((citaErr as any).code === '23P01') {
                return json ({ error: 'Ese horario acaba de ocuparse, elige otro.'}, 409);
            }
            return json({ error: citaErr.message}, 500);
        }
        return json ({cita},201);
};
 // GET /api/citas — listar todas las citas (protegido por el middleware)
export const GET: APIRoute = async () => {
  const { data, error } = await supabaseAdmin
    .from('citas')
    .select(
      `id, fecha, hora_inicio, hora_fin, estado, notas,
       clienta:clientas ( id, nombre, telefono, email, notas ),
       servicio:servicios ( id, nombre, categoria, precio )`
    )
    .order('fecha', { ascending: true })
    .order('hora_inicio', { ascending: true });

  if (error) return json({ error: error.message }, 500);
  return json({ citas: data });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function sumarMinutos(hora: string, minutos: number): string {
  const [h, m] = hora.split(':').map(Number);
  const total = h * 60 + m + minutos;
  const hh = Math.floor(total / 60).toString().padStart(2, '0');
  const mm = (total % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}