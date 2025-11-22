import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { requireAuth } from "@/lib/utils/auth";
import { validateReview } from "@/lib/utils/validation";
import { rateLimitMiddleware } from "@/lib/utils/rateLimit";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try 
  {
    // Require authentication
    const user = await requireAuth(req);
    
    // Check rate limit
    const rateLimitError = rateLimitMiddleware(req, user.id);
    if (rateLimitError) {
      return NextResponse.json(
        { 
          error: rateLimitError.error,
          resetTime: rateLimitError.resetTime,
        },
        { 
          status: rateLimitError.status,
          headers: rateLimitError.resetTime ? {
            "X-RateLimit-Reset": new Date(rateLimitError.resetTime).toISOString(),
          } : undefined,
        }
      );
    }
    
    const rawData = await req.json();
    
    // Validate and sanitize input
    let reviewData;
    try {
      reviewData = validateReview(rawData);
    } catch (validationError) {
      // The validateReview function already formats the error message
      const errorMessage = validationError instanceof Error 
        ? validationError.message 
        : "Invalid input data. Please check all required fields and ensure ratings are between 1-5 if provided.";
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Remove id if present (shouldn't be in create requests)
    const { id: _id, ...reviewDataWithoutId } = reviewData as typeof reviewData & { id?: unknown }; // eslint-disable-line @typescript-eslint/no-unused-vars
    
    // Ensure the authorId matches the authenticated user
    // Get the user's auth_id from the database (User table is managed by Supabase, not Prisma)
    const { data: dbUser } = await supabaseServer
      .from("User")
      .select("id, auth_id")
      .eq("auth_id", user.id)
      .single();
    
    if (!dbUser) {
      return NextResponse.json(
        { error: "User profile not found. Please complete registration." },
        { status: 404 }
      );
    }
    
    // Override authorId with the authenticated user's ID
    reviewDataWithoutId.authorId = dbUser.auth_id || user.id;
    
    console.log("Creating review with data:", reviewDataWithoutId);
    
    const newReview = await prisma.review.create({ data: reviewDataWithoutId });
    
    console.log("Review created successfully:", newReview);
    
    // Convert BigInt id to string for JSON serialization
    const serializedReview = {
      ...newReview,
      id: newReview.id.toString(),
    };
    
    return NextResponse.json(serializedReview);
  } 
  catch (error) 
  {
    console.error("Error creating review:", error);
    
    // Handle authentication errors
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to create a review." },
        { status: 401 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
