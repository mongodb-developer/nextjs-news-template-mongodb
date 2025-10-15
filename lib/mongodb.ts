import { attachDatabasePool } from "@vercel/functions";
import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  appName: "devrel.template.vercel-better-auth",
  maxIdleTimeMS: 5000,
};

const client = new MongoClient(uri, options);

// Attach the client to ensure proper cleanup on function suspension.
// See https://vercel.com/blog/the-real-serverless-compute-to-database-connection-problem-solved
attachDatabasePool(client);

const clientPromise = client.connect();

// Get the database instance for Better Auth
export async function getDatabase(dbName?: string) {
  const client = await clientPromise;
  return client.db(dbName || process.env.MONGODB_DB || "better-auth");
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
