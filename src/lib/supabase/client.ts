import {createClient} from '@supabase/supabase-js'

let url: string = process.env.DB_URL!
let key: string = process.env.DB_KEY!
export let supabase = createClient(url,key)
