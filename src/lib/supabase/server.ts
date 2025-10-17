import {createClient} from '@supabase/supabase-js'

let url = process.env.NEXT_PUBLIC_SUPABASE_URL!
let serverKey = process.env.SUPABASE_SERVICE_KEY!
console.log("Server key:", process.env.SUPABASE_SERVICE_KEY);
export let supabaseServer = createClient(url,serverKey);
