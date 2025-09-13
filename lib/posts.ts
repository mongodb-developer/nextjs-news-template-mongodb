"use server";

import { unstable_cache } from "next/cache";
import { getDatabase } from "@/lib/mongodb";
import { Post } from "@/lib/schemas";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

async function fetchPostsFromDB(page: number = 1, limit: number = 10): Promise<PostsResponse> {
  const skip = (page - 1) * limit;

  const db = await getDatabase();
  const postsCollection = db.collection("posts");

  // Get total count for pagination
  const totalCount = await postsCollection.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  const posts = await postsCollection
    .find({})
    .sort({ points: -1, submittedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Convert ObjectId to string for JSON serialization
  const postsForResponse = posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    votes: post.votes || []
  })) as Post[];

  return {
    posts: postsForResponse,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  };
}

// Cache the posts with proper tagging for revalidation
export const getPosts = unstable_cache(
  fetchPostsFromDB,
  ["posts"],
  {
    tags: ["posts"],
    revalidate: 3600, // Fallback revalidation every hour
  }
);