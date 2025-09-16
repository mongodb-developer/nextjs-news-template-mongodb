"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Triangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Post, OptimisticVote } from "@/lib/schemas";
import { voteOnPost } from "@/lib/actions";
import { getTimeAgo } from "@/lib/utils";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const initialVoteData: OptimisticVote = {
    points: post.points,
    hasVoted: session?.user ? post.votes.includes(session.user.id) : false
  };

  const [optimisticVote, addOptimisticVote] = useOptimistic(
    initialVoteData,
    (_state, newVote: OptimisticVote) => newVote
  );

  const handleVote = () => {
    if (isPending) return;

    // Redirect to login if user is not authenticated
    if (!session?.user) {
      router.push('/login');
      return;
    }

    const currentlyVoted = optimisticVote.hasVoted;
    const pointChange = currentlyVoted ? -1 : 1;

    startTransition(async () => {
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

  return (
    <div className="flex items-start gap-3 py-2">
      {/* Voting button */}
      <div className="flex flex-col items-center gap-1 min-w-[40px]">
        <button
          onClick={handleVote}
          disabled={isPending}
          className={`transition-colors disabled:opacity-50 ${
            optimisticVote.hasVoted
              ? "text-[#00684A] dark:text-[#00ED64]"
              : "text-gray-400 hover:text-[#00684A] dark:text-gray-400 dark:hover:text-[#00ED64]"
          }`}
          aria-label={optimisticVote.hasVoted ? "Remove upvote" : "Upvote"}
        >
          <Triangle className="h-4 w-4 rotate-0" fill="currentColor" />
        </button>
        <span className="text-sm font-mono text-gray-600 dark:text-gray-300 min-w-[20px] text-center">
          {optimisticVote.points}
        </span>
      </div>

      {/* Post content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white leading-tight">
            {post.url ? (
              <>
                {post.title} (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00684A] dark:hover:text-[#00ED64] transition-colors"
                >
                  {new URL(post.url).hostname}
                </a>
                )
              </>
            ) : (
              post.title
            )}
          </h3>
        </div>

        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 space-x-2">
          <span>{optimisticVote.points} {optimisticVote.points === 1 ? 'point' : 'points'}</span>
          <span>•</span>
          <span>by <a
            href={`https://github.com/${post.submittedByGithubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00684A] dark:hover:text-[#00ED64] transition-colors"
          >
            {post.submittedByName}
          </a></span>
          <span>•</span>
          <span>{getTimeAgo(post.submittedAt)}</span>
        </div>
      </div>
    </div>
  );
}

