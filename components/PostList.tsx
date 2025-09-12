"use client";

import { useState, useEffect } from "react";
import { PostItem } from "./PostItem";

interface Post {
  _id: string;
  title: string;
  url?: string;
  points: number;
  submittedBy: string;
  submittedAt: string | Date;
  votes: Array<{ userId: string; voteType: "up" | "down" }>;
}

interface PostListProps {
  refreshTrigger: number;
}

export function PostList({ refreshTrigger }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const handleVote = (postId: string, newPoints: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId 
          ? { ...post, points: newPoints }
          : post
      ).sort((a, b) => b.points - a.points || new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">
        Loading posts...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No posts yet. Be the first to submit one!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {posts.map((post, index) => (
        <div key={post._id} className="flex items-start gap-2">
          <span className="text-gray-400 text-sm font-mono w-6 text-right mt-2">
            {index + 1}.
          </span>
          <div className="flex-1">
            <PostItem post={post} onVote={handleVote} />
          </div>
        </div>
      ))}
    </div>
  );
}