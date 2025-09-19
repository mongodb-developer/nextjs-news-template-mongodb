import { createAuthClient } from "better-auth/react";

// Get the base URL for the client - this needs to work at runtime for Deploy Button
const getClientBaseURL = () => {
  // If explicitly set, use it
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  // For Vercel deployments, use the production URL when available (most reliable)
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // Fallback to deployment URL (works for preview deployments)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Client-side fallback using current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Development fallback
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
});

// Export specific methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;