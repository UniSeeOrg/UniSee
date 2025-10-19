import {createClient} from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serverKey = process.env.SUPABASE_SERVICE_KEY!
console.log("Server key:", process.env.SUPABASE_SERVICE_KEY);
export const supabaseServer = createClient(url,serverKey);
