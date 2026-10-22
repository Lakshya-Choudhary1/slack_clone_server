import { Inngest } from "inngest";
import User from "../models/user.model.js";
import { connectDB } from "../databases/db.js";
import {
  upsertStreamUser,
  deleteStreamUser,
  addUserToPublicChannel,
} from "./stream.js";

export const inngest = new Inngest({
  id: "clerk-slack-clone",
});

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const name = `${first_name || ""} ${last_name || ""}`.trim();
    const email = email_addresses?.[0]?.email_address;

    const existingUser = await User.findOne({ clerkId: id });

    if (existingUser) {
      console.log("User already exists with Clerk ID:", id);
      return {
        success: false,
        message: "User already exists",
        userId: existingUser._id,
      };
    }

    const user = await User.insertOne({
      clerkId: id,
      email,
      name,
      avatar: image_url,
    });

    const res = await upsertStreamUser({
      id,
      name,
      email,
      image: event.data.image_url,
    });

    const {token} = res;

    await addUserToPublicChannel(id);

    console.log("User synced successfully:", res);

    return {
      success: true,
      streamToken: token,
      userId: user._id,
    };
  },
);

const deleteUser = inngest.createFunction(
  {
    id: "delete-user",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    await connectDB();

    console.log("Deleting user with Clerk ID:", event.data.id);

    const { id } = event.data;

    await User.findOneAndDelete({
      clerkId: id,
    });

    const res = await deleteStreamUser(id);
    console.log("User deleted successfully:", res);

    return {
      success: true,
      message: "User deleted successfully",
      userId: id,
    };
  },
);

export const functions = [syncUser, deleteUser];
