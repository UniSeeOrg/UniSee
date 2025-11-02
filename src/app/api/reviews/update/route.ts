import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { id, ...reviewData } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    console.log("Updating review with id:", id, "data:", reviewData);

    // Convert string id to BigInt
    const bigIntId = BigInt(id);

    const updatedReview = await prisma.review.update({
      where: { id: bigIntId },
      data: reviewData,
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

