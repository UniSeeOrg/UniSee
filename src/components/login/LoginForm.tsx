"use client"
import {useState} from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, emailEnter] = useState<string>("");
  const [password, passwordEnter] = useState<string>(""); 

  async function submit(e: React.FormEvent<HTMLFormElement>)
  {
    e.preventDefault();
    const {data, error} = await supabaseClient.auth.signInWithPassword({email, password});
    if(error) alert(error.message);
    if (data.user) 
    {
      console.log("Login successful!", data.user);
      alert(`Welcome, ${data.user.email}`);
    } 
    else 
    {
      console.log("No user returned, login failed unexpectedly", data);
    }
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
