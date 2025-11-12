import Image from "next/image";
interface SchoolInfo 
{
  name: string;
  school_url: URL;
  city: string;
  state: string;
  numUndergrads: string;
  numGrads: string;
  schoolType: string;

}
export default function SchoolHeader({name, school_url,city,state, numUndergrads,numGrads,schoolType} : SchoolInfo){

  return (
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
                  {numUndergrads?.toLocaleString()} Undergraduates
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {numGrads?.toLocaleString()} Graduates
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  {(numUndergrads + numGrads)?.toLocaleString()} Total Students
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
  )
}
