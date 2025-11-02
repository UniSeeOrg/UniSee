import { getOrCreateSchool} from "@/lib/api/schools";
export async function fetchSchoolInfo(schoolName :string)
{
  const apiResponse = await fetch(`https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${getApiKey()}&id=${schoolName} `);
  const data = await apiResponse.json();
  //schoolId 
  const id = data.results?.[0].id;
  const name = data.results?.[0].school.name;
  const url = data.results?.[0].school.school_url;
  console.log(name)
  const uuid = await getOrCreateSchool(id,name,url)

  return {data: data, uuid:uuid};
}

export async function fetchSchoolIcon(url: URL)
{
  const logoResponse = await fetch(url)
  const blob = await logoResponse.blob();
  return URL.createObjectURL(blob); 
}

function getApiKey() : string
{
  const apiKey = process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY;
  if (!apiKey) {
    throw new Error("COLLEGE_SCORECARD_API_KEY is not configured");
  }
  return apiKey;
}
