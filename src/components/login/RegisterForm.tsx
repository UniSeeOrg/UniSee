"use client"
import {useState} from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastContainer";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, emailEnter] = useState<string>("");
  const [password, passwordEnter] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>)
  {
    e.preventDefault();
    const {data: authData, error: error} = await supabaseClient.auth.signUp({email, password});
    if(error) {
      showError(error.message);
      return;
    }
    if(!authData.user) {
      showError("Sign-up failed. Please try again.");
      return;
    }

    try 
    {
      await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          auth_id: authData.user.id, 
          email,
          major: major.trim() || undefined,
        }),
      });
      console.log("User row created");
      showSuccess("Sign-up complete! Please check your email to confirm your account.");
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    } 
    catch (err: unknown) 
    {
      console.error("Failed to insert user row:", err);
      showError("Sign-up succeeded, but failed to create user profile.");
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
        <div>
          <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
            Major (Optional)
          </label>
          <input
            id="major"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
            type="text"
            placeholder="e.g., Computer Science, Business, Psychology..."
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Your major will be used to help filter reviews. You can change this later in your account settings.
          </p>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
}
