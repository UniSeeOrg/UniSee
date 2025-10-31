import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { Review } from "@/lib/types/reviews";

export async function POST(req: NextRequest) {
  try 
  {
    const review: Review = await req.json();

    const { id: _id, ...reviewData } = review; // eslint-disable-line @typescript-eslint/no-unused-vars
    
    console.log("Creating review with data:", reviewData);
    
    const newReview = await prisma.review.create({ data: reviewData });
    
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
