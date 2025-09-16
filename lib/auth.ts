import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDatabase } from "@/lib/mongodb";

// Validate required environment variables
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('Missing required environment variable: BETTER_AUTH_SECRET');
}

let authInstance: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (!authInstance) {
    const database = await getDatabase();
    authInstance = betterAuth({
      database: mongodbAdapter(database),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL || process.env.VERCEL_URL || "http://localhost:3000",
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
          clientId: process.env.GITHUB_CLIENT_ID as string || '',
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string || '',
          mapProfileToUser: (profile) => ({
            githubUsername: profile.login,
          }),
        },
      },
    });
  }
  return authInstance;
}

