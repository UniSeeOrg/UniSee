"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { SchoolData } from "@/lib/types/schooldata";
import { getLogoUrl, getPlaceholderLogoUrl } from "@/lib/utils/logos";

interface SchoolSelectorProps {
  onSelect: (schoolId: string, schoolName: string) => void;
  placeholder?: string;
  selectedSchoolId?: string | null;
}

export default function SchoolSelector({ 
  onSelect, 
  placeholder = "Search for a school...",
  selectedSchoolId 
}: SchoolSelectorProps) {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<SchoolData[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<{ id: string; name: string; logo_url?: string } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  // Initialize from prop if provided
  useEffect(() => {
    if (selectedSchoolId && !selectedSchool) {
      // Try to find in results first, otherwise we'll need to fetch
      const found = results.find(s => s.id === selectedSchoolId);
      if (found) {
        setSelectedSchool({
          id: found.id,
          name: found.school.name,
          logo_url: found.school.school_url,
        });
        setSearch(found.school.name);
      }
    } else if (!selectedSchoolId && selectedSchool) {
      // Clear if prop was cleared
      setSelectedSchool(null);
      setSearch("");
    }
  }, [selectedSchoolId, results]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!search || search.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY;
        if (!apiKey) {
          console.error("COLLEGE_SCORECARD_API_KEY is not configured");
          return;
        }
        const res = await fetch(
          `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${apiKey}&school.name=${search}&sort=latest.student.size:desc&per_page=10`
        );
        const data = await res.json();

        const filtered = (data.results || []).filter((s: SchoolData) => {
          const input = search.toLowerCase();
          const name = s.school.name.toLowerCase();
          const alias = (s.school.alias || "").toLowerCase();
          return name.includes(input) || alias.includes(input);
        });

        setResults(filtered);
        setShowResults(filtered.length > 0);
      } catch (err) {
        console.error(err);
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSchoolClick = (school: SchoolData) => {
    setSelectedSchool({ 
      id: school.id, 
      name: school.school.name,
      logo_url: school.school.school_url,
    });
    setSearch(school.school.name);
    setShowResults(false);
    onSelect(school.id, school.school.name);
  };

  const handleRemove = () => {
    setSelectedSchool(null);
    setSearch("");
    onSelect("", "");
  };

  if (selectedSchool) {
    const logoErrorKey = `selected-${selectedSchool.id}`;
    const logoError = logoErrors[logoErrorKey] || false;
    const logoSrc = logoError 
      ? getPlaceholderLogoUrl(selectedSchool.name)
      : getLogoUrl(selectedSchool.logo_url, selectedSchool.name);

    return (
      <div className="w-full p-4 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg overflow-hidden">
            <Image
              src={logoSrc}
              alt={selectedSchool.name}
              width={40}
              height={40}
              className="object-contain rounded-lg"
              onError={() => setLogoErrors(prev => ({ ...prev, [logoErrorKey]: true }))}
              unoptimized={logoError}
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{selectedSchool.name}</p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800 font-medium"
          aria-label="Remove school"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <input
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShowResults(results.length > 0)}
      />
      
      {showResults && results.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-lg max-h-64 overflow-auto border-2 border-gray-200">
          {results.map((school) => {
            const logoErrorKey = `result-${school.id}`;
            const logoError = logoErrors[logoErrorKey] || false;
            const logoSrc = logoError 
              ? getPlaceholderLogoUrl(school.school.name)
              : getLogoUrl(school.school.school_url, school.school.name);

            return (
              <div
                key={school.id}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                onClick={() => handleSchoolClick(school)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src={logoSrc}
                      alt={school.school.name}
                      width={48}
                      height={48}
                      className="object-contain rounded-lg"
                      onError={() => setLogoErrors(prev => ({ ...prev, [logoErrorKey]: true }))}
                      unoptimized={logoError}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{school.school.name}</p>
                    <p className="text-sm text-gray-600">{school.school.city}, {school.school.state}</p>
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
