"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SchoolData } from "@/lib/types/schooldata";
import { getLogoUrl, getPlaceholderLogoUrl } from "@/lib/utils/logos";

const US_STATES = [
  { value: "", label: "All States" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

export default function SearchBar() {
  const [search, onSearch] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [results, setResults] = useState<SchoolData[]>([]);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY;
        if (!apiKey) {
          console.error("COLLEGE_SCORECARD_API_KEY is not configured");
          setResults([]);
          return;
        }

        // Encode the search query to handle special characters
        const encodedSearch = encodeURIComponent(search);
        const res = await fetch(
          `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${apiKey}&school.name=${encodedSearch}&sort=latest.student.size:desc&per_page=20`
        );

        // Check if response is OK and content-type is JSON
        if (!res.ok) {
          console.error(`API error: ${res.status} ${res.statusText}`);
          setResults([]);
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("API returned non-JSON response");
          setResults([]);
          return;
        }

        const data = await res.json();

        // Check if data has results array
        if (!data || !Array.isArray(data.results)) {
          setResults([]);
          return;
        }

        let filtered = (data.results || []).filter((s: SchoolData) => {
          const input = search.toLowerCase();
          const name = s.school.name.toLowerCase();
          const alias = (s.school.alias || "").toLowerCase();
          return name.includes(input) || alias.includes(input);
        });

        // Filter by state if selected
        if (selectedState) {
          filtered = filtered.filter((s: SchoolData) => s.school.state === selectedState);
        }

        setResults(filtered);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setResults([]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [search, selectedState]);

  return (
    <div className="relative w-full">
      {/* State Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by State:
        </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {US_STATES.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl py-3 px-4 md:px-6 shadow-lg w-full">
        <input
          className="w-full bg-transparent outline-none text-base md:text-xl"
          type="text"
          placeholder="Start typing school name..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
          {results.map((school) => {
            const logoErrorKey = `search-${school.id}`;
            const logoError = logoErrors[logoErrorKey] || false;
            const logoSrc = logoError 
              ? getPlaceholderLogoUrl(school.school.name)
              : getLogoUrl(school.school.school_url, school.school.name);

            return (
              <div key={school.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => router.push(`/schools/${school.id}`)}>
                <div className="flex flex-row">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={logoSrc}
                      alt={school.school.name}
                      width={48}
                      height={48}
                      className="object-contain rounded-lg shadow-md"
                      onError={() => setLogoErrors(prev => ({ ...prev, [logoErrorKey]: true }))}
                      unoptimized={logoError}
                    />
                  </div>
                  <div className="flex flex-col px-3 md:px-4 min-w-0 flex-1">
                    <p className="font-bold text-base md:text-xl truncate">{school.school.name}</p>
                    <p className="italic font-semibold text-xs md:text-sm text-gray-600">{school.school.city}, {school.school.state}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
