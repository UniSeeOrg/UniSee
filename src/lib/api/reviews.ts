"use client" 
import {Review} from "@/lib/types/reviews";
import { getSessionToken } from "@/lib/utils/supabaseAuth";

/**
 * Get the current session token for authenticated requests
 * Uses the safe utility function that handles errors gracefully
 */
async function getAuthToken(): Promise<string | null> {
  return getSessionToken();
}

export async function createReview(review: Review) {
  console.log(review);
  const token = await getAuthToken();
  
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch("/api/reviews/create", {
    method: "POST",
    headers,
    body: JSON.stringify(review),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Failed to create review' }));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  
  return await res.json();
}

export async function getReviews(
  schoolId: string,
  options?: {
    sortBy?: "newest" | "oldest" | "highest" | "lowest";
    minRating?: number;
    major?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
) {
  const params = new URLSearchParams({ schoolId });
  
  if (options?.sortBy) {
    params.append("sortBy", options.sortBy);
  }
  
  if (options?.minRating !== undefined) {
    params.append("minRating", options.minRating.toString());
  }
  
  if (options?.major) {
    params.append("major", options.major);
  }
  
  if (options?.search) {
    params.append("search", options.search);
  }
  
  if (options?.page) {
    params.append("page", options.page.toString());
  }
  
  if (options?.limit) {
    params.append("limit", options.limit.toString());
  }
  
  const res = await fetch(`/api/reviews/get?${params.toString()}`);
  
  // Check if response is OK and is JSON
  if (!res.ok) {
    // Try to parse error as JSON, fallback to text
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json().catch(() => ({ error: `HTTP error! status: ${res.status}` }));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    } else {
      // If it's HTML (error page), throw a generic error
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  }
  
  // Check content type before parsing
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Expected JSON response but got " + contentType);
  }
  
  const data = await res.json();
  
  // Handle both old format (array) and new format (object with reviews and pagination)
  if (Array.isArray(data)) {
    return data;
  }
  
  return data;
}

export async function updateReview(reviewId: string, reviewData: Partial<Review>) {
  console.log("Updating review:", reviewId, reviewData);
  const token = await getAuthToken();
  
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch("/api/reviews/update", {
    method: "PUT",
    headers,
    body: JSON.stringify({ id: reviewId, ...reviewData }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Failed to update review' }));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

//Calls /api/reviews/delete from app/api
export async function deleteReview(reviewId: number)
{
  const token = await getAuthToken();
  
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch("/api/reviews/delete", {
    method: "DELETE",
    headers,
    body: JSON.stringify({reviewId}),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Failed to delete review' }));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
}
