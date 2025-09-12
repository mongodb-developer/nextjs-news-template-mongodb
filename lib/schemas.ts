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

export const VoteSchema = z.object({
  postId: z.string().min(1, "Post ID is required")
});

export const PostSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  url: z.string().optional(),
  points: z.number().default(1),
  submittedBy: z.string(),
  submittedAt: z.date(),
  votes: z.array(z.string()).default([])
});

export type Post = z.infer<typeof PostSchema>;
export type PostSubmission = z.infer<typeof PostSubmissionSchema>;
export type Vote = z.infer<typeof VoteSchema>;