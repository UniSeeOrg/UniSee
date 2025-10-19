import {createClient} from '@supabase/supabase-js'

const url: string = process.env.SUPABASE_URL!
const publicKey: string = process.env.PUBLIC_KEY!
const serverKey : string = process.env.PRIVATE_KEY!
export const supabaseClient = createClient(url,publicKey)
export const supabaseServer = createClient(url,serverKey)
