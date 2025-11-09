"use client"
import { useState } from "react";
import { deleteReview } from "@/lib/api/reviews";
import { useToast } from "@/components/ui/ToastContainer";
import EditReviewForm from "./EditReviewForm";

  {/* adding some new values to reviewcardprops*/}
interface ReviewCardProps {
  id: string;
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
  userEmail: string | null;
  onDelete: (deletedId: string) => void;
}

export default function ReviewCard({
  id,
  title,
  content,
  rating,
  author,
  academics,
  social,
  food,
  housing,
  career,
  tags,
  major,
  userEmail,
  onDelete,
}: ReviewCardProps) {
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const renderStars = (value?: number) => {
    if (!value) return null;
    return "⭐".repeat(value);
  };
  console.log(id)

  {/* wrapping onDelete callback from parent in async function */}
  async function handleDelete (){
    try {
      await deleteReview(parseInt(id));
      onDelete(id); 
      showSuccess("Review deleted successfully!");
      console.log("deleted review:", id)
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete review";
      showError(errorMessage);
    }
  };

  return (
    <>
      {isEditing ? (
        <EditReviewForm
          closeForm={() => setIsEditing(false)}
          reviewId={id}
          initialData={{
            title,
            content,
            rating,
            academics,
            social,
            food,
            housing,
            career,
            tags,
            major,
          }}
        />
      ) : null}
      <div className="bg-white border border-gray-200 rounded-lg p-5 md:p-7 mb-5 hover:shadow-md transition-shadow">
        <div className="mb-4">

          {/* Edit and Delete functionality using onDelete callback from parent*/}
          {userEmail && author?.email === userEmail && (
            <div className="flex gap-2 mb-3">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all"
                onClick={() => setIsEditing(true)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all"
                onClick={handleDelete}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        {author && (
          <p className="text-sm md:text-base text-gray-600 mb-3">{author.name || author.email}</p>
        )}
      </div>

      <div className="mb-4">
        <p className="text-base md:text-lg text-gray-800 leading-relaxed">{content}</p>
      </div>

      {rating && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-base font-semibold text-gray-800 min-w-[100px]">Overall:</span>
          <span className="text-xl">{renderStars(rating)}</span>
          <span className="text-base text-gray-700 font-medium">{rating}/5</span>
        </div>
      )}

      {(academics || social || food || housing || career) && (
        <div className="mb-4 space-y-3">
          {academics && (
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-800 min-w-[100px]">Academics:</span>
              <span className="text-xl">{renderStars(academics)}</span>
              <span className="text-base text-gray-700 font-medium">{academics}/5</span>
            </div>
          )}
          {social && (
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-800 min-w-[100px]">Social:</span>
              <span className="text-xl">{renderStars(social)}</span>
              <span className="text-base text-gray-700 font-medium">{social}/5</span>
            </div>
          )}
          {food && (
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-800 min-w-[100px]">Food:</span>
              <span className="text-xl">{renderStars(food)}</span>
              <span className="text-base text-gray-700 font-medium">{food}/5</span>
            </div>
          )}
          {housing && (
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-800 min-w-[100px]">Housing:</span>
              <span className="text-xl">{renderStars(housing)}</span>
              <span className="text-base text-gray-700 font-medium">{housing}/5</span>
            </div>
          )}
          {career && (
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-800 min-w-[100px]">Career:</span>
              <span className="text-xl">{renderStars(career)}</span>
              <span className="text-base text-gray-700 font-medium">{career}/5</span>
            </div>
          )}
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {major && (
        <div className="text-base text-gray-700">
          <span className="font-semibold">Major:</span> <span className="font-medium">{major}</span>
        </div>
      )}
    </div>
    </>
  );
}
