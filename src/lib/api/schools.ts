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
