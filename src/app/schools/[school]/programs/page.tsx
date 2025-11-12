import { fetchSchoolInfo } from "../fetch";
import SchoolHeader from "@/components/layout/SchoolHeader";
import ProgramDropdown from "@/components/school/programs/ProgramDropdown";
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

  const bachelorPrograms: Array<ProgramInfo> = [];
  const graduatePrograms: Array<ProgramInfo> = [];
  

  //for program info
  for(let i: number = 0; i < latest.programs.cip_4_digit.length; i++)
  {
    const current = latest.programs.cip_4_digit[i]
    const degreeType = current.credential.title
    
    //this might need to change if degree title info isnt uniform
    const bachelorString = "Bachelor's Degree"
    
    const name = current.title
    const earnings = current.earnings.highest["1_yr"].overall_median_earnings
    const program: ProgramInfo = {name: name, earnings: earnings}

    if(degreeType == bachelorString)
    {
      bachelorPrograms.push(program)
    }
    else
    {
      graduatePrograms.push(program) 
    }
    //Sorting Array<ProgramInfo> with a lambda, sorting A-Z
    bachelorPrograms.sort((a, b) => {return a.name.localeCompare(b.name);});

    graduatePrograms.sort((a, b) => {return a.name.localeCompare(b.name);});
    console.log(current)

  }
  console.log(result)


  return(
    <div className="flex flex-col">
      <SchoolHeader name={name} city={city} state={state} school_url={school_url} numGrads={numGrads} numUndergrads={numUndergrads} schoolType={schoolType}/>
      <div className="pt-12 flex flex-col items-center justify-center">
        <div>
          <ProgramDropdown programs={bachelorPrograms} title="Bachelor Programs"/>
        </div>

        <div>
          <ProgramDropdown programs={graduatePrograms} title="Graduate Programs"/>
        </div>
      </div>
    </div>
  )
}
