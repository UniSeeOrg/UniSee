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
  //need to store this in an .env somewhere and export it 
  const apiKey = "bb29Q304BgkotuPdvwfeF23deO8F93psi0F2sSC4"
  return apiKey;
}
