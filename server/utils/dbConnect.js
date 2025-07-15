import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ silent: true });

async function dbConnect() {
  try {
    let url = process.env.DB_URL;
    await mongoose.connect(url);
    console.log("MongoDB Connection Success.");
  } catch (error) {
    console.log(error);
  }
}

dbConnect();
