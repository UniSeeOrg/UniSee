import { NextRequest } from "next/server";

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a database-backed solution
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store: userId -> RateLimitEntry
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit configuration
 */
const RATE_LIMIT_CONFIG = {
  // Maximum number of requests
  maxRequests: 5,
  // Time window in milliseconds (1 hour)
  windowMs: 60 * 60 * 1000,
};

/**
 * Check if a user has exceeded the rate limit
 * 
 * @param userId - User identifier (auth_id or IP address)
 * @returns true if rate limit is exceeded, false otherwise
 */
export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry) {
    // First request - create entry
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return false; // Not rate limited
  }

  // Check if window has expired
  if (entry.resetTime < now) {
    // Reset the counter
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return false; // Not rate limited
  }

  // Check if limit exceeded
  if (entry.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return true; // Rate limited
  }

  // Increment counter
  entry.count++;
  return false; // Not rate limited
}

/**
 * Get remaining requests for a user
 * 
 * @param userId - User identifier
 * @returns Number of remaining requests, or null if no limit
 */
export function getRemainingRequests(userId: string): number | null {
  const entry = rateLimitStore.get(userId);
  if (!entry) {
    return RATE_LIMIT_CONFIG.maxRequests;
  }

  const now = Date.now();
  if (entry.resetTime < now) {
    return RATE_LIMIT_CONFIG.maxRequests;
  }

  return Math.max(0, RATE_LIMIT_CONFIG.maxRequests - entry.count);
}

/**
 * Get reset time for a user's rate limit
 * 
 * @param userId - User identifier
 * @returns Reset time in milliseconds since epoch, or null if no limit
 */
export function getResetTime(userId: string): number | null {
  const entry = rateLimitStore.get(userId);
  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (entry.resetTime < now) {
    return null;
  }

  return entry.resetTime;
}

/**
 * Middleware to check rate limit for a request
 * Uses user ID if authenticated, otherwise falls back to IP address
 * 
 * @param req - Next.js request object
 * @param userId - Optional user ID (if authenticated)
 * @returns Error response if rate limited, null otherwise
 */
export function rateLimitMiddleware(
  req: NextRequest,
  userId?: string
): { error: string; status: number; resetTime?: number } | null {
  // Use user ID if provided, otherwise use IP address
  const identifier = userId || req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

  if (checkRateLimit(identifier)) {
    const resetTime = getResetTime(identifier);
    return {
      error: `Rate limit exceeded. Maximum ${RATE_LIMIT_CONFIG.maxRequests} reviews per hour. Please try again later.`,
      status: 429,
      resetTime: resetTime || undefined,
    };
  }

  return null;
}

