"use client"
import { createUser } from "@/lib/api/users";
import {useState} from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const [email, emailEnter] = useState<string>("");
  const [password, passwordEnter] = useState<string>(""); 
  async function submit(e: any)
  {
    e.preventDefault();
    const {data: authData, error: error} = await supabaseClient.auth.signUp({email, password});
    if(error) alert(error.message);
    if(!authData.user) return; 

    try 
    {
      const userRow = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth_id: authData.user.id, email }),
      });
      const res = await userRow.json();
      console.log("User row created");
      alert("Sign-up complete!");
    } 
    catch (err: any) 
    {
      console.error("Failed to insert user row:", err);
      alert("Sign-up succeeded, but failed to create DB row.");
    }
    console.log(email,password);
  }

  return (
    <div className = "">
        <form className ="flex flex-col items-center justify-center"onSubmit={submit}>
        <input className= "bg-black/10 rounded-md m-2 w-full p-4" type="text" placeholder="enter your email" value={email} onChange={(e)=> emailEnter(e.target.value)}></input>
        <input className= "bg-black/10 rounded-md m-2 w-full p-4" type="text" placeholder="enter your password" value={password} onChange={(e)=> passwordEnter(e.target.value)}></input>
        <button className = "bg-blue-500 p-2 rounded-md w-1/2" type="submit">submit</button>
        </form>
    </div>
  );
}
