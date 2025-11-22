import { prisma } from "@/prisma";

//Caching schools in DB
export async function getOrCreateSchool(externalSchoolId: string, schoolName: string, schoolUrl: string) {
  externalSchoolId = String(externalSchoolId)
  let school = await prisma.school.findUnique({ where: { external_id: externalSchoolId } });

  if (!school) {
    school = await prisma.school.create({
      data: { external_id: externalSchoolId, name: schoolName, school_url: schoolUrl },
    });
  }

  return school.id;
}

// Fetch school data for comparison
export async function fetchSchoolDataForComparison(externalId: string) {
  const apiKey = process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY;
  if (!apiKey) {
    throw new Error("COLLEGE_SCORECARD_API_KEY is not configured");
  }

  const response = await fetch(
    `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${apiKey}&id=${externalId}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch school data: ${response.status}`);
  }

  const data = await response.json();
  const school = data.results?.[0];
  
  if (!school) {
    throw new Error("School not found");
  }

  return {
    externalId: school.id,
    name: school.school.name,
    city: school.school.city,
    state: school.school.state,
    url: school.school.school_url,
    data: school.latest,
  };
}
