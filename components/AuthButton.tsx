"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface AuthButtonProps {
  className: string;
}

export function AuthButton({ className }: AuthButtonProps) {
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  if (isPending) {
    return (
      <Button disabled className={className}>
        Loading...
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
    <Button asChild className={className}>
      <Link href="/login">Log in to post</Link>
    </Button>
  );
}

