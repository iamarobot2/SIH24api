const { MongoClient } = require("mongodb");

const DB_URI = process.env.MONGODB_URI;
let client;
let database;

async function connectDB() {
  try {
    client = new MongoClient(DB_URI);
    await client.connect();
    database = client.db("SIH24AJCE");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

function getDB() {
  if (!database) {
    throw new Error("Database not connected. Please call connectDB first.");
  }
  return database;
}

async function closeDB() {
  try {
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
