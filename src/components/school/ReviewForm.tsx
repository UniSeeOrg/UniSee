"use client"
import { useState } from "react";
import { createReview } from "@/lib/api/reviews";

import {Review} from "@/lib/types/reviews";
export default function ReviewForm({ closeForm, schoolId, authorId }: { closeForm: () => void, schoolId: string, authorId: string})
{
  const [form, setForm] = useState<Review>({
    title: "",
    content: "",
    rating: 0,
    academics: 0,
    social: 0,
    food: 0,
    housing: 0,
    career: 0,
    tags: [],
    major: "",
    authorId: authorId,    // TODO: fill in current user ID before submit
    schoolId: schoolId// TODO: fill in current school ID before submit
  });

  const handleChange = (field: string, value: unknown) => 
  {
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


  async function submit(e: React.FormEvent)
  {
    e.preventDefault();
    //Submit review
    try 
    {
      const newReview = await createReview(form);
      console.log("Review submitted:", newReview);
      alert("Review submitted successfully!");
      closeForm();
      // Refresh the page to show the new review
      window.location.reload();
    } catch (err) {
      console.error("Error submitting review:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to submit review. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  }
  return (
    <div className="fixed inset-0 text-gray-500 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <form onSubmit={submit}>
          <h2 className="text-xl font-bold mb-4">Leave a review</h2>
            <input type="text" placeholder="Title" className="w-full border px-2 py-1 rounded" value={form.title} onChange={e => handleChange('title', e.target.value)}/>
            <textarea placeholder="Review" className="w-full border px-2 py-1 rounded" value={form.content} onChange={e => handleChange('content', e.target.value)}></textarea>
            <div>
              {["rating","academics","social","food","housing","career"].map(f => (
                <input
                  className="w-full border px-2 py-1 rounded"
                  key={f}
                  type="number"
                  min={0}
                  max={5}
                  placeholder={f}
                  value={form[f as keyof Review] as number}  // now type-safe
                  onChange={e => handleChange(f as keyof Review, Number(e.target.value))}
                />
              ))}

              {["in-state","out-of-state","transfer","international"].map(t => (
                <label key={t}>
                  <input
                    type="checkbox"
                    checked={form.tags.includes(t)}
                    onChange={() => toggleTag(t)}
                  /> {t}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button type="submit" className="px-4 py-2 border rounded">Submit</button>
              <button type="button" onClick={closeForm} className="px-4 py-2 border rounded">Cancel</button>
            </div>
        </form>
      </div>
    </div>
  );
}
