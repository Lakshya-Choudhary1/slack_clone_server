import { Inngest } from "inngest";

import {connectDB,disconnectDB} from "../databases/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: {
      event: "clerk/slack-clone/user.created",
      
    },
  },
  async ({ event }) => {
    await connectDB();

    console.log("event:", event.data);

    await disconnectDB();

    return { message: "Hello from Inngest!" };
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser];