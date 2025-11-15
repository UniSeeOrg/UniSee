import { fetchSchoolInfo } from "../fetch";
import SchoolHeader from "@/components/layout/SchoolHeader";
import OverallCostChart from "@/components/school/costs/OverallCostChart";
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
  const school: { name: string; city: string; state: string; school_url: URL } = result.school;
  const latest = result.latest;
  const {name,city,state,school_url} : {name: string, city: string, state:string,school_url:URL}= school;
  const numUndergrads: string = latest.student?.size;
  const numGrads : string = latest.student?.grad_students;
  const schoolType: string = latest.school.peps_ownership;
  console.log(latest.cost)

  const inStateTuition = latest.cost.tuition.in_state;
  const outOfStateTuition = latest.cost.tuition.out_of_state;
  const roomAndBoard = latest.cost.roomboard.oncampus;
  const avgBookCost = latest.cost.booksupply;
  const miscExpenses = latest.cost.otherexpense.oncampus;

  console.log(outOfStateTuition, roomAndBoard, avgBookCost,miscExpenses)

  return(
    <div className="flex flex-col">
      <SchoolHeader name={name} city={city} state={state} school_url={school_url} numGrads={numGrads} numUndergrads={numUndergrads} schoolType={schoolType}/>
      <div className="pt-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-500">
          Cost Breakdown for {name}
        </h1>
        {/* TODO: toggle in/out of state, on/off campus*/}
        <OverallCostChart tuition={outOfStateTuition} roomAndBoard={roomAndBoard} bookSupply={avgBookCost} additionalExpenses={miscExpenses}/>
      </div>
    </div>
  )
}

