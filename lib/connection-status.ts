import { getMongoClient } from "@/lib/mongodb";

export async function dbConnectionStatus(): Promise<string> {
  if (!process.env.MONGODB_URI) {
    return "No MONGODB_URI environment variable";
  }

  try {
    const client = await getMongoClient();
    const db = client.db();
    const result = await db.command({ ping: 1 });
    console.log("MongoDB connection successful:", result);
    return "Database connected";
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "Database not connected";
  }
}