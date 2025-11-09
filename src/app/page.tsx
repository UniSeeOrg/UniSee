import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
              UniSee
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium mb-3">
            See It Like a Student.
            </p>
            <p className="text-lg md:text-xl text-gray-600">
            Unbiased reviews. Complete coverage.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 md:mb-20">
            <Link 
              href="/schools" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-semibold text-center"
            >
              Browse Schools
            </Link>
            <Link
              href="/account"
              className="w-full sm:w-auto bg-white text-blue-600 px-8 md:px-10 py-4 md:py-5 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-md hover:shadow-lg text-lg font-semibold text-center"
            >
              Get Started
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Verified Reviews</h3>
              <p className="text-gray-600 leading-relaxed">All reviews are verified through .edu email addresses for authentic student experiences</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Structured Insights</h3>
              <p className="text-gray-600 leading-relaxed">Comprehensive ratings across academics, social life, food, housing, and career support</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Context Matters</h3>
              <p className="text-gray-600 leading-relaxed">Filter reviews by your situation: in-state, out-of-state, transfer, international, and more</p>
            </div>
          </div>

          {/* Stats or Additional Info */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <p className="text-gray-500 text-sm md:text-base">
              Join thousands of students sharing their college experiences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
