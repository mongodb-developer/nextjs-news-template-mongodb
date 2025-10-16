import { client as dbClient } from "@/lib/mongodb";

export async function dbConnectionStatus() {
  if (!process.env.MONGODB_URI) {
    return "No MONGODB_URI environment variable";
  }
  if (!dbClient) {
    return "Database client not initialized";
  }
  try {
    const client = await dbClient.connect();
    const db = client.db();
    const result = await db.command({ ping: 1 });
    console.log("MongoDB connection successful:", result);
    return "Database connected";
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "Database not connected";
  }
}
