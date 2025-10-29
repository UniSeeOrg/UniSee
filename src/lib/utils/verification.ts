/**
 * Check if an email address is from a .edu domain
 * @param email - The email address to check
 * @returns true if the email ends with .edu, false otherwise
 */
export function isEduEmail(email: string): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith('.edu');
}

/**
 * Validate .edu email with additional checks
 * @param email - The email address to validate
 * @returns true if valid .edu email, false otherwise
 */
export function validateEduEmail(email: string): boolean {
  if (!email) return false;
  
  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Check if ends with .edu
  return isEduEmail(email);
}

