import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
     required: true,
     unique: true,
  },
  name: {
     type: String,
     required: true,
  },
  avatar: {
     type: String,
     required: false,
  },
  clerkId: {
     type: String,
     required: true,
     unique: true,
  }
},{timestamps: true});

export default mongoose.model("User", userSchema);
