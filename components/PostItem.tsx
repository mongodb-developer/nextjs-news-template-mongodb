"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Triangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Post {
  _id: string;
  title: string;
  url?: string;
  points: number;
  submittedBy: string;
  submittedAt: string | Date;
  votes: string[];
}

interface PostItemProps {
  post: Post;
  onVote: (postId: string, points: number) => void;
}

function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const submittedDate = new Date(date);
  const diffInMs = now.getTime() - submittedDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }
}

export function PostItem({ post, onVote }: PostItemProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isVoting, setIsVoting] = useState(false);
  const [localPoints, setLocalPoints] = useState(post.points);
  const [localVotes, setLocalVotes] = useState(post.votes);

  const hasVoted = session?.user ? localVotes.includes(session.user.id) : false;

  const handleVote = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/posts/${post._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocalPoints(data.points);
        
        // Update local votes array to reflect the change
        if (data.hasVoted) {
          setLocalVotes([...localVotes, session.user.id]);
        } else {
          setLocalVotes(localVotes.filter(id => id !== session.user.id));
        }
        
        onVote(post._id, data.points);
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const isUrl = post.url && post.url.trim() !== "";
  const displayTitle = isUrl ? (
    <a 
      href={post.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {post.title}
    </a>
  ) : (
    <span>{post.title}</span>
  );

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex flex-col items-center min-w-[40px]">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVote}
          disabled={isVoting}
          className={`p-1 h-auto hover:bg-transparent ${
            hasVoted 
              ? "text-[#00ED64] hover:text-white" 
              : "text-white hover:text-[#00ED64]"
          }`}
        >
          <Triangle className="h-4 w-4 rotate-0" fill="currentColor" />
        </Button>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-white leading-tight mb-1">
          {displayTitle}
        </div>
        <div className="text-xs text-gray-400 space-x-2">
          <span>{localPoints} {localPoints === 1 ? 'point' : 'points'}</span>
          <span>by {post.submittedBy}</span>
          <span>{formatTimeAgo(post.submittedAt)}</span>
        </div>
      </div>
    </div>
  );
}