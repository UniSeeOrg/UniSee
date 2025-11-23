"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/ToastContainer";
import SchoolSelector from "@/components/compare/SchoolSelector";
import { getLogoUrl, getPlaceholderLogoUrl } from "@/lib/utils/logos";

interface SchoolComparisonData {
  id: string;
  name: string;
  city?: string;
  state?: string;
  school_url?: string;
  tuition_in_state?: number;
  tuition_out_state?: number;
  avg_net_cost?: number;
  avg_fin_aid?: number;
  acceptance_rate?: number;
  graduation_rate?: number;
  sat_score?: number;
  act_score?: number;
  student_size?: number;
  grad_students?: number;
  review_stats?: {
    totalReviews: number;
    averages: {
      overall: number | null;
      academics: number | null;
      social: number | null;
      food: number | null;
      housing: number | null;
      career: number | null;
    };
  };
}

interface SelectedSchool {
  id: string;
  name: string;
}

export default function CompareSchoolsPage() {
  const searchParams = useSearchParams();
  const { showError } = useToast();
  const [selectedSchools, setSelectedSchools] = useState<SelectedSchool[]>([]);
  const [schoolData, setSchoolData] = useState<SchoolComparisonData[]>([]);
  const [loading, setLoading] = useState(false);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  // Check if there's a school ID in query params (from "Compare Schools" button)
  useEffect(() => {
    const schoolId = searchParams.get("school");
    if (schoolId && selectedSchools.length === 0) {
      // We need to fetch the school name first
      fetchSchoolName(schoolId).then((name) => {
        if (name) {
          setSelectedSchools([{ id: schoolId, name }]);
        }
      });
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSchoolName = async (schoolId: string): Promise<string | null> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY;
      if (!apiKey) return null;
      
      const res = await fetch(
        `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${apiKey}&id=${schoolId}`
      );
      const data = await res.json();
      return data.results?.[0]?.school?.name || null;
    } catch {
      return null;
    }
  };

  const handleSchoolSelect = (index: number, schoolId: string, schoolName: string) => {
    if (!schoolId) {
      // Remove school
      const newSelected = [...selectedSchools];
      newSelected.splice(index, 1);
      setSelectedSchools(newSelected);
      return;
    }

    // Check if school is already selected
    if (selectedSchools.some(s => s.id === schoolId)) {
      showError("This school is already in the comparison");
      return;
    }

    const newSelected = [...selectedSchools];
    if (newSelected[index]) {
      newSelected[index] = { id: schoolId, name: schoolName };
    } else {
      newSelected.push({ id: schoolId, name: schoolName });
    }
    setSelectedSchools(newSelected);
  };

  const handleCompare = async () => {
    if (selectedSchools.length < 2) {
      showError("Please select at least 2 schools to compare");
      return;
    }

    if (selectedSchools.length > 4) {
      showError("Maximum 4 schools can be compared");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/schools/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolIds: selectedSchools.map(s => s.id),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch comparison data");
      }

      const data = await response.json();
      setSchoolData(data.schools || []);
    } catch (error) {
      console.error("Error comparing schools:", error);
      showError(error instanceof Error ? error.message : "Failed to compare schools");
      setSchoolData([]);
    } finally {
      setLoading(false);
    }
  };

  const removeSchool = (index: number) => {
    const newSelected = [...selectedSchools];
    newSelected.splice(index, 1);
    setSelectedSchools(newSelected);
    setSchoolData([]); // Clear comparison when removing schools
  };

  const formatCurrency = (value?: number) => {
    if (value === null || value === undefined) return "N/A";
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value?: number) => {
    if (value === null || value === undefined) return "N/A";
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Compare Schools</h1>
              <Link
                href="/schools"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Browse
              </Link>
            </div>
            <p className="text-gray-600">
              Select 2-4 schools to compare key metrics, costs, and student reviews side-by-side.
            </p>
          </div>

          {/* School Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Schools to Compare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[0, 1, 2, 3].map((index) => (
                <SchoolSelector
                  key={index}
                  onSelect={(id, name) => handleSchoolSelect(index, id, name)}
                  placeholder={`School ${index + 1}`}
                  selectedSchoolId={selectedSchools[index]?.id || null}
                />
              ))}
            </div>
            
            {selectedSchools.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="text-sm text-gray-600">Selected:</span>
                {selectedSchools.map((school, index) => (
                  <span
                    key={school.id}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {school.name}
                    <button
                      onClick={() => removeSchool(index)}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label={`Remove ${school.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleCompare}
              disabled={selectedSchools.length < 2 || loading}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Comparing..." : "Compare Schools"}
            </button>
          </div>

          {/* Comparison Table */}
          {schoolData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">
                        Metric
                      </th>
                      {schoolData.map((school) => {
                        const logoErrorKey = `compare-${school.id}`;
                        const logoError = logoErrors[logoErrorKey] || false;
                        const logoSrc = logoError 
                          ? getPlaceholderLogoUrl(school.name)
                          : getLogoUrl(school.school_url, school.name);

                        return (
                          <th key={school.id} className="px-6 py-4 text-center min-w-[200px]">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg overflow-hidden mb-2">
                                <Image
                                  src={logoSrc}
                                  alt={school.name}
                                  width={48}
                                  height={48}
                                  className="rounded-lg object-contain"
                                  onError={() => setLogoErrors(prev => ({ ...prev, [logoErrorKey]: true }))}
                                  unoptimized={logoError}
                                />
                              </div>
                              <Link
                                href={`/schools/${school.id}`}
                                className="font-bold text-gray-900 hover:text-blue-600 hover:underline"
                              >
                                {school.name}
                              </Link>
                              {school.city && school.state && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {school.city}, {school.state}
                                </p>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Location */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                        Location
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {school.city && school.state 
                            ? `${school.city}, ${school.state}`
                            : "N/A"}
                        </td>
                      ))}
                    </tr>

                    {/* Tuition - Out of State */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50">
                        Tuition (Out-of-State)
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {formatCurrency(school.tuition_out_state)}
                        </td>
                      ))}
                    </tr>

                    {/* Tuition - In State */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                        Tuition (In-State)
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {formatCurrency(school.tuition_in_state)}
                        </td>
                      ))}
                    </tr>

                    {/* Average Net Cost */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50">
                        Average Net Cost
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {formatCurrency(school.avg_net_cost)}
                        </td>
                      ))}
                    </tr>

                    {/* Average Financial Aid */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                        Average Financial Aid
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {formatCurrency(school.avg_fin_aid)}
                        </td>
                      ))}
                    </tr>

                    {/* Acceptance Rate */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50">
                        Acceptance Rate
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {formatPercentage(school.acceptance_rate)}
                        </td>
                      ))}
                    </tr>

                    {/* Graduation Rate */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                        Graduation Rate
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {formatPercentage(school.graduation_rate)}
                        </td>
                      ))}
                    </tr>

                    {/* SAT Score */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50">
                        Average SAT Score
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {school.sat_score || "N/A"}
                        </td>
                      ))}
                    </tr>

                    {/* ACT Score */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                        Average ACT Score
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {school.act_score || "N/A"}
                        </td>
                      ))}
                    </tr>

                    {/* Student Size */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50">
                        Undergraduate Enrollment
                      </td>
                      {schoolData.map((school) => (
                        <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {school.student_size?.toLocaleString() || "N/A"}
                        </td>
                      ))}
                    </tr>

                    {/* Review Ratings Section */}
                    {schoolData.some(s => s.review_stats) && (
                      <>
                        <tr className="bg-blue-50">
                          <td colSpan={schoolData.length + 1} className="px-6 py-3 text-sm font-bold text-gray-900">
                            Review Ratings
                          </td>
                        </tr>

                        {/* Overall Rating */}
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white pl-8">
                            • Overall Rating
                          </td>
                          {schoolData.map((school) => (
                            <td key={school.id} className="px-6 py-4 text-center">
                              {school.review_stats?.averages.overall ? (
                                <div className="flex flex-col items-center">
                                  <div className="text-lg font-semibold text-gray-900">
                                    {school.review_stats.averages.overall.toFixed(1)}/5.0
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    ({school.review_stats.totalReviews} reviews)
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">No reviews</span>
                              )}
                            </td>
                          ))}
                        </tr>

                        {/* Academics */}
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 pl-8">
                            • Academics
                          </td>
                          {schoolData.map((school) => (
                            <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                              {school.review_stats?.averages.academics 
                                ? `${school.review_stats.averages.academics.toFixed(1)}/5.0`
                                : "N/A"}
                            </td>
                          ))}
                        </tr>

                        {/* Social */}
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white pl-8">
                            • Social Life
                          </td>
                          {schoolData.map((school) => (
                            <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                              {school.review_stats?.averages.social 
                                ? `${school.review_stats.averages.social.toFixed(1)}/5.0`
                                : "N/A"}
                            </td>
                          ))}
                        </tr>

                        {/* Food */}
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 pl-8">
                            • Food & Dining
                          </td>
                          {schoolData.map((school) => (
                            <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                              {school.review_stats?.averages.food 
                                ? `${school.review_stats.averages.food.toFixed(1)}/5.0`
                                : "N/A"}
                            </td>
                          ))}
                        </tr>

                        {/* Housing */}
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white pl-8">
                            • Housing
                          </td>
                          {schoolData.map((school) => (
                            <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                              {school.review_stats?.averages.housing 
                                ? `${school.review_stats.averages.housing.toFixed(1)}/5.0`
                                : "N/A"}
                            </td>
                          ))}
                        </tr>

                        {/* Career */}
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 pl-8">
                            • Career Support
                          </td>
                          {schoolData.map((school) => (
                            <td key={school.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                              {school.review_stats?.averages.career 
                                ? `${school.review_stats.averages.career.toFixed(1)}/5.0`
                                : "N/A"}
                            </td>
                          ))}
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {schoolData.length === 0 && !loading && selectedSchools.length >= 2 && (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <p className="text-gray-600">Click &quot;Compare Schools&quot; to see the comparison</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
