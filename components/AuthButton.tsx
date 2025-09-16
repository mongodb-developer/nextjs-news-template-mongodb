"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { checkGitHubConfig, showGitHubConfigError } from "@/lib/github-config";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  className?: string;
}

export function AuthButton({ className }: AuthButtonProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const handleLoginClick = async () => {
    const isConfigured = await checkGitHubConfig();
    if (!isConfigured) {
      showGitHubConfigError();
      return;
    }
    router.push("/login");
  };

  if (isPending) {
    return (
      <Button disabled className={`${className} flex items-center gap-2`}>
        <Spinner size="sm" />
        Log in to post
      </Button>
    );
  }

  if (session?.user) {
    return (
      <Button onClick={handleLogout} className={className}>
        Logout
      </Button>
    );
  }

  return (
    <Button onClick={handleLoginClick} className={className}>
      Log in to post
    </Button>
  );
}

