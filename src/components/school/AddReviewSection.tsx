"use client"
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import ReviewButton from "./ReviewButton";
import ReviewForm from "./ReviewForm";
export default function AddReviewSection({schoolId}: { schoolId: string}) {
  let [reviewToggle, setReviewToggle] = useState(false); // Start with form hidden 

  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  let userId: number;
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if(!user)
      {
        setUser(null)
        return;
      }
      setUser(user);
    };
    getUser();
  }, []);

  function toggle() : void
  {
    setReviewToggle(!reviewToggle);
    console.log(reviewToggle);
  }

  return (
    <>
    {user ? (
      <>
        <ReviewButton reviewToggle={toggle}/>
        {reviewToggle && <ReviewForm closeForm={toggle} authorId={user.id} schoolId={schoolId}/>}
      </>
    ) : (
      <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-center">
        Please log in to write a review
      </div>
    )}
    </>
  );
}

