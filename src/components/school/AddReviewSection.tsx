"use client"
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import ReviewButton from "./ReviewButton";
import ReviewForm from "./ReviewForm";

interface UserProfile {
  is_verified?: boolean;
}

export default function AddReviewSection({schoolId}: { schoolId: string}) {
  const [reviewToggle, setReviewToggle] = useState(false); // Start with form hidden 

  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if(!user)
      {
        setUser(null)
        return;
      }
      setUser(user);
      
      // Fetch user profile to check verification status
      try {
        console.log('AddReviewSection: Attempting to fetch profile for:', user.email);
        console.log('AddReviewSection: User ID:', user.id);
        
        // Try using auth_id instead
        const profileResponse = await supabaseClient
          .from('User')
          .select('is_verified, email, auth_id')
          .eq('auth_id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid error on no rows
        
        console.log('AddReviewSection: Profile fetch response:', profileResponse);
        if (profileResponse.data) {
          console.log('AddReviewSection: Setting userProfile to:', profileResponse.data);
          setUserProfile(profileResponse.data);
        } else if (profileResponse.error) {
          console.error('AddReviewSection: Fetch error:', profileResponse.error);
        } else {
          console.log('AddReviewSection: No profile found for user:', user.id);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
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
    {!user ? (
      <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-center">
        Please log in to write a review
      </div>
    ) : !userProfile?.is_verified ? (
      <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 py-3 px-4 rounded-lg text-center">
        <p className="font-medium">Edu email required</p>
        <p className="text-sm mt-1">Please sign up with a .edu email address to write reviews</p>
      </div>
    ) : (
      <>
        <ReviewButton reviewToggle={toggle}/>
        {reviewToggle && <ReviewForm closeForm={toggle} authorId={user.id} schoolId={schoolId}/>}
      </>
    )}
    </>
  );
}

