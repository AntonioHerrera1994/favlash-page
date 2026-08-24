import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken:false},
});