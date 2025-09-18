import { createAuthClient } from "better-auth/react";

// Get the base URL for the client - this needs to work at runtime for Deploy Button
const getClientBaseURL = () => {
  // In development, always use localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // In production, if BETTER_AUTH_URL is manually set (not localhost), use it
  if (process.env.BETTER_AUTH_URL && process.env.BETTER_AUTH_URL !== "http://localhost:3000") {
    return process.env.BETTER_AUTH_URL;
  }

  // For Vercel deployments with Deploy Button - use runtime detection
  if (typeof window !== "undefined") {
    // Client-side: use current origin (this handles Deploy Button scenario)
    return window.location.origin;
  }

  // Server-side fallback: try Vercel URL or default
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

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