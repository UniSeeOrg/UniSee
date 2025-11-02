"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SchoolData } from "@/lib/types/schooldata";


export default function SearchBar() {
  const [search, onSearch] = useState<string>("");
  const [results, setResults] = useState<SchoolData[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=bb29Q304BgkotuPdvwfeF23deO8F93psi0F2sSC4&school.name=${search}&sort=latest.student.size:desc`
        );
        const data = await res.json();

        const filtered = (data.results || []).filter((s: SchoolData) => {
          const input = search.toLowerCase();
          const name = s.school.name.toLowerCase();
          const alias = (s.school.alias || "").toLowerCase();
          return name.includes(input) || alias.includes(input);
        });

        setResults(filtered);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="relative">
      <div className="bg-white rounded-xl py-3 px-6 shadow-lg">
        <input
          className="w-3/4 bg-transparent outline-none text-xl"
          type="text"
          placeholder="Start typing..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((school) => (
            <div key={school.id} className="px-4 py-2 hover:bg-gray-100" onClick={() => router.push(`/schools/${school.id}`)}>
              <div className="flex flex-row">
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 flex-shrink-0">
                  <Image
                    src={`https://logo.clearbit.com/${school.school.school_url || ""}`}
                    alt={school.school.name}
                    width={48}
                    height={48}
                    className="object-contain rounded-lg shadow-md"
                  />
                </div>
                <div className="flex flex-col px-4">
                  <p className="font-bold text-xl">{school.school.name}</p>
                  <p className="italic font-semibold text-sm">{school.school.city}, {school.school.state}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
