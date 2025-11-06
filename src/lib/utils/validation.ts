import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize string to prevent XSS attacks
 */
function sanitizeString(input: string): string {
  // Remove HTML tags and sanitize
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
  }).trim();
}

/**
 * Validation schema for review creation and updates
 */
export const reviewSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .transform(sanitizeString),
  
  content: z
    .string()
    .min(10, "Review content must be at least 10 characters")
    .max(5000, "Review content must be 5000 characters or less")
    .transform(sanitizeString),
  
  rating: z
    .preprocess(
      (val) => (val === 0 || val === '' || val === null || val === undefined ? undefined : val),
      z.number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .optional()
    ),
  
  academics: z
    .preprocess(
      (val) => (val === 0 || val === '' || val === null || val === undefined ? undefined : val),
      z.number()
        .int("Academics rating must be an integer")
        .min(1, "Academics rating must be at least 1")
        .max(5, "Academics rating must be at most 5")
        .optional()
    ),
  
  social: z
    .preprocess(
      (val) => (val === 0 || val === '' || val === null || val === undefined ? undefined : val),
      z.number()
        .int("Social rating must be an integer")
        .min(1, "Social rating must be at least 1")
        .max(5, "Social rating must be at most 5")
        .optional()
    ),
  
  food: z
    .preprocess(
      (val) => (val === 0 || val === '' || val === null || val === undefined ? undefined : val),
      z.number()
        .int("Food rating must be an integer")
        .min(1, "Food rating must be at least 1")
        .max(5, "Food rating must be at most 5")
        .optional()
    ),
  
  housing: z
    .preprocess(
      (val) => (val === 0 || val === '' || val === null || val === undefined ? undefined : val),
      z.number()
        .int("Housing rating must be an integer")
        .min(1, "Housing rating must be at least 1")
        .max(5, "Housing rating must be at most 5")
        .optional()
    ),
  
  career: z
    .preprocess(
      (val) => (val === 0 || val === '' || val === null || val === undefined ? undefined : val),
      z.number()
        .int("Career rating must be an integer")
        .min(1, "Career rating must be at least 1")
        .max(5, "Career rating must be at most 5")
        .optional()
    ),
  
  tags: z
    .array(z.string().transform(sanitizeString))
    .max(10, "Maximum 10 tags allowed")
    .optional()
    .default([]),
  
  major: z
    .string()
    .max(100, "Major must be 100 characters or less")
    .transform(sanitizeString)
    .optional(),
  
  schoolId: z
    .string()
    .uuid("Invalid school ID format"),
  
  authorId: z
    .string()
    .uuid("Invalid author ID format")
    .optional(),
});

/**
 * Validation schema for review updates (all fields optional except id)
 */
export const reviewUpdateSchema = reviewSchema.partial().extend({
  id: z.string().or(z.number()).optional(),
});

/**
 * Validation schema for review deletion
 */
export const reviewDeleteSchema = z.object({
  reviewId: z.union([
    z.string().transform((val) => parseInt(val, 10)),
    z.number().int("Review ID must be an integer"),
  ]),
});

/**
 * Format Zod validation errors into user-friendly messages
 */
function formatZodError(error: unknown): string {
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
    const errors = zodError.issues.map(issue => {
      const field = issue.path.join('.');
      return `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'}: ${issue.message}`;
    });
    return errors.join('. ');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Validation failed. Please check your input.";
}

/**
 * Validate review data and return sanitized result
 * Throws a formatted error message if validation fails
 */
export function validateReview(data: unknown) {
  try {
    return reviewSchema.parse(data);
  } catch (error) {
    const formattedError = new Error(formatZodError(error));
    throw formattedError;
  }
}

/**
 * Validate review update data and return sanitized result
 * Throws a formatted error message if validation fails
 */
export function validateReviewUpdate(data: unknown) {
  try {
    return reviewUpdateSchema.parse(data);
  } catch (error) {
    const formattedError = new Error(formatZodError(error));
    throw formattedError;
  }
}

/**
 * Validate review deletion data
 * Throws a formatted error message if validation fails
 */
export function validateReviewDelete(data: unknown) {
  try {
    return reviewDeleteSchema.parse(data);
  } catch (error) {
    const formattedError = new Error(formatZodError(error));
    throw formattedError;
  }
}

