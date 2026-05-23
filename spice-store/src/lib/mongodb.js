import { MongoClient } from "mongodb";

const uri = import.meta.env.VITE_MONGODB_URI;

const client = new MongoClient(uri);

export async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }

  return client.db("spice_store");
}