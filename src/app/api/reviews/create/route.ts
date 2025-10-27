import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { Review } from "@/lib/types/reviews";

export async function POST(req: NextRequest) {
  try 
  {
    const review: Review = await req.json();

    const { id, ...reviewData } = review;
    const newReview = await prisma.review.create({ data: reviewData });
    return NextResponse.json(newReview);
  } 
  catch (error) 
  {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
