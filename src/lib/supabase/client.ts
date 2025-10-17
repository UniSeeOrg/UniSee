import {createClient} from '@supabase/supabase-js'

let url = process.env.NEXT_PUBLIC_SUPABASE_URL!
let publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export let supabaseClient = createClient(url,publicKey)
