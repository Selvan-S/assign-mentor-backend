import mongoose from "mongoose";

export function dbConnection(MONGODB_CONNECTION_STRING) {
  const MONGO_URL = MONGODB_CONNECTION_STRING;
  try {
    mongoose.connect(MONGO_URL);
    console.log("Database Connected Sucessfully");
  } catch (error) {
    console.log(`mongodb connection error${error}`);
  }
}
