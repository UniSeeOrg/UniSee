"use client"
import { useState, useEffect } from "react";
import { createReview } from "@/lib/api/reviews";
import { useToast } from "@/components/ui/ToastContainer";
import { getCurrentUser } from "@/lib/utils/supabaseAuth";
import { supabaseClient } from "@/lib/supabase/client";

import {Review} from "@/lib/types/reviews";
export default function ReviewForm({ closeForm, schoolId, authorId }: { closeForm: () => void, schoolId: string, authorId: string})
{
  const { showSuccess, showError } = useToast();
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
    authorId: authorId,
    schoolId: schoolId
  });

  // Fetch user's major and pre-fill the form
  useEffect(() => {
    const fetchUserMajor = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.id) {
          const { data, error } = await supabaseClient
            .from('User')
            .select('major')
            .eq('auth_id', currentUser.id)
            .single();
          
          if (!error && data?.major) {
            setForm(prev => ({ ...prev, major: data.major }));
          }
        }
      } catch (error) {
        // Silently fail - user can still enter major manually
        console.log('Could not fetch user major:', error);
      }
    };

    fetchUserMajor();
  }, []);

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
      showSuccess("Review submitted successfully!");
      closeForm();
      // Refresh the page to show the new review
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Give time for toast to show
    } catch (err) {
      console.error("Error submitting review:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to submit review. Please try again.";
      showError(errorMessage);
    }
  }
  const ratingCategories = [
    { key: 'rating', label: 'Overall Rating', description: 'Your overall experience' },
    { key: 'academics', label: 'Academics', description: 'Quality of education and courses' },
    { key: 'social', label: 'Social Life', description: 'Campus social scene and activities' },
    { key: 'food', label: 'Food & Dining', description: 'Campus dining options and quality' },
    { key: 'housing', label: 'Housing', description: 'Dorm quality and housing options' },
    { key: 'career', label: 'Career Support', description: 'Job placement and career services' },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={submit} className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Leave a Review</h2>
            <button
              type="button"
              onClick={closeForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Give your review a title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                placeholder="Share your experience at this school..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none shadow-sm hover:border-gray-300"
                value={form.content}
                onChange={e => handleChange('content', e.target.value)}
                required
              />
            </div>

            {/* Ratings Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Ratings</h3>
              <p className="text-sm text-gray-500 mb-4">Rate 1-5 stars (all optional)</p>
              <div className="space-y-4">
                {ratingCategories.map(({ key, label, description }) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <label htmlFor={key} className="block text-sm font-medium text-gray-900 mb-1">
                          {label}
                        </label>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        id={key}
                        type="number"
                        min={0}
                        max={5}
                        placeholder="0-5"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={form[key as keyof Review] as number || ''}
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          handleChange(key, val);
                        }}
                      />
                      <div className="flex-1 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const value = form[key as keyof Review] as number || 0;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleChange(key, star)}
                              className="text-2xl focus:outline-none transition-transform hover:scale-110"
                              aria-label={`Rate ${star} stars for ${label}`}
                            >
                              {star <= value ? '⭐' : '☆'}
                            </button>
                          );
                        })}
                      </div>
                      {(form[key as keyof Review] as number) > 0 && (
                        <span className="text-sm text-gray-600 font-medium min-w-[40px] text-right">
                          {form[key as keyof Review]}/5
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Student Type <span className="text-gray-500 font-normal">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["in-state", "out-of-state", "transfer", "international"].map(t => (
                  <label
                    key={t}
                    className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.tags.includes(t)}
                      onChange={() => toggleTag(t)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">{t.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Major */}
            <div>
              <label htmlFor="major" className="block text-sm font-semibold text-gray-900 mb-2">
                Major <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="major"
                type="text"
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300"
                value={form.major}
                onChange={e => handleChange('major', e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={closeForm}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
