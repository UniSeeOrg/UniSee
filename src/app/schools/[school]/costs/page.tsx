import { fetchSchoolInfo } from "../fetch";
import SchoolHeader from "@/components/layout/SchoolHeader";
import OverallCostChart from "@/components/school/costs/OverallCostChart";
import IncomeLevelChart from "@/components/school/costs/IncomeLevelChart";
import NetMedianChart from "@/components/school/costs/NetMedianChart";
import LoanPieChart from "@/components/school/costs/LoanPieChart";
import AidPieChart from "@/components/school/costs/AidPieChart";
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
  console.log(latest.aid)

  const inStateTuition = latest.cost.tuition.in_state;
  const outOfStateTuition = latest.cost.tuition.out_of_state;
  const roomAndBoard = latest.cost.roomboard.oncampus;
  const avgBookCost = latest.cost.booksupply;
  const miscExpenses = latest.cost.otherexpense.oncampus;

  const inStateTotal = inStateTuition + roomAndBoard + avgBookCost + miscExpenses;
  const outOfStateTotal = outOfStateTuition + roomAndBoard + avgBookCost + miscExpenses;

  

  const incomeLevel = latest.cost.net_price.consumer.by_income_level
  const under30k = incomeLevel["0-30000"];
  const from30to48k = incomeLevel["30001-48000"];
  const from48to75k = incomeLevel["48001-75000"];
  const from75to110k = incomeLevel["750001-111000"];
  const over110k = incomeLevel["110001-plus"];

  const netPrice = latest.cost.avg_net_price;
  const schoolPrice = netPrice.overall;
  const medianPrice = netPrice.consumer.overall_median;

  const inStateAidApprox = inStateTotal - schoolPrice;
  const outOfStateAidApprox = outOfStateTotal - schoolPrice;

  const inStatePercent = inStateAidApprox / inStateTotal * 100;
  const outOfStatePercent = outOfStateAidApprox / outOfStateTotal * 100;

  const percentBorrowing = latest.aid.students_with_any_loan * 100;
  const studentWithLoans = (Number(numUndergrads) + Number(numGrads)) * (percentBorrowing/100);

  return(
    <div className="flex flex-col">
      <SchoolHeader name={name} city={city} state={state} school_url={school_url} numGrads={numGrads} numUndergrads={numUndergrads} schoolType={schoolType}/>
      <div className="pt-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-5xl font-extrabold text-blue-500">
          Cost Breakdown for {name}
        </h1>
        {/* TODO: toggle in/out of state, on/off campus*/}

        <h2 className="mt-10 italic text-2xl md:text-3xl font-extrabold text-blue-500">Total Cost</h2>
        
        <div className="grid grid-cols-2">
          <OverallCostChart tuition={outOfStateTuition} roomAndBoard={roomAndBoard} bookSupply={avgBookCost} additionalExpenses={miscExpenses}/>
          <div>
            <h3>Average Out of State Cost</h3>
            <p className="text-green-500">${outOfStateTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <OverallCostChart tuition={inStateTuition} roomAndBoard={roomAndBoard} bookSupply={avgBookCost} additionalExpenses={miscExpenses}/>
          <div>
            <h3>Average In State Cost</h3>
            <p className="text-green-500">${inStateTotal.toLocaleString()}</p>
          </div>
        </div>

        <h2 className="mt-10 italic text-2xl md:text-3xl font-extrabold text-blue-500">Student Aid</h2>
        <div className="grid grid-cols-2">
          <div>
            <h3>Average In-State Aid</h3>
            <p>${inStateAidApprox.toLocaleString()} covering about {inStatePercent.toFixed(1)}% of tuition.</p>
            <AidPieChart percentAid={inStatePercent}/>
          </div>

          <div>
           <h3>Average Out of State Aid</h3>
            <p>${outOfStateAidApprox.toLocaleString()} covering about {outOfStatePercent.toFixed(1)}% of tuition.</p>
            <AidPieChart percentAid={outOfStatePercent}/>
          </div>
        </div>
          <h3>Loans</h3>
          <p>About {percentBorrowing.toFixed(1)}% of students receive loans. That's roughly {studentWithLoans.toLocaleString()} students out of {(numGrads+numUndergrads).toLocaleString()}.</p>
          <LoanPieChart percentLoans={percentBorrowing}/>


        <h2 className="mt-10 italic text-2xl md:text-3xl font-extrabold text-blue-500">Net Price By Income Group</h2>
        <IncomeLevelChart under30K={under30k} from30To48K={from30to48k} from48To75K={from48to75k} from75To110K={from75to110k} over110K={over110k}/>

        <h2 className="mt-10 italic text-2xl md:text-3xl font-extrabold text-blue-500">Net Price vs. Median Price</h2>
        <NetMedianChart program={schoolPrice} median={medianPrice}/>
      </div>
    </div>
  )
}

