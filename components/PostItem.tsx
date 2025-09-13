"use client";

import { useOptimistic, useTransition } from "react";
import { Triangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Post } from "@/lib/schemas";
import { voteOnPost } from "@/lib/actions";

interface PostItemProps {
  post: Post;
}

interface OptimisticVote {
  points: number;
  hasVoted: boolean;
}

export function PostItem({ post }: PostItemProps) {
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = useTransition();

  const initialVoteData: OptimisticVote = {
    points: post.points,
    hasVoted: session?.user ? post.votes.includes(session.user.id) : false
  };

  const [optimisticVote, addOptimisticVote] = useOptimistic(
    initialVoteData,
    (state: OptimisticVote, newVote: OptimisticVote) => newVote
  );

  const handleVote = () => {
    if (!session?.user || isPending) return;

    const currentlyVoted = optimisticVote.hasVoted;
    const pointChange = currentlyVoted ? -1 : 1;

    startTransition(async () => {
      // Add optimistic update inside the transition
      addOptimisticVote({
        points: optimisticVote.points + pointChange,
        hasVoted: !currentlyVoted
      });

      try {
        if (!post._id) return;
        await voteOnPost(post._id);
      } catch (error) {
        console.error("Error voting:", error);
        // The optimistic update will revert automatically if the server action fails
      }
    });
  };

  const getTimeAgo = (date: string | Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }
  };

  return (
    <div className="flex items-start gap-3 py-2">
      {/* Voting button */}
      <div className="flex flex-col items-center gap-1 min-w-[40px]">
        <button
          onClick={handleVote}
          disabled={!session?.user || isPending}
          className={`transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            optimisticVote.hasVoted
              ? "text-[#00ED64]"
              : "text-gray-400 hover:text-[#00ED64]"
          }`}
          aria-label={optimisticVote.hasVoted ? "Remove upvote" : "Upvote"}
        >
          <Triangle className="h-4 w-4 rotate-0" fill="currentColor" />
        </button>
        <span className="text-sm font-mono text-gray-300 min-w-[20px] text-center">
          {optimisticVote.points}
        </span>
      </div>

      {/* Post content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="font-medium text-white leading-tight">
            {post.url ? (
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00ED64] transition-colors"
              >
                {post.title} ({new URL(post.url).hostname})
              </a>
            ) : (
              post.title
            )}
          </h3>
        </div>

        <div className="mt-1 text-xs text-gray-500 space-x-2">
          <span>{optimisticVote.points} {optimisticVote.points === 1 ? 'point' : 'points'}</span>
          <span>•</span>
          <span>by {post.submittedByName}</span>
          <span>•</span>
          <span>{getTimeAgo(post.submittedAt)}</span>
        </div>
      </div>
    </div>
  );
}

