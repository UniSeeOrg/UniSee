"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/utils/supabaseAuth";

import { getReviews } from "@/lib/api/reviews";
import ReviewCard from "./ReviewCard";

interface Review {
  id: string; // Changed from bigint to string
  title: string;
  content: string;
  rating?: number;
  author?: {
    email: string;
    name?: string | null;
  };
  academics?: number;
  social?: number;
  food?: number;
  housing?: number;
  career?: number;
  tags?: string[];
  major?: string;
}

export default function ReviewsDisplay({ schoolId }: { schoolId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [majorFilter, setMajorFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);



  {/* Get current user for review deletion */}
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    const getUser = async () => {
      // Use the safe utility function that handles errors gracefully
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    getUser();
  }, []);

  // Debounce search query to avoid searching on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce major filter as well
  const [debouncedMajorFilter, setDebouncedMajorFilter] = useState<string>("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMajorFilter(majorFilter);
      setPage(1); // Reset to first page when filter changes
    }, 500);

    return () => clearTimeout(timer);
  }, [majorFilter]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviews(schoolId, { 
          sortBy, 
          minRating,
          major: debouncedMajorFilter || undefined,
          search: debouncedSearchQuery || undefined,
          page,
          limit: 10,
        });
        
        // Handle new API format with pagination
        if (data && typeof data === 'object' && 'reviews' in data) {
          setReviews(data.reviews);
          setPagination(data.pagination);
        } else if (Array.isArray(data)) {
          // Fallback for old API format
          setReviews(data);
          setPagination(null);
        } else if (data && typeof data === 'object' && 'error' in data) {
          // If the response has an error field, log it but don't crash
          console.error("Error in reviews response:", data.error);
          setReviews([]);
          setPagination(null);
        } else {
          console.error("Expected array or paginated object but got:", data);
          setReviews([]);
          setPagination(null);
        }
      } catch (error) {
        // Handle errors gracefully - don't show error to user, just log it
        console.error("Error fetching reviews:", error);
        setReviews([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [schoolId, sortBy, minRating, debouncedMajorFilter, debouncedSearchQuery, page]);

  // Client-side tag filtering
  useEffect(() => {
    let filtered = reviews;
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = reviews.filter((review) =>
        selectedTags.every((tag) => review.tags?.includes(tag))
      );
    }
    
    setFilteredReviews(filtered);
  }, [reviews, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Determine if we have active filters
  const hasActiveFilters = selectedTags.length > 0 || minRating !== undefined || majorFilter || searchQuery;

  if (loading && reviews.length === 0) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  // Show "no reviews" message only if there are truly no reviews and no filters
  if (reviews.length === 0 && !hasActiveFilters && (!pagination || pagination.totalCount === 0)) {
    return (
      <div className="text-center py-12 md:py-16">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-sm md:text-base text-gray-500 mb-4">
            Be the first to share your experience with this school!
          </p>
        </div>
      </div>
    );
  }

  const availableTags = ["in-state", "out-of-state", "transfer", "international"];

  {/* Automatically refreshes reviews without reloading page, listens for an eventChange in children components (reviewCard)*/}
  const handleReviewDelete = (deletedId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== deletedId));
    setFilteredReviews((prev) => prev.filter((r) => r.id !== deletedId));
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
          Reviews ({filteredReviews.length})
        </h2>
        
        {/* Sort Controls */}
        <div className="flex items-center gap-4">
          <label className="text-base font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-8 p-5 md:p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex flex-col gap-5">
          {/* Search Query */}
          <div>
            <label className="text-base font-semibold text-gray-800 mb-3 block">
              Search Reviews:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or content..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-500"
            />
            {searchQuery !== debouncedSearchQuery && (
              <p className="text-sm text-gray-500 mt-1">Searching...</p>
            )}
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-base font-semibold text-gray-800 mb-3 block">
              Minimum Rating:
            </label>
            <select
              value={minRating || ""}
              onChange={(e) => {
                setMinRating(e.target.value ? parseInt(e.target.value) : undefined);
                setPage(1); // Reset to first page on filter change
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
              <option value="1">1+ stars</option>
            </select>
          </div>

          {/* Major Filter */}
          <div>
            <label className="text-base font-semibold text-gray-800 mb-3 block">
              Filter by Major:
            </label>
            <input
              type="text"
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              placeholder="Enter major name (e.g., Computer Science)..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-500"
            />
            {majorFilter !== debouncedMajorFilter && (
              <p className="text-sm text-gray-500 mt-1">Filtering...</p>
            )}
            {majorFilter && (
              <p className="text-xs text-gray-500 mt-1">Note: Only reviews with specified majors will be shown</p>
            )}
          </div>

          {/* Tag Filters */}
          <div>
            <label className="text-base font-semibold text-gray-800 mb-3 block">
              Filter by Tags:
            </label>
            <div className="flex flex-wrap gap-3">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-base font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {(selectedTags.length > 0 || majorFilter || searchQuery || minRating) && (
            <button
              onClick={() => {
                setSelectedTags([]);
                setMinRating(undefined);
                setMajorFilter("");
                setDebouncedMajorFilter("");
                setSearchQuery("");
                setDebouncedSearchQuery("");
                setPage(1);
              }}
              className="mt-3 text-base text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews List */}

      {/* ReviewCard has some new props, onDelete callback method and user if logged in*/}
      {filteredReviews.length === 0 && (hasActiveFilters || pagination?.totalCount === 0) ? (
        <div className="text-center py-12 md:py-16">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              {hasActiveFilters ? "No reviews match your filters" : "No reviews yet"}
            </h3>
            <p className="text-sm md:text-base text-gray-500 mb-4">
              {hasActiveFilters 
                ? "Try adjusting your search criteria or clearing filters."
                : "Be the first to share your experience with this school!"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSelectedTags([]);
                  setMinRating(undefined);
                  setMajorFilter("");
                  setDebouncedMajorFilter("");
                  setSearchQuery("");
                  setDebouncedSearchQuery("");
                  setPage(1);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {loading && reviews.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              Updating reviews...
            </div>
          )}
          {filteredReviews.map((review) => (
            <ReviewCard userEmail={user?.email || null} key={review.id} {...review} onDelete={handleReviewDelete}/>
          ))}
          
          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPreviousPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.hasPreviousPage
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Previous
              </button>
              
              <span className="text-base text-gray-700">
                Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} reviews)
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.hasNextPage
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
