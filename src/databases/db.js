import mongoose from "mongoose";
import env from "../configs/env.js";

const connection_string = env.MONGODB_URI;

const connectDB = async () => {
     try {
          const connect = await mongoose.connect(connection_string);
          console.log("MongoDB connected successfully")
     }
     catch (error) {
          console.error("MongoDB connection failed:", error.message);
          process.exit(1);
     }
};

export default connectDB;