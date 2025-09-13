import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  try {
    const authInstance = await auth;
    const session = await authInstance.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}