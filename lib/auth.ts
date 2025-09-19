import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDatabase } from "@/lib/mongodb";

// Validate required environment variables
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('Missing required environment variable: BETTER_AUTH_SECRET');
}

// Get the base URL for the server - supports Deploy Button without pre-configuration
const getServerBaseURL = () => {
  // If explicitly set, use it
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  // For Vercel deployments, use the production URL when available (most reliable)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // Fallback to deployment URL (works for preview deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development fallback
  return "http://localhost:3000";
};

let authInstance: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (!authInstance) {
    const database = await getDatabase();
    authInstance = betterAuth({
      database: mongodbAdapter(database),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: getServerBaseURL(),
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
      },
    });
  }
  return authInstance;
}

