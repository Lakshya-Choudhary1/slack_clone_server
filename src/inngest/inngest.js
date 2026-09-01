import { Inngest } from "inngest";
import User from "../models/user.model.js";
import { connectDB } from "../databases/db.js";

export const inngest = new Inngest({
  id: "clerk-slack-clone",
});

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }]
  },
  async ({ event }) => {
    await connectDB();

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = event.data;

    const newUser = new User({
      clerkId: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      avatar: image_url,
    });

    await newUser.save();

    return {
      success: true,
      clerkId: id,
    };
  }
);

const deleteUser = inngest.createFunction(
  {
    id: "delete-user",
    triggers: [{ event: "clerk/user.deleted" }]
  },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.findOneAndDelete({
      clerkId: id,
    });

    return {
      success: true,
      clerkId: id,
    };
  }
);

export const functions = [syncUser, deleteUser];