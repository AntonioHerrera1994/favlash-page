import type { APIRoute } from 'astro';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');

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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect('/admin/login?error=1');
  }

  return redirect('/admin');
};