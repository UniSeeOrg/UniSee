import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const schoolId = searchParams.get("schoolId");
    const sortBy = searchParams.get("sortBy") || "newest"; // newest, oldest, highest, lowest
    const minRating = searchParams.get("minRating");

    if (!schoolId) {
      return NextResponse.json({ error: "schoolId is required" }, { status: 400 });
    }

    // Build where clause
    const whereClause: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      schoolId: schoolId,
    };

    // Filter by minimum rating if provided
    if (minRating) {
      whereClause.rating = {
        gte: parseInt(minRating),
      };
    }

    // Build orderBy clause
    let orderBy: any = { id: "desc" }; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (sortBy === "oldest") {
      orderBy = { id: "asc" };
    } else if (sortBy === "highest") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "lowest") {
      orderBy = { rating: "asc" };
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: orderBy,
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
