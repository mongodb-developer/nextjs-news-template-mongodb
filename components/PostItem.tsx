"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Post, OptimisticVote } from "@/lib/schemas";
import { voteOnPost } from "@/lib/actions";
import { getTimeAgo } from "@/lib/utils";

interface PostItemProps {
  post: Post;
  globalIndex: number;
}

export function PostItem({ post, globalIndex }: PostItemProps) {
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const initialVoteData: OptimisticVote = {
    points: post.points,
    hasVoted: session?.user ? post.votes.includes(session.user.id) : false,
  };

  const [optimisticVote, addOptimisticVote] = useOptimistic(
    initialVoteData,
    (_state, newVote: OptimisticVote) => newVote
  );

  const handleVote = () => {
    if (isPending) return;

    // Redirect to login if user is not authenticated
    if (!session?.user) {
      router.push("/login");
      return;
    }

    const currentlyVoted = optimisticVote.hasVoted;
    const pointChange = currentlyVoted ? -1 : 1;

    startTransition(async () => {
      addOptimisticVote({
        points: optimisticVote.points + pointChange,
        hasVoted: !currentlyVoted,
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

  return (
    <div className="flex flex-row gap-2 items-baseline">
      {/* Global index */}
      <span className="text-gray-400 text-sm font-mono min-w-8 text-right leading-snug">
        {globalIndex}.
      </span>
      
      {/* Voting button */}
      <button
        onClick={handleVote}
        disabled={isPending}
        className={`transition-colors disabled:opacity-50 flex items-center translate-y-px ${
          optimisticVote.hasVoted
            ? "text-[#00684A] dark:text-[#00ED64]"
            : "text-gray-400 hover:text-[#00684A] dark:text-gray-400 dark:hover:text-[#00ED64]"
        }`}
        aria-label={optimisticVote.hasVoted ? "Remove upvote" : "Upvote"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 76 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[13px] w-[13px]"
        >
          <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
        </svg>
      </button>

      {/* Post content */}
      <div className="flex flex-col min-w-0 gap-1.5">
        <div className="leading-snug">
          <h3 className="font-medium text-gray-900 dark:text-white leading-none inline">
            {post.title}
          </h3>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 ml-1 dark:text-gray-400 hover:text-[#00684A] dark:hover:text-[#00ED64] transition-colors"
          >
            ({new URL(post.url).hostname})
          </a>
        </div>

        <div className="text-xs leading-tight text-gray-600 dark:text-gray-400">
          <span>
            {optimisticVote.points}{" "}
            {optimisticVote.points === 1 ? "point" : "points"}
          </span>
          <span>
            {" "}
            by{" "}
            {post.submittedByName}
          </span>
          <span> {getTimeAgo(post.submittedAt)}</span>
        </div>
      </div>
    </div>
  );
}
