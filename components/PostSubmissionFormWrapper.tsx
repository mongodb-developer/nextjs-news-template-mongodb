"use client";

import { PostSubmissionForm } from "./PostSubmissionForm";
import { authClient } from "@/lib/auth-client";

export function PostSubmissionFormWrapper() {
  const { data: session } = authClient.useSession();
  const hasUser = !!session?.user;

  // Only show for logged in users
  if (!hasUser) {
    return null;
  }

  return (
    <div className="mt-12">
      <PostSubmissionForm />
    </div>
  );
}