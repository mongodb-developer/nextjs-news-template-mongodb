import { z } from "zod";

export const PostSubmissionSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(300, "Title must be less than 300 characters")
    .trim(),
  url: z.string()
    .min(1, "URL is required")
    .trim()
    .refine((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid URL")
});

export const PostSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  url: z.string(),
  points: z.number().default(1),
  submittedById: z.string(),
  submittedByName: z.string(),
  submittedAt: z.date(),
  votes: z.array(z.string()).default([])
});

export type Post = z.infer<typeof PostSchema>;
export type PostSubmission = z.infer<typeof PostSubmissionSchema>;

// Common interfaces used across the application
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

export interface OptimisticVote {
  points: number;
  hasVoted: boolean;
}

export interface VoteResult {
  points: number;
  hasVoted: boolean;
}

export interface SubmitPostResult {
  success: boolean;
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
}