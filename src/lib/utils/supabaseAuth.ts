import { supabaseClient } from "@/lib/supabase/client";

/**
 * Safely get the current user, handling invalid refresh tokens gracefully
 * This prevents console errors when there's no valid session
 */
export async function getCurrentUser() {
  try {
    // First try to get the session (doesn't refresh tokens)
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    
    // If no session, return null
    if (!session || sessionError) {
      // If there's an error with the session, clear it
      if (sessionError) {
        await supabaseClient.auth.signOut();
      }
      return null;
    }
    
    // If we have a session, try to get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    // If there's an error getting the user (like invalid refresh token), clear the session
    if (userError) {
      if (userError.message?.includes("Refresh Token") || userError.message?.includes("JWT")) {
        await supabaseClient.auth.signOut();
      }
      return null;
    }
    
    return user;
  } catch {
    // Silently handle any errors - user is not authenticated
    // Clear any invalid session data
    try {
      await supabaseClient.auth.signOut();
    } catch {
      // Ignore errors from signOut
    }
    return null;
  }
}

/**
 * Safely get the current session token
 * Returns null if no valid session exists
 */
export async function getSessionToken(): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error || !session) {
      if (error) {
        await supabaseClient.auth.signOut();
      }
      return null;
    }
    
    return session.access_token;
  } catch {
    return null;
  }
}

