import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only initialise the client when real credentials are present.
// Placeholder values from .env will skip creation so the app loads fine
// before Supabase is configured.
const isConfigured =
  url && key &&
  url !== 'your_supabase_url_here' &&
  key !== 'your_supabase_anon_key_here'

export const supabase = isConfigured ? createClient(url, key) : null
