
export async function fetchSchoolInfo(schoolName :string)
{
  const apiResponse = await fetch(`https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${getApiKey()}&school.name=${schoolName} `);
  const data = await apiResponse.json();
  return data;
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
