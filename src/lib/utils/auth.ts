import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Get the authenticated user from the request
 * Extracts the auth token from Authorization header or cookies and verifies it with Supabase
 * 
 * @param req - Next.js request object
 * @returns User object if authenticated, null otherwise
 */
export async function getAuthenticatedUser(req: NextRequest) {
  try {
    // Method 1: Try to get token from Authorization header (preferred method)
    const authHeader = req.headers.get("authorization");
    let accessToken: string | null = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7);
    } else {
      // Method 2: Fallback to cookies if Authorization header is not present
      // Extract session from Supabase cookie format
      // Supabase stores: sb-<project-ref>-auth-token with JSON containing access_token
      const cookieHeader = req.headers.get("cookie") || "";
      const projectRef = supabaseUrl.split("//")[1]?.split(".")[0];
      
      if (projectRef) {
        // Try the standard Supabase cookie name
        const authCookieName = `sb-${projectRef}-auth-token`;
        const authCookieMatch = cookieHeader.match(new RegExp(`${authCookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]+)`));
        
        if (authCookieMatch) {
          try {
            const cookieValue = decodeURIComponent(authCookieMatch[1]);
            const sessionData = JSON.parse(cookieValue);
            accessToken = sessionData?.access_token || null;
          } catch (e) {
            // Cookie parsing failed, try alternative cookie names
            console.error("Failed to parse auth cookie:", e);
          }
        }
        
        // If still no token, try to find any cookie with "auth" in the name
        if (!accessToken) {
          const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            if (key && value) {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, string>);
          
          for (const [key, value] of Object.entries(cookies)) {
            if (key.includes("auth") || key.includes("sb-")) {
              try {
                const decoded = decodeURIComponent(value);
                const parsed = JSON.parse(decoded);
                accessToken = parsed?.access_token || parsed?.accessToken || null;
                if (accessToken) break;
              } catch {
                // Not JSON, skip
              }
            }
          }
        }
      }
    }
    
    // If we have an access token, verify it with Supabase
    if (accessToken) {
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      
      const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);
      
      if (!error && user) {
        return user;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
}

/**
 * Middleware to require authentication for API routes
 * Throws an error if user is not authenticated
 * 
 * @param req - Next.js request object
 * @returns User object
 * @throws Error if user is not authenticated
 */
export async function requireAuth(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  
  return user;
}

