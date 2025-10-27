import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json({ error: "schoolId is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        schoolId: schoolId,
      },
      orderBy: {
        id: "desc", // Newest first
      },
    });

    // Format the response to include user info if author exists
    const formattedReviews = await Promise.all(
      reviews.map(async (review: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (review.authorId) {
          const author = await prisma.user.findUnique({
            where: { auth_id: review.authorId },
            select: { email: true, name: true },
          });
          return {
            ...review,
            id: review.id.toString(), // Convert BigInt to string
            author: author || null,
          };
        }
        return { ...review, id: review.id.toString(), author: null };
      })
    );

    return NextResponse.json(formattedReviews);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
