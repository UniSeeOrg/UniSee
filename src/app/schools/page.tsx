import SearchBar from "@/components/search/SearchBar";

export default function SchoolsPage() {

  return (
    <div className = "w-full flex items-center justify-center h-screen text-black bg-gray-200">
      <div className = "flex flex-col w-1/2">
        <div className = "flex items-center justify-around text-6xl mb-10">
          <h1 className= "text-shadow-md font-semi-bold text-black/70">School Search</h1>
        </div>
        <SearchBar/>
      </div>
    </div>
  );
}
