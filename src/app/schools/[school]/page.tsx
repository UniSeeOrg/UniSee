import { fetchSchoolInfo, fetchSchoolIcon } from "./fetch"; // eslint-disable-line @typescript-eslint/no-unused-vars
import AddReviewSection from "@/components/school/AddReviewSection";
import ReviewsDisplay from "@/components/school/ReviewsDisplay";
import Image from "next/image";

export default async function SchoolPage({ params }: { params: Promise<{ school: string }> })
{
  const { school: slug } = await params;
  console.log(slug)
  const schoolInfo = await fetchSchoolInfo(slug)

  //TODO: 404 or error page 
  if(! schoolInfo)
  {
    return (<p>not found</p>)
  }


  const result = await schoolInfo.results?.[0]
  const school: { name: string; city: string; state: string; school_url: URL } = result.school;
  const latest = result.latest;
  const {name,city,state,school_url} : {name: string, city: string, state:string,school_url:URL}= school;
  const numUndergrads: number = latest.student.size;
  const numGrads :number = latest.student.grad_students;

  const avgNetCost:number = latest.cost.avg_net_price.overall;
  const totalCost:number = latest.cost.attendance.academic_year;
  const avgFinAid:number =  totalCost - avgNetCost;
  
  const acceptanceRate: string = `${(latest.admissions.admission_rate.overall * 100).toFixed(2)}%`;
  const graduationRate: string = `${(latest.completion.consumer_rate * 100).toFixed(2)}%`;

  const schoolType: string = latest.school.peps_ownership;
  const avgSatScore: number = latest.admissions.sat_scores.average.overall;
  const avgActScore: number = latest.admissions.act_scores.midpoint.cumulative;

  console.log(latest)
  console.log(latest.admissions)
  console.log(latest.academics)


  console.log(acceptanceRate)
  console.log(graduationRate)

  //for program info
//  for(let i: number = 0; i < latest.programs.cip_4_digit.length; i++)
//  {
//    console.log(latest.programs.cip_4_digit[i])
//  }


  //TODO: fetch school uuid from db (later integration)
  const schoolId = "31862546-fe57-4e3e-801c-4a16f9acfabb"
  //Log school info if shit gets messy
  console.log(latest.student.size)


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* School Logo */}
            <div className="flex-shrink-0">
              <Image 
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg shadow-md object-contain bg-gray-100" 
                src={`https://logo.clearbit.com/${school_url}`}
                alt={`${name} logo`}
                width={96}
                height={96}
              />
            </div>
            
            {/* School Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{name}</h1>
              <p className="text-lg text-gray-600 mb-4">{city}, {state}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {numUndergrads.toLocaleString()} Undergraduates
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {numGrads.toLocaleString()} Graduates
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  {(numUndergrads + numGrads).toLocaleString()} Total Students
                </span>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  {schoolType} University
                </span>
              </div>
            </div>
            
            {/* Visit Website Button */}
            <div className="flex-shrink-0">
              <a 
                href={`https://${school_url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Visit Website
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - School Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">School Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</h3>
                  <p className="mt-1 text-lg text-gray-900">{city}, {state}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Website</h3>
                  <a 
                    href={`https://${school_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-lg text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {school_url.toString().replace('https://', '')}
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Undergraduate Enrollment</h3>
                  <p className="mt-1 text-lg text-gray-900">{numUndergrads.toLocaleString()} students</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Graduate Enrollment</h3>
                  <p className="mt-1 text-lg text-gray-900">{numGrads.toLocaleString()} students</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Acceptance Rate</h3>
                  <p className="mt-1 text-lg text-gray-900">{acceptanceRate}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Graduation Rate</h3>
                  <p className="mt-1 text-lg text-gray-900">{graduationRate}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Average Cost</h3>
                  <p className="mt-1 text-lg text-gray-900">${avgNetCost.toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Average Aid</h3>
                  <p className="mt-1 text-lg text-gray-900">${avgFinAid.toLocaleString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Average SAT Score</h3>
                  <p className="mt-1 text-lg text-gray-900">{avgSatScore}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Average ACT Score</h3>
                  <p className="mt-1 text-lg text-gray-900">{avgActScore}</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsDisplay schoolId={schoolId} />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <AddReviewSection schoolId={schoolId} />
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Add to Favorites
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Compare Schools
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Want to share your experience? Reviews help other students make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

