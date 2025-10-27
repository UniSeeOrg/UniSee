"use client";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(schoolId);
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
  }, [schoolId]);

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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Reviews ({reviews.length})
      </h2>
      {reviews.map((review) => (
        <ReviewCard key={review.id} {...review} />
      ))}
    </div>
  );
}
