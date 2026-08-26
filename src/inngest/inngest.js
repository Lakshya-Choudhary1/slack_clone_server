import { Inngest } from "inngest";
import User from "../models/user.model.js";

import {connectDB,disconnectDB} from "../databases/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: {
      event: "clerk/user.created",
    },
  },
  async ({ event }) => {
    await connectDB();

    console.log("event:", event.data);

    await User.create({
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address || "",
          name: (event.data.first_name || "") +  (event.data.last_name || ""),
          avatar: event.data.profile_image_url || ""
    })

    await disconnectDB();

    return { message: "Hello from Inngest!" };
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser];