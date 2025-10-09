import { supabaseClient } from "@/lib/supabase/client";
import { supabaseServer } from "@/lib/supabase/client";

export async function getUser(username: string)
{
  const {data, error} = await supabaseClient.from("User").select("*").eq("name",username).single();
  if (error) throw error ;
  return data ;
}
export async function getAllUsers()
{
  const {data, error} = await supabaseClient.from("User").select("*").order("id", {ascending: true});
  if (error) throw error;
  return data;
}
export async function createUser(user: any)
{
  const {data, error } = await supabaseServer.from("User").insert([user]).single();
  if (error) throw error;
  return data;
}
