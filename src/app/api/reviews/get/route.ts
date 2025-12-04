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

    // Build orderBy clause
    let orderBy: any = { id: "desc" }; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (sortBy === "oldest") {
      orderBy = { id: "asc" };
    } else if (sortBy === "highest") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "lowest") {
      orderBy = { rating: "asc" };
    }

    const whereClause: any = andConditions.length > 1 ? { AND: andConditions } : andConditions[0]; // eslint-disable-line @typescript-eslint/no-explicit-any

    // If filtering by major, we need to fetch all reviews and filter by author.major after fetching
    // Since we can't easily join with Supabase User table in Prisma for author.major matching
    const skip = (page - 1) * limit;
    
    // Fetch reviews - don't apply skip/take yet if filtering by major (we'll do it after filtering)
    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: orderBy,
      ...(major ? {} : { skip, take: limit }), // Only apply pagination if not filtering by major
    });

    // Format the response to include user info if author exists
    let formattedReviews = await Promise.all(
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

    // Apply client-side filtering for major if needed
    // This handles cases where review.major is null/empty but author.major matches
    if (major) {
      const majorLower = major.toLowerCase().trim();
      formattedReviews = formattedReviews.filter((review: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // Check if review.major matches (not null, not empty)
        const reviewMajorMatch = review.major && 
          review.major.trim() &&
          review.major.toLowerCase().includes(majorLower);
        
        // Check if author.major matches (fallback when review.major is null/empty)
        const authorMajorMatch = (!review.major || !review.major.trim()) && 
          review.author?.major &&
          review.author.major.trim() &&
          review.author.major.toLowerCase().includes(majorLower);
        
        return reviewMajorMatch || authorMajorMatch;
      });

      // Sort again after filtering
      if (sortBy === "oldest") {
        formattedReviews.sort((a: any, b: any) => parseInt(a.id) - parseInt(b.id)); // eslint-disable-line @typescript-eslint/no-explicit-any
      } else if (sortBy === "highest") {
        formattedReviews.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0)); // eslint-disable-line @typescript-eslint/no-explicit-any
      } else if (sortBy === "lowest") {
        formattedReviews.sort((a: any, b: any) => (a.rating || 0) - (b.rating || 0)); // eslint-disable-line @typescript-eslint/no-explicit-any
      } else {
        formattedReviews.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id)); // eslint-disable-line @typescript-eslint/no-explicit-any
      }

      // Calculate total count for pagination (before applying pagination)
      const totalCount = formattedReviews.length;
      const totalPages = Math.ceil(totalCount / limit);

      // Apply pagination
      formattedReviews = formattedReviews.slice(skip, skip + limit);

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
    }

    // Get total count for pagination (when not filtering by major)
    const totalCount = await prisma.review.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / limit);

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
