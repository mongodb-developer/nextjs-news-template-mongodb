import { createAuthClient } from "better-auth/react";

// Get the base URL for the client - this needs to work at runtime for Deploy Button
const getClientBaseURL = () => {
  if (process.env.BETTER_AUTH_URL && process.env.BETTER_AUTH_URL !== "") {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
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