import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Create handlers using dynamic import pattern for lazy initialization
export async function GET(request: Request) {
  const authInstance = await getAuth();
  const handler = toNextJsHandler(authInstance);
  return handler.GET(request);
}

export async function POST(request: Request) {
  const authInstance = await getAuth();
  const handler = toNextJsHandler(authInstance);
  return handler.POST(request);
}