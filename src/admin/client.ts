import { createClient } from '@supabase/supabase-js';
import config from './config.json';
// Publishable connection details are public by design. Never add a secret/service-role key.
const url = import.meta.env.VITE_SUPABASE_URL || config.url;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || config.publishableKey;
export const adminClient = url && key ? createClient(url, key, {
  auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'milano-admin-session' },
}) : null;
