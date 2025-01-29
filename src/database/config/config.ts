import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_DB_URL;

if (!mongoURI) {
  throw new Error("MONGO_DB_URL is not defined in environment variables");
}

const dbConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error(`Failed to connect to the database: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default dbConnection;
