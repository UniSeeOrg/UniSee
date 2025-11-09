import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
          UniSee
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8">
          Unbiased, student-verified reviews of colleges. 
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          For students, by students.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="p-4 md:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-base md:text-lg font-semibold mb-2">Verified Reviews</h3>
            <p className="text-sm md:text-base text-gray-600">All reviews are verified through .edu email addresses</p>
          </div>
          <div className="p-4 md:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-base md:text-lg font-semibold mb-2">Structured Insights</h3>
            <p className="text-sm md:text-base text-gray-600">Comprehensive ratings across academics, social life, and more</p>
          </div>
          <div className="p-4 md:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-base md:text-lg font-semibold mb-2">Context Matters</h3>
            <p className="text-sm md:text-base text-gray-600">Filter reviews by your situation: in-state, transfer, athlete, etc.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
          <Link 
            href="/schools" 
            className="w-full sm:w-auto bg-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Browse Schools
          </Link>
          <span className="w-full sm:w-auto border border-gray-300 text-gray-500 px-6 md:px-8 py-2 md:py-3 rounded-lg text-center text-sm md:text-base">
            Write a Review (Coming Soon)
          </span>
        </div>
      </div>
    </div>
  );
}
