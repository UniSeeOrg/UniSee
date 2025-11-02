"use client"
import { useState } from "react";
import { updateReview } from "@/lib/api/reviews";

import {Review} from "@/lib/types/reviews";

interface EditReviewFormProps {
  closeForm: () => void;
  reviewId: string;
  initialData: {
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
  };
}

export default function EditReviewForm({ closeForm, reviewId, initialData }: EditReviewFormProps) {
  const [form, setForm] = useState<Partial<Review>>({
    title: initialData.title,
    content: initialData.content,
    rating: initialData.rating || 0,
    academics: initialData.academics || 0,
    social: initialData.social || 0,
    food: initialData.food || 0,
    housing: initialData.housing || 0,
    career: initialData.career || 0,
    tags: initialData.tags || [],
    major: initialData.major || "",
  });

  const handleChange = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    const newTags = [...(form.tags || [])];
    if (newTags.includes(tag)) {
      const index = newTags.indexOf(tag);
      newTags.splice(index, 1);
    } else {
      newTags.push(tag);
    }
    setForm({ ...form, tags: newTags });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updatedReview = await updateReview(reviewId, form);
      console.log("Review updated:", updatedReview);
      alert("Review updated successfully!");
      closeForm();
      window.location.reload();
    } catch (err) {
      console.error("Error updating review:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update review. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  }

  return (
    <div className="fixed inset-0 text-gray-500 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={submit}>
          <h2 className="text-xl font-bold mb-4">Edit review</h2>
          <input 
            type="text" 
            placeholder="Title" 
            className="w-full border px-2 py-1 rounded mb-2" 
            value={form.title} 
            onChange={e => handleChange('title', e.target.value)}
          />
          <textarea 
            placeholder="Review" 
            className="w-full border px-2 py-1 rounded mb-2" 
            value={form.content} 
            onChange={e => handleChange('content', e.target.value)}
          />
          <div className="mb-2">
            {["rating","academics","social","food","housing","career"].map(f => (
              <input
                className="w-full border px-2 py-1 rounded mb-2"
                key={f}
                type="number"
                min={0}
                max={5}
                placeholder={f}
                value={form[f as keyof typeof form] as number || 0}
                onChange={e => handleChange(f, Number(e.target.value))}
              />
            ))}

            {["in-state","out-of-state","transfer","international"].map(t => (
              <label key={t} className="block mb-1">
                <input
                  type="checkbox"
                  checked={(form.tags || []).includes(t)}
                  onChange={() => toggleTag(t)}
                /> {t}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Save
            </button>
            <button type="button" onClick={closeForm} className="px-4 py-2 border rounded hover:bg-gray-100">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

