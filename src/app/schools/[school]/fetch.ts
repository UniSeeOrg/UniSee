
export async function fetchSchoolInfo(schoolName :string)
{
  let apiResponse = await fetch(`https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${getApiKey()}&school.name=${schoolName} `);
  let data = await apiResponse.json();
  return data;
}
export async function fetchSchoolIcon(url: URL)
{
  let logoResponse = await fetch(url)
  let blob = await logoResponse.blob();
  return URL.createObjectURL(blob); 
}

function getApiKey() : string
{
  //need to store this in an .env somewhere and export it 
  let apiKey = "bb29Q304BgkotuPdvwfeF23deO8F93psi0F2sSC4"
  return apiKey;
}
