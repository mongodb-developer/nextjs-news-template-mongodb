import { PostSubmissionForm } from "./PostSubmissionForm";
import { PostListServer } from "./PostListServer";
import { Suspense } from "react";

interface PostSectionProps {
  hasUser: boolean;
  currentPage: number;
}

export function PostSection({ hasUser, currentPage }: PostSectionProps) {
  return (
    <>
      {/* Post Submission Form - Only show for logged in users */}
      {hasUser && (
        <div className="mt-12">
          <PostSubmissionForm />
        </div>
      )}

      {/* Post List */}
      <div className="mt-8">
        <Suspense fallback={
          <div className="text-center py-8 text-gray-400">
            Loading posts...
          </div>
        }>
          <PostListServer page={currentPage} />
        </Suspense>
      </div>
    </>
  );
}