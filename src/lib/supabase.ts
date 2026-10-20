/**
 * Supabase is optional. The UI never pretends live auth works without env vars.
 * Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local to enable it.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    client = null;
    return client;
  }
  client = createClient(url, key);
  return client;
}
