import SearchBar from "@/components/search/SearchBar";

export default function SchoolsPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-12 md:py-20 text-black bg-gray-50">
      <div className="flex flex-col w-full max-w-2xl">
        <div className="flex items-center justify-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 text-center">
            School Search
          </h1>
        </div>
        <SearchBar/>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Start typing to search for colleges and universities
          </p>
        </div>
      </div>
    </div>
  );
}
