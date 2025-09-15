import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Create lazy handlers that initialize auth only when called
export async function GET(request: Request) {
  const auth = await getAuth();
  const handler = toNextJsHandler(auth);
  return handler.GET(request);
}

export async function POST(request: Request) {
  const auth = await getAuth();
  const handler = toNextJsHandler(auth);
  return handler.POST(request);
}