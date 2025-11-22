import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const schoolId = searchParams.get("schoolId");
    const sortBy = searchParams.get("sortBy") || "newest"; // newest, oldest, highest, lowest
    const minRating = searchParams.get("minRating");
    const major = searchParams.get("major");
    const searchQuery = searchParams.get("search"); // keyword search for title/content
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!schoolId) {
      return NextResponse.json({ error: "schoolId is required" }, { status: 400 });
    }

    // Build where clause - combine AND conditions with optional OR for search
    const andConditions: any[] = [ // eslint-disable-line @typescript-eslint/no-explicit-any
      { schoolId: schoolId },
    ];

    // Filter by minimum rating if provided
    if (minRating) {
      andConditions.push({
        rating: {
          gte: parseInt(minRating),
        },
      });
    }

    // Filter by major if provided
    if (major) {
      andConditions.push({
        major: {
          contains: major,
          mode: "insensitive",
        },
      });
    }

    // Keyword search for title or content
    if (searchQuery) {
      andConditions.push({
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    const whereClause: any = andConditions.length > 1 ? { AND: andConditions } : andConditions[0]; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Build orderBy clause
    let orderBy: any = { id: "desc" }; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (sortBy === "oldest") {
      orderBy = { id: "asc" };
    } else if (sortBy === "highest") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "lowest") {
      orderBy = { rating: "asc" };
    }

    // Get total count for pagination
    const totalCount = await prisma.review.count({ where: whereClause });

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalCount / limit);

    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: orderBy,
      skip: skip,
      take: limit,
    });

    // Format the response to include user info if author exists
    const formattedReviews = await Promise.all(
      reviews.map(async (review: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (review.authorId) {
          // Fetch user from Supabase (User table is managed by Supabase, not Prisma)
          const { data: authorData } = await supabaseServer
            .from("User")
            .select("email, name, major")
            .eq("auth_id", review.authorId)
            .single();
          
          const author = authorData ? {
            email: authorData.email,
            name: authorData.name || null,
            major: authorData.major || null,
          } : null;
          
          return {
            ...review,
            id: review.id.toString(), // Convert BigInt to string
            author: author,
          };
        }
        return { ...review, id: review.id.toString(), author: null };
      })
    );

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
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
