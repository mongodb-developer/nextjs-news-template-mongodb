import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDatabase } from "@/lib/mongodb";

// Validate required environment variables
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('Missing required environment variable: BETTER_AUTH_SECRET');
}

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('Missing required GitHub OAuth environment variables: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET');
}

// Create a lazy auth instance that only connects when used
let authInstance: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (!authInstance) {
    const database = await getDatabase();
    authInstance = betterAuth({
      database: mongodbAdapter(database),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
      user: {
        additionalFields: {
          githubUsername: {
            type: "string",
            required: false,
          }
        }
      },
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          mapProfileToUser: (profile) => ({
            githubUsername: profile.login,
          }),
        },
      },
    });
  }
  return authInstance;
}