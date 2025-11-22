/**
 * Extracts the domain from a school URL for use with Clearbit logo service
 * Handles both full URLs (https://example.edu) and plain domains (example.edu)
 */
export function getLogoUrl(schoolUrl?: string | null, schoolName?: string): string {
  if (!schoolUrl && schoolName) {
    // If no URL but we have a name, use placeholder
    return getPlaceholderLogoUrl(schoolName);
  }

  if (!schoolUrl) {
    // Generic placeholder if we have neither
    return "https://ui-avatars.com/api/?name=UN&background=3B82F6&color=fff&size=128&bold=true";
  }

  try {
    // If it's already a domain (no protocol), use it directly
    if (!schoolUrl.includes("://")) {
      return `https://logo.clearbit.com/${schoolUrl}`;
    }

    // If it's a full URL, extract the domain
    const url = new URL(schoolUrl);
    return `https://logo.clearbit.com/${url.hostname}`;
  } catch {
    // If URL parsing fails, try to extract domain manually
    const domain = schoolUrl.replace(/^https?:\/\//, "").split("/")[0];
    return `https://logo.clearbit.com/${domain}`;
  }
}

/**
 * Generates a fallback placeholder logo using initials
 */
export function getPlaceholderLogoUrl(name: string): string {
  // Extract initials from school name (first letter of first two words)
  const words = name.split(" ").filter(word => word.length > 0);
  let initials = "";
  
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = "UN";
  }

  // Use a simple placeholder service or data URI
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3B82F6&color=fff&size=128&bold=true`;
}

