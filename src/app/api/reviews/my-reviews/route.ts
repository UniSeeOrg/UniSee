import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { requireAuth } from "@/lib/utils/auth";

export async function GET(req: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(req);

    const searchParams = req.nextUrl.searchParams;
    const sortBy = searchParams.get("sortBy") || "newest"; // newest, oldest, highest, lowest
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause - only get reviews by this user
    const whereClause: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      authorId: user.id,
    };

    // Build orderBy clause
    let orderBy: any = { id: "desc" }; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (sortBy === "oldest") {
      orderBy = { id: "asc" };
    } else if (sortBy === "highest") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "lowest") {
      orderBy = { rating: "asc" };
    }

    // Get total count for pagination and stats
    const totalCount = await prisma.review.count({ where: whereClause });

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalCount / limit);

    // Get reviews with school information
    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: orderBy,
      skip: skip,
      take: limit,
      include: {
        school: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            external_id: true,
          },
        },
      },
    });

    // Format the response
    const formattedReviews = reviews.map((review: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      return {
        ...review,
        id: review.id.toString(), // Convert BigInt to string
        school: review.school,
      };
    });

    return NextResponse.json({
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

