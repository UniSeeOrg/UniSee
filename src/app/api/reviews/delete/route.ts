import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { requireAuth } from "@/lib/utils/auth";
import { validateReviewDelete } from "@/lib/utils/validation";

export async function DELETE(req: NextRequest) {
  try 
  {
    // Require authentication
    const user = await requireAuth(req);
    
    const rawData = await req.json();
    
    // Validate input
    let validatedData;
    try {
      validatedData = validateReviewDelete(rawData);
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
    
    const { reviewId } = validatedData;

    // Convert to BigInt
    const bigIntId = BigInt(reviewId);

    // First, check if the review exists and belongs to the authenticated user
    const existingReview = await prisma.review.findUnique({
      where: { id: bigIntId },
      include: { author: true },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Verify the user owns this review
    // Get the user's auth_id from the database
    const dbUser = await prisma.user.findUnique({
      where: { auth_id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User profile not found. Please complete registration." },
        { status: 404 }
      );
    }

    // Check if the review's authorId matches the authenticated user's auth_id
    if (existingReview.authorId !== dbUser.auth_id) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own reviews" },
        { status: 403 }
      );
    }

    const deletedReview = await prisma.review.delete({ where: { id: bigIntId }});
    
    console.log("Review deleted successfully:", deletedReview);
    
    // Destructure review for safe handling (errors otherwise)
    const safeReview = {
      ...deletedReview,
      id: deletedReview.id.toString(),  
    };
    
    return NextResponse.json({ message: "Review deleted", review: safeReview });
  } 
  catch (error) 
  {
    console.error("Error deleting review:", error);
    
    // Handle authentication errors
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to delete a review." },
        { status: 401 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
