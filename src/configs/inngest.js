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

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        email,
        name,
        avatar: image_url,
      },
      {
        new: true,
        upsert: true,
      },
    );

    const res = await upsertStreamUser({
      id,
      name,
      email,
      image: event.data.image_url,
    });

    await addUserToPublicChannel(id.toString());

    console.log("User synced successfully:", res);

    return {
      success: true,
      user: user._id,
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

    await deleteStreamUser(id);
  },
);

export const functions = [syncUser, deleteUser];
