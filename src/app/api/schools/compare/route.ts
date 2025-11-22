import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY;

interface SchoolComparisonData {
  id: string;
  name: string;
  city?: string;
  state?: string;
  school_url?: string;
  tuition_in_state?: number;
  tuition_out_state?: number;
  avg_net_cost?: number;
  avg_fin_aid?: number;
  acceptance_rate?: number;
  graduation_rate?: number;
  sat_score?: number;
  act_score?: number;
  student_size?: number;
  grad_students?: number;
  review_stats?: {
    totalReviews: number;
    averages: {
      overall: number | null;
      academics: number | null;
      social: number | null;
      food: number | null;
      housing: number | null;
      career: number | null;
    };
  };
}

async function fetchSchoolData(schoolId: string): Promise<SchoolComparisonData | null> {
  try {
    if (!API_KEY) {
      throw new Error("COLLEGE_SCORECARD_API_KEY is not configured");
    }

    // Fetch school data from College Scorecard API
    const apiResponse = await fetch(
      `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${API_KEY}&id=${schoolId}`
    );
    
    if (!apiResponse.ok) {
      return null;
    }
    
    const data = await apiResponse.json();
    const school = data.results?.[0];
    
    if (!school) {
      return null;
    }

    const schoolInfo = school.school;
    const latest = school.latest;

    // Get review stats from database
    let reviewStats = null;
    try {
      const { prisma } = await import("@/prisma");
      const dbSchool = await prisma.school.findUnique({
        where: { external_id: schoolId },
      });

      if (dbSchool) {
        // Calculate review stats directly (same logic as stats API route)
        const reviews = await prisma.review.findMany({
          where: { schoolId: dbSchool.id },
          select: {
            rating: true,
            academics: true,
            social: true,
            food: true,
            housing: true,
            career: true,
          },
        });

        const totalReviews = reviews.length;
        
        const validRatings = reviews.filter((r) => r.rating !== null && r.rating !== undefined).map((r) => r.rating as number);
        const validAcademics = reviews.filter((r) => r.academics !== null && r.academics !== undefined).map((r) => r.academics as number);
        const validSocial = reviews.filter((r) => r.social !== null && r.social !== undefined).map((r) => r.social as number);
        const validFood = reviews.filter((r) => r.food !== null && r.food !== undefined).map((r) => r.food as number);
        const validHousing = reviews.filter((r) => r.housing !== null && r.housing !== undefined).map((r) => r.housing as number);
        const validCareer = reviews.filter((r) => r.career !== null && r.career !== undefined).map((r) => r.career as number);

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

        if (totalReviews > 0) {
          reviewStats = {
            totalReviews,
            averages: {
              overall: averageRating ? Math.round(averageRating * 10) / 10 : null,
              academics: averageAcademics ? Math.round(averageAcademics * 10) / 10 : null,
              social: averageSocial ? Math.round(averageSocial * 10) / 10 : null,
              food: averageFood ? Math.round(averageFood * 10) / 10 : null,
              housing: averageHousing ? Math.round(averageHousing * 10) / 10 : null,
              career: averageCareer ? Math.round(averageCareer * 10) / 10 : null,
            },
          };
        }
      }
    } catch (error) {
      console.error("Error fetching review stats:", error);
      // Continue without review stats
    }

    return {
      id: schoolId,
      name: schoolInfo.name || "Unknown",
      city: schoolInfo.city,
      state: schoolInfo.state,
      school_url: schoolInfo.school_url,
      tuition_in_state: latest.cost?.tuition?.in_state,
      tuition_out_state: latest.cost?.tuition?.out_of_state,
      avg_net_cost: latest.cost?.avg_net_price?.overall,
      avg_fin_aid: latest.cost?.attendance?.academic_year 
        ? latest.cost.attendance.academic_year - (latest.cost.avg_net_price?.overall || 0)
        : undefined,
      acceptance_rate: latest.admissions?.admission_rate?.overall 
        ? latest.admissions.admission_rate.overall * 100 
        : undefined,
      graduation_rate: latest.completion?.consumer_rate 
        ? latest.completion.consumer_rate * 100 
        : undefined,
      sat_score: latest.admissions?.sat_scores?.average?.overall,
      act_score: latest.admissions?.act_scores?.midpoint?.cumulative,
      student_size: latest.student?.size,
      grad_students: latest.student?.grad_students,
      review_stats: reviewStats || undefined,
    };
  } catch (error) {
    console.error(`Error fetching school data for ${schoolId}:`, error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { schoolIds } = await req.json();

    if (!schoolIds || !Array.isArray(schoolIds) || schoolIds.length === 0) {
      return NextResponse.json(
        { error: "schoolIds array is required" },
        { status: 400 }
      );
    }

    if (schoolIds.length > 4) {
      return NextResponse.json(
        { error: "Maximum 4 schools can be compared" },
        { status: 400 }
      );
    }

    // Fetch data for all schools in parallel
    const schoolDataPromises = schoolIds.map((id: string) => fetchSchoolData(id));
    const schoolDataArray = await Promise.all(schoolDataPromises);

    // Filter out null values (schools that couldn't be fetched)
    const validSchoolData = schoolDataArray.filter(
      (data): data is SchoolComparisonData => data !== null
    );

    if (validSchoolData.length === 0) {
      return NextResponse.json(
        { error: "No valid school data could be fetched" },
        { status: 404 }
      );
    }

    return NextResponse.json({ schools: validSchoolData });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
