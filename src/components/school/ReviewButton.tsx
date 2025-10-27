"use client"

export default function ReviewButton({ reviewToggle }: { reviewToggle: () => void }) {
 return (
    <button onClick={reviewToggle} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
      Write a Review
    </button>
  );
}
