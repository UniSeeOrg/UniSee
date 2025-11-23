"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyReviews } from "@/lib/api/reviews";
import { deleteReview } from "@/lib/api/reviews";
import { getCurrentUser } from "@/lib/utils/supabaseAuth";
import { useToast } from "@/components/ui/ToastContainer";
import EditReviewForm from "@/components/school/EditReviewForm";
import ReviewCard from "@/components/school/ReviewCard";

interface MyReview {
  id: string;
  title: string;
  content: string;
  rating?: number;
  academics?: number;
  social?: number;
  food?: number;
  housing?: number;
  career?: number;
  tags?: string[];
  major?: string;
  school: {
    id: string;
    name: string;
    city?: string | null;
    state?: string | null;
    external_id?: string | null;
  };
}

export default function MyReviewsPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/account");
          return;
        }
        setUserEmail(currentUser.email || null);

        const data = await getMyReviews({ sortBy, page, limit: 10 });
        
        if (data && typeof data === 'object' && 'reviews' in data) {
          setReviews(data.reviews);
          setPagination(data.pagination);
        } else {
          setReviews([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching my reviews:", error);
        showError("Failed to load your reviews. Please try again.");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy, page, router, showError]);

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview(parseInt(reviewId));
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showSuccess("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      showError("Failed to delete review. Please try again.");
    }
  };

  const handleEditComplete = () => {
    setEditingReview(null);
    // Refresh reviews after editing
    const fetchData = async () => {
      try {
        const data = await getMyReviews({ sortBy, page, limit: 10 });
        if (data && typeof data === 'object' && 'reviews' in data) {
          setReviews(data.reviews);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error refreshing reviews:", error);
      }
    };
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading your reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
              <Link
                href="/account"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Account
              </Link>
            </div>
            
            {/* Stats */}
            {pagination && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-700">Total Reviews</span>
                  <span className="text-3xl font-bold text-blue-600">{pagination.totalCount}</span>
                </div>
              </div>
            )}

            {/* Sort Controls */}
            {reviews.length > 0 && (
              <div className="mt-4 flex items-center gap-4">
                <label className="text-base font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as typeof sortBy);
                    setPage(1);
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            )}
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start sharing your college experience by writing your first review!
              </p>
              <Link
                href="/schools"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Schools
              </Link>
            </div>
          ) : (
            <>
              {reviews.map((review) => (
                <div key={review.id} className="mb-6">
                  {editingReview === review.id ? (
                    <EditReviewForm
                      closeForm={() => {
                        setEditingReview(null);
                        handleEditComplete();
                      }}
                      reviewId={review.id}
                      initialData={{
                        title: review.title,
                        content: review.content,
                        rating: review.rating,
                        academics: review.academics,
                        social: review.social,
                        food: review.food,
                        housing: review.housing,
                        career: review.career,
                        tags: review.tags,
                        major: review.major,
                      }}
                    />
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      {/* School Info */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <Link
                          href={`/schools/${review.school.external_id || review.school.id}`}
                          className="text-xl font-bold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {review.school.name}
                        </Link>
                        {review.school.city && review.school.state && (
                          <p className="text-sm text-gray-600 mt-1">
                            {review.school.city}, {review.school.state}
                          </p>
                        )}
                      </div>

                      {/* Review Card */}
                      <ReviewCard
                        id={review.id}
                        title={review.title}
                        content={review.content}
                        rating={review.rating}
                        academics={review.academics}
                        social={review.social}
                        food={review.food}
                        housing={review.housing}
                        career={review.career}
                        tags={review.tags}
                        major={review.major}
                        author={userEmail ? { email: userEmail } : undefined}
                        userEmail={userEmail}
                        onDelete={handleDelete}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
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
                    Page {pagination.page} of {pagination.totalPages}
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
      </div>
    </div>
  );
}

