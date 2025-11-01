"use client" 
import {Review} from "@/lib/types/reviews";

export async function createReview(review: Review) {
  console.log(review);
  const res = await fetch("/api/reviews/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  }
) {
  const params = new URLSearchParams({ schoolId });
  
  if (options?.sortBy) {
    params.append("sortBy", options.sortBy);
  }
  
  if (options?.minRating !== undefined) {
    params.append("minRating", options.minRating.toString());
  }
  
  const res = await fetch(`/api/reviews/get?${params.toString()}`);
  return await res.json();
}
