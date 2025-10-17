import SearchBar from "@/components/search/SearchBar";

export default function SchoolsPage() {

  return (
    <div className = "w-full flex items-center justify-center h-screen text-black bg-gray-200">
      <div className = "flex flex-col">
        <h1 className = "text-5xl">Browse Schools</h1>
        <SearchBar/>
      </div>
      {/* School listing will go here */}
    </div>
  );
}
