"use client";

import { useState, useEffect } from "react";
import { PostItem } from "./PostItem";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Post {
  _id: string;
  title: string;
  url?: string;
  points: number;
  submittedBy: string;
  submittedAt: string | Date;
  votes: Array<{ userId: string; voteType: "up" | "down" }>;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PostListProps {
  refreshTrigger: number;
}

export function PostList({ refreshTrigger }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchPosts = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?page=${page}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && pagination && page <= pagination.totalPages) {
      fetchPosts(page);
    }
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
    <div className="space-y-4">
      <div className="space-y-1">
        {posts.map((post, index) => {
          const globalIndex = (currentPage - 1) * 10 + index + 1;
          return (
            <div key={post._id} className="flex items-start gap-2">
              <span className="text-gray-400 text-sm font-mono w-6 text-right mt-2">
                {globalIndex}.
              </span>
              <div className="flex-1">
                <PostItem post={post} onVote={handleVote} />
              </div>
            </div>
          );
        })}
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {pagination.hasPrevPage && (
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {pagination.hasNextPage && (
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}