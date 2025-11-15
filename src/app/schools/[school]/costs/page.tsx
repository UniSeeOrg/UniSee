import { fetchSchoolInfo } from "../fetch";
import SchoolHeader from "@/components/layout/SchoolHeader";
import OverallCostChart from "@/components/school/costs/OverallCostChart";
import IncomeLevelChart from "@/components/school/costs/IncomeLevelChart";
import NetMedianChart from "@/components/school/costs/NetMedianChart";
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


  const incomeLevel = latest.cost.net_price.consumer.by_income_level
  const under30k = incomeLevel["0-30000"];
  const from30to48k = incomeLevel["30001-48000"];
  const from48to75k = incomeLevel["48001-75000"];
  const from75to110k = incomeLevel["750001-111000"];
  const over110k = incomeLevel["110001-plus"];


  console.log(latest)

  const netPrice = latest.cost.avg_net_price;
  const schoolPrice = netPrice.overall;
  const medianPrice = netPrice.consumer.overall_median

  return(
    <div className="flex flex-col">
      <SchoolHeader name={name} city={city} state={state} school_url={school_url} numGrads={numGrads} numUndergrads={numUndergrads} schoolType={schoolType}/>
      <div className="pt-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-5xl font-extrabold text-blue-500">
          Cost Breakdown for {name}
        </h1>
        {/* TODO: toggle in/out of state, on/off campus*/}

        <h2 className="mt-10 italic text-2xl md:text-3xl font-extrabold text-blue-500">Total Cost</h2>
        <OverallCostChart tuition={outOfStateTuition} roomAndBoard={roomAndBoard} bookSupply={avgBookCost} additionalExpenses={miscExpenses}/>
        <h2 className="mt-10 italic text-2xl md:text-3xl font-extrabold text-blue-500">Net Price By Income Group</h2>
        <IncomeLevelChart under30K={under30k} from30To48K={from30to48k} from48To75K={from48to75k} from75To110K={from75to110k} over110K={over110k}/>
        <h2 className="mt-10 italic text-2xl md:text-3xl font-extrabold text-blue-500">Net Price vs. Median Price</h2>
        <NetMedianChart program={schoolPrice} median={medianPrice}/>
      </div>
    </div>
  )
}

