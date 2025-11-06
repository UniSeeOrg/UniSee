import {createClient} from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseClient = createClient(url, publicKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Handle errors gracefully
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Don't throw errors on invalid refresh tokens
    flowType: 'pkce',
  },
  // Global error handler
  global: {
    headers: {
      'x-client-info': 'unisee-web',
    },
  },
})
