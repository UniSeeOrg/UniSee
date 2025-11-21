"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SchoolStats {
  totalReviews: number;
  averages: {
    overall: number | null;
    academics: number | null;
    social: number | null;
    food: number | null;
    housing: number | null;
    career: number | null;
  };
  counts: {
    overall: number;
    academics: number;
    social: number;
    food: number;
    housing: number;
    career: number;
  };
}

interface SchoolStatsDashboardProps {
  schoolId: string;
}

export default function SchoolStatsDashboard({ schoolId }: SchoolStatsDashboardProps) {
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/reviews/stats?schoolId=${schoolId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching school stats:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchStats();
    }
  }, [schoolId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-4">Loading statistics...</div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">School Statistics</h2>
        <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = [
    { name: "Overall", value: stats.averages.overall, count: stats.counts.overall },
    { name: "Academics", value: stats.averages.academics, count: stats.counts.academics },
    { name: "Social", value: stats.averages.social, count: stats.counts.social },
    { name: "Food", value: stats.averages.food, count: stats.counts.food },
    { name: "Housing", value: stats.averages.housing, count: stats.counts.housing },
    { name: "Career", value: stats.averages.career, count: stats.counts.career },
  ].filter((item) => item.value !== null);

  // Color function based on rating value
  const getColor = (value: number | null): string => {
    if (value === null) return "#9CA3AF";
    if (value >= 4.5) return "#10B981"; // green
    if (value >= 3.5) return "#3B82F6"; // blue
    if (value >= 2.5) return "#F59E0B"; // amber
    return "#EF4444"; // red
  };

  const renderStars = (rating: number | null) => {
    if (rating === null) return "N/A";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <defs>
                  <clipPath id={`half-${i}`}>
                    <rect x="0" y="0" width="10" height="20" />
                  </clipPath>
                </defs>
                <path
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  clipPath={`url(#half-${i})`}
                />
              </svg>
            );
          } else {
            return (
              <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            );
          }
        })}
        <span className="ml-2 text-gray-700 font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">School Statistics</h2>
      
      {/* Total Reviews */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">Total Reviews</span>
          <span className="text-3xl font-bold text-blue-600">{stats.totalReviews}</span>
        </div>
      </div>

      {/* Overall Rating */}
      {stats.averages.overall !== null && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-900">Overall Rating</span>
          </div>
          {renderStars(stats.averages.overall)}
          <p className="text-sm text-gray-500 mt-2">Based on {stats.counts.overall} review{stats.counts.overall !== 1 ? "s" : ""}</p>
        </div>
      )}

      {/* Category Ratings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Ratings by Category</h3>
        <div className="space-y-3">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-medium text-gray-700">{item.name}</span>
                  {item.value !== null && (
                    <span className="text-base font-semibold text-gray-900">{item.value.toFixed(1)}/5.0</span>
                  )}
                </div>
                {item.value !== null && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.value / 5) * 100}%`,
                        backgroundColor: getColor(item.value),
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">{item.count} review{item.count !== 1 ? "s" : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}/5.0`, "Average Rating"]}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

