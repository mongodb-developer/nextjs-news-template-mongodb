import { MongoClient, MongoClientOptions, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  appName: "devrel.template.vercel-better-auth",
};

// Global variables for connection management
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Lazy connection function - only connects when first called
async function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();

    // Handle connection cleanup on process exit
    process.on('SIGINT', async () => {
      if (client) {
        await client.close();
      }
    });
  }

  return clientPromise;
}

// Get the database instance - only connects when called
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName || process.env.MONGODB_DB || "better-auth");
}

// Export the client getter for Better Auth adapter
export { getMongoClient };