import { fetchSchoolInfo, fetchSchoolIcon } from "../fetch";
import SchoolHeader from "@/components/layout/SchoolHeader";
import ProgramCard from "@/components/school/programs/ProgramCard";
interface ProgramInfo
{
  name: string;
  earnings : string | null;

}
export default async function SchoolPrograms({ params }: { params: Promise<{ school: string }> })
{
  const { school: slug } = await params;
  console.log(slug)
  const schoolInfo = await fetchSchoolInfo(slug)

  //TODO: 404 or error page 
  if(! schoolInfo)
  {
    return (<p>not found</p>)
  }

  const result = await schoolInfo.data.results?.[0];
  const schoolId = schoolInfo.uuid;
  console.log(schoolId);
  //console.log(result.id)
  const school: { name: string; city: string; state: string; school_url: URL } = result.school;
  const latest = result.latest;
  const {name,city,state,school_url} : {name: string, city: string, state:string,school_url:URL}= school;
  const numUndergrads: string = latest.student?.size;
  const numGrads : string = latest.student?.grad_students;

  const schoolType: string = latest.school.peps_ownership;

  let bachelorPrograms: Array<ProgramInfo> = [];
  

  //for program info
  for(let i: number = 0; i < latest.programs.cip_4_digit.length; i++)
  {
    let current = latest.programs.cip_4_digit[i]
    let degreeType = current.credential.title
    
    //this might need to change if degree title info isnt uniform
    const bachelorString = "Bachelor's Degree"

    if(degreeType == bachelorString)
    {
      let name = current.title
      let earnings = current.earnings.highest["1_yr"].overall_median_earnings
      let program: ProgramInfo = {name: name, earnings: earnings}
      bachelorPrograms.push(program)
    }
    //Sorting Array<ProgramInfo> with a lambda, sorting A-Z
    bachelorPrograms.sort((a, b) => {return a.name.localeCompare(b.name);});
    console.log(current)

  }
  return(
    <div className="flex flex-col">
      <SchoolHeader name={name} city={city} state={state} school_url={school_url} numGrads={numGrads} numUndergrads={numUndergrads} schoolType={schoolType}/>
      <div className="pt-12 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">Bachelor Programs</h1>
        <div className="flex flex-wrap gap-6 justify-center h-128 overflow-y-scroll overflow-x-hidden">
          {bachelorPrograms.map((program, index) => (
           <ProgramCard key={index} name={program.name} earnings={program.earnings} />
          ))}
        </div>
      </div>
    </div>
  )
}
