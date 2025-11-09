"use client"
import {useState} from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastContainer";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, emailEnter] = useState<string>("");
  const [password, passwordEnter] = useState<string>(""); 
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>)
  {
    e.preventDefault();
    const {data, error} = await supabaseClient.auth.signInWithPassword({email, password});
    if(error) {
      showError(error.message);
      return;
    }
    if (data.user) 
    {
      console.log("Login successful!", data.user);
      showSuccess(`Welcome, ${data.user.email}!`);
      router.push("/account");
    } 
    else 
    {
      console.log("No user returned, login failed unexpectedly", data);
      showError("Login failed unexpectedly. Please try again.");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => emailEnter(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => passwordEnter(e.target.value)}
            required
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
