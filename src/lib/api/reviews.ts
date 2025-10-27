"use client" 
import {Review} from "@/lib/types/reviews";

export async function createReview(review: Review) {
  console.log(review);
  const res = await fetch("/api/reviews/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  return await res.json();
}
