import { dbConnectionStatus } from "@/db/connection-status";

export async function GET() {
  const status = await dbConnectionStatus();
  return new Response(status, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}