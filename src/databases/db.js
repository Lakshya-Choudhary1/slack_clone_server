import mongoose from "mongoose";
import env from "../configs/env.js";

const connection_string = env.MONGODB_URI;

export const connectDB = async () => {
     try {
          await mongoose.connect(connection_string);
          console.log("MongoDB connected successfully")
     }
     catch (error) {
          console.error("MongoDB connection failed:", error.message);
          process.exit(1);
     }
};

export const disconnectDB = async () => {
     try {
          await mongoose.disconnect();
          console.log("MongoDB disconnected successfully");
     }
     catch (error) {
          console.error("MongoDB disconnection failed:", error.message);
          process.exit(1);
     }
};