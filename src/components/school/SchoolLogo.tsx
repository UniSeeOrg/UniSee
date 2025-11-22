"use client";
import { useState } from "react";
import Image from "next/image";
import { getLogoUrl, getPlaceholderLogoUrl } from "@/lib/utils/logos";

interface SchoolLogoProps {
  schoolUrl?: string | null;
  schoolName: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function SchoolLogo({ 
  schoolUrl, 
  schoolName, 
  width = 96, 
  height = 96,
  className = ""
}: SchoolLogoProps) {
  const [logoError, setLogoError] = useState(false);
  const logoSrc = logoError 
    ? getPlaceholderLogoUrl(schoolName)
    : getLogoUrl(schoolUrl, schoolName);

  return (
    <div className={`flex-shrink-0 ${className}`}>
      <Image 
        className="w-20 h-20 md:w-24 md:h-24 rounded-lg shadow-md object-contain bg-gray-100" 
        src={logoSrc}
        alt={`${schoolName} logo`}
        width={width}
        height={height}
        onError={() => setLogoError(true)}
        unoptimized={logoError}
      />
    </div>
  );
}

