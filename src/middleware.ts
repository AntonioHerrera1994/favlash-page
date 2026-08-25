import { defineMiddleware } from 'astro:middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies, redirect, url } = context;

  const isAdminRoute = url.pathname.startsWith('/admin');
  const isLoginRoute = url.pathname === '/admin/login';
const esOperacionSensibleDeCitas =
  (url.pathname.startsWith('/api/citas') && request.method !== 'POST') ||
  url.pathname.startsWith('/api/clientas') || 
    (url.pathname.startsWith('/api/servicios') && request.method !== 'GET') ||
      url.pathname.startsWith('/api/bloqueos');

  if (!isAdminRoute && !esOperacionSensibleDeCitas) {
    return next();
  }

  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, { ...options, path: '/' })
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (isAdminRoute && !isLoginRoute && !session) {
    return redirect('/admin/login');
  }

  if (esOperacionSensibleDeCitas && !session) {
    return new Response(JSON.stringify({ error: 'No autorizada' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return next();
});