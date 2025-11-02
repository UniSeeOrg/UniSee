"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

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



  {/* Get current user for review deletion */}
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error || !user) {
          setUser(null);
          return;
        }
        setUser(user);
      } catch (err) {
        console.log('Auth check failed (user may not be logged in):', err);
        setUser(null);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(schoolId, { sortBy, minRating });
        // Ensure data is an array
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Expected array but got:", data);
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [schoolId, sortBy, minRating]);

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

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet. Be the first to leave a review!
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">
          Reviews ({filteredReviews.length})
        </h2>
        
        {/* Sort Controls */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col gap-4">
          {/* Rating Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Minimum Rating:
            </label>
            <select
              value={minRating || ""}
              onChange={(e) => setMinRating(e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
              <option value="1">1+ stars</option>
            </select>
          </div>

          {/* Tag Filters */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Filter by Tags:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews List */}

      {/* ReviewCard has some new props, onDelete callback method and user if logged in*/}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews match your filters. Try adjusting your search criteria.
        </div>
      ) : (
        filteredReviews.map((review) => (
          <ReviewCard userEmail={user?.email || null} key={review.id} {...review} onDelete={handleReviewDelete}/>
        ))
      )}
    </div>
  );
}
