import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" 
    ? process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL
    : "http://localhost:3000",
});

// Export specific methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;