import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { requireAuth } from "@/lib/utils/auth";
import { validateReviewUpdate } from "@/lib/utils/validation";
import { supabaseServer } from "@/lib/supabase/server";

export async function PUT(req: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(req);
    
    const rawData = await req.json();
    const { id } = rawData;
    
    // Validate and sanitize input
    let reviewData;
    try {
      reviewData = validateReviewUpdate(rawData);
    } catch (validationError) {
      if (validationError instanceof Error) {
        return NextResponse.json(
          { error: `Validation error: ${validationError.message}` },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    // Convert string id to BigInt
    const bigIntId = BigInt(id);

    // First, check if the review exists and belongs to the authenticated user
    const existingReview = await prisma.review.findUnique({
      where: { id: bigIntId },
      include: { author: true },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Verify the user owns this review
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

    // Check if the review's authorId matches the authenticated user's auth_id
    if (existingReview.authorId !== dbUser.auth_id) {
      return NextResponse.json(
        { error: "Unauthorized: You can only edit your own reviews" },
        { status: 403 }
      );
    }

    // Ensure authorId cannot be changed
    if (reviewData.authorId && reviewData.authorId !== dbUser.auth_id) {
      return NextResponse.json(
        { error: "Cannot change review author" },
        { status: 400 }
      );
    }

    // Override authorId to ensure it matches the authenticated user
    reviewData.authorId = dbUser.auth_id || undefined;

    // Remove id from update data (it's in the where clause)
    const { id: _id, ...updateData } = reviewData as typeof reviewData & { id?: unknown }; // eslint-disable-line @typescript-eslint/no-unused-vars

    console.log("Updating review with id:", id, "data:", updateData);

    const updatedReview = await prisma.review.update({
      where: { id: bigIntId },
      data: updateData,
    });

    console.log("Review updated successfully:", updatedReview);

    // Convert BigInt id to string for JSON serialization
    const serializedReview = {
      ...updatedReview,
      id: updatedReview.id.toString(),
    };

    return NextResponse.json(serializedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    
    // Handle authentication errors
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to update a review." },
        { status: 401 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

