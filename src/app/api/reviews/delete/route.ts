import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";


export async function DELETE(req: NextRequest) {
  try 
  {
    const body = await req.json();
    const { reviewId } = body;
    const deletedReview = await prisma.review.delete({ where: {id:BigInt(reviewId)}});
    
    console.log("Review deleted successfully:", deletedReview);
    //Destructure review for safe handling (errors otherwise)
    const safeReview = {
      ...deletedReview,
      id: deletedReview.id.toString(),  
    };
    return NextResponse.json({ message: "Review deleted", review: safeReview});
  } 
  catch (error) 
  {
    console.error("Error deleting review:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
