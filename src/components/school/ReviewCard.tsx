"use client"
import { useState } from "react";
import { deleteReview } from "@/lib/api/reviews";
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
      console.log("deleted review:", id)
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
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
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="mb-3">

          {/* Edit and Delete functionality using onDelete callback from parent*/}
          {userEmail && author?.email === userEmail && (
            <div className="flex gap-2 mb-2">
              <button
                className="text-blue-600 text-sm hover:underline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="text-red-600 text-sm hover:underline"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {author && (
          <p className="text-sm text-gray-500">{author.name || author.email}</p>
        )}
      </div>

      {rating && (
        <div className="mb-2">
          <span className="text-lg">{renderStars(rating)}</span>
          <span className="text-sm text-gray-600 ml-2">Overall: {rating}/5</span>
        </div>
      )}

      <div className="mb-3">
        <p className="text-gray-700">{content}</p>
      </div>

      {(academics || social || food || housing || career) && (
        <div className="mb-3 text-sm">
          {academics && <div>Academics: {renderStars(academics)}</div>}
          {social && <div>Social: {renderStars(social)}</div>}
          {food && <div>Food: {renderStars(food)}</div>}
          {housing && <div>Housing: {renderStars(housing)}</div>}
          {career && <div>Career: {renderStars(career)}</div>}
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {major && (
        <div className="text-sm text-gray-600">
          Major: <span className="font-medium">{major}</span>
        </div>
      )}
    </div>
    </>
  );
}
