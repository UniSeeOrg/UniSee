import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json({ error: "schoolId is required" }, { status: 400 });
    }

    // Get all reviews for the school
    const reviews = await prisma.review.findMany({
      where: { schoolId },
      select: {
        rating: true,
        academics: true,
        social: true,
        food: true,
        housing: true,
        career: true,
      },
    });

    // Calculate statistics
    const totalReviews = reviews.length;
    
    // Filter out null/undefined values for each category
    const validRatings = reviews.filter((r) => r.rating !== null && r.rating !== undefined).map((r) => r.rating as number);
    const validAcademics = reviews.filter((r) => r.academics !== null && r.academics !== undefined).map((r) => r.academics as number);
    const validSocial = reviews.filter((r) => r.social !== null && r.social !== undefined).map((r) => r.social as number);
    const validFood = reviews.filter((r) => r.food !== null && r.food !== undefined).map((r) => r.food as number);
    const validHousing = reviews.filter((r) => r.housing !== null && r.housing !== undefined).map((r) => r.housing as number);
    const validCareer = reviews.filter((r) => r.career !== null && r.career !== undefined).map((r) => r.career as number);

    // Calculate averages
    const averageRating = validRatings.length > 0 
      ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length 
      : null;
    const averageAcademics = validAcademics.length > 0
      ? validAcademics.reduce((sum, r) => sum + r, 0) / validAcademics.length
      : null;
    const averageSocial = validSocial.length > 0
      ? validSocial.reduce((sum, r) => sum + r, 0) / validSocial.length
      : null;
    const averageFood = validFood.length > 0
      ? validFood.reduce((sum, r) => sum + r, 0) / validFood.length
      : null;
    const averageHousing = validHousing.length > 0
      ? validHousing.reduce((sum, r) => sum + r, 0) / validHousing.length
      : null;
    const averageCareer = validCareer.length > 0
      ? validCareer.reduce((sum, r) => sum + r, 0) / validCareer.length
      : null;

    return NextResponse.json({
      totalReviews,
      averages: {
        overall: averageRating ? Math.round(averageRating * 10) / 10 : null,
        academics: averageAcademics ? Math.round(averageAcademics * 10) / 10 : null,
        social: averageSocial ? Math.round(averageSocial * 10) / 10 : null,
        food: averageFood ? Math.round(averageFood * 10) / 10 : null,
        housing: averageHousing ? Math.round(averageHousing * 10) / 10 : null,
        career: averageCareer ? Math.round(averageCareer * 10) / 10 : null,
      },
      counts: {
        overall: validRatings.length,
        academics: validAcademics.length,
        social: validSocial.length,
        food: validFood.length,
        housing: validHousing.length,
        career: validCareer.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

