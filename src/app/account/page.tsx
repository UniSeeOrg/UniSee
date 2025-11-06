"use client"
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/utils/supabaseAuth";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  is_verified?: boolean;
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Use the safe utility function that handles errors gracefully
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        setUser(currentUser);
        
        // Fetch user profile from database if logged in
        if (currentUser) {
          try {
            const profileResponse = await supabaseClient
              .from('User')
              .select('*')
              .eq('auth_id', currentUser.id)
              .single();
            
            if (profileResponse.data) {
              setUserProfile(profileResponse.data);
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        }
      } catch (err) {
        // Silently handle any errors
        console.log('Error in getUser:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          alert(error.message);
        } else if (data.user) {
          setUser(data.user);
          // Fetch user profile immediately after login
          try {
            const profileResponse = await supabaseClient
              .from('User')
              .select('*')
              .eq('auth_id', data.user.id)
              .single();
            
            if (profileResponse.data) {
              setUserProfile(profileResponse.data);
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
          alert(`Welcome back, ${data.user.email}!`);
        }
      } else {
        // Sign up
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
          email,
          password,
        });
        if (authError) {
          alert(authError.message);
        } else if (authData.user) {
          // Create user row in database
          try {
            await fetch("/api/users/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ auth_id: authData.user.id, email }),
            });
            alert("Sign-up complete! Please check your email to confirm your account.");
          } catch (err) {
            console.error("Failed to create user row:", err);
            alert("Sign-up succeeded, but failed to create user profile.");
          }
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? "Log In" : "Sign Up"}
              </h1>
              <p className="text-gray-600">
                {isLogin ? "Welcome back to UniSee" : "Join UniSee to share your college experience"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {authLoading ? "Loading..." : (isLogin ? "Log In" : "Sign Up")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</h3>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-lg text-gray-900">{user.email}</p>
                  {userProfile?.is_verified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      ✓ edu-verified
                    </span>
                  )}
                  {userProfile && !userProfile.is_verified && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      ⚠ Not verified
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">User ID</h3>
                <p className="mt-1 text-sm text-gray-600 font-mono">{user.id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Created</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
