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
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <SchoolHeader name={name} city={city} state={state} school_url={school_url} numGrads={numGrads} numUndergrads={numUndergrads} schoolType={schoolType}/>
      <div className="pt-12 pb-20 px-4 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
        {/* TODO: toggle in/out of state, on/off campus*/}

        <div className="flex flex-row w-4xl mb-12 bg-white rounded-xl shadow-lg p-8">
          <OverallCostChart tuition={outOfStateTuition} roomAndBoard={roomAndBoard} bookSupply={avgBookCost} additionalExpenses={miscExpenses}/>
          <div className="flex flex-col justify-center items-center text-center w-1/4 pr-8">
            <h3 className="text-xl font-bold text-gray-700 ">Out of State Cost</h3>
            <p className="text-4xl font-bold text-green-600">${outOfStateTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-row w-4xl mb-12 bg-white rounded-xl shadow-lg p-8">
          <OverallCostChart tuition={inStateTuition} roomAndBoard={roomAndBoard} bookSupply={avgBookCost} additionalExpenses={miscExpenses}/>
          <div className="flex flex-col justify-center items-center text-center w-1/4 pr-8">
            <h3 className="text-xl font-bold text-gray-700">In State Cost</h3>
            <p className="text-4xl font-bold text-green-600">${inStateTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full m-8">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">Average In-State Aid</h3>
            <p className="text-lg text-gray-600 mb-6">${inStateAidApprox.toLocaleString()} covering about <span className="font-bold text-blue-600">{inStatePercent.toFixed(1)}%</span> of tuition.</p>
            <AidPieChart percentAid={inStatePercent}/>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">Average Out of State Aid</h3>
            <p className="text-lg text-gray-600 mb-6">${outOfStateAidApprox.toLocaleString()} covering about <span className="font-bold text-blue-600">{outOfStatePercent.toFixed(1)}%</span> of tuition.</p>
            <AidPieChart percentAid={outOfStatePercent}/>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center w-2xl m-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">Loans</h3>
          <p className="text-lg text-gray-600 mb-6 text-center ">About <span className="font-bold text-blue-600">{percentBorrowing.toFixed(1)}%</span> of students receive loans. That&apos;s roughly <span className="font-bold text-blue-600">{studentWithLoans.toLocaleString()}</span> students out of <span className="font-bold">{(numGrads+numUndergrads).toLocaleString()}</span>.</p>
          <LoanPieChart percentLoans={percentBorrowing}/>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center w-2xl m-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">Net Price by Income Group</h3>
          <IncomeLevelChart under30K={under30k} from30To48K={from30to48k} from48To75K={from48to75k} from75To110K={from75to110k} over110K={over110k}/>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center w-2xl m-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">Net Price vs. Median Price</h3>
          <NetMedianChart program={schoolPrice} median={medianPrice}/>
        </div>
      </div>
    </div>
  )
}

