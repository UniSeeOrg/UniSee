import {createClient} from '@supabase/supabase-js'

let url: string = process.env.SUPABASE_URL!
let publicKey: string = process.env.PUBLIC_KEY!
let serverKey : string = process.env.PRIVATE_KEY!
export let supabaseClient = createClient(url,publicKey)
export let supabaseServer = createClient(url,serverKey)
