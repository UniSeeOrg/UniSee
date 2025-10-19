import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          UniSee
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Unbiased, student-verified reviews of colleges. 
          <br />
          For students, by students.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Verified Reviews</h3>
            <p className="text-gray-600">All reviews are verified through .edu email addresses</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Structured Insights</h3>
            <p className="text-gray-600">Comprehensive ratings across academics, social life, and more</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Context Matters</h3>
            <p className="text-gray-600">Filter reviews by your situation: in-state, transfer, athlete, etc.</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link 
            href="/schools" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Schools
          </Link>
          <span className="border border-gray-300 text-gray-500 px-8 py-3 rounded-lg">
            Write a Review (Coming Soon)
          </span>
        </div>
      </div>
    </div>
  );
}
