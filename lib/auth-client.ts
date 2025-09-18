import { createAuthClient } from "better-auth/react";

// Get the base URL for the client
const getClientBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: use current origin
    return window.location.origin;
  }

  // Server-side: use environment variables
  if (process.env.NODE_ENV === "production") {
    return process.env.BETTER_AUTH_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000";
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