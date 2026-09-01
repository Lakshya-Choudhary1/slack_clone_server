import { Inngest } from "inngest";
import User from "../models/user.model.js";

import {connectDB,disconnectDB} from "../databases/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "clerk-slack-clone" });

const syncUser = inngest.createFunction(
  {
    id:"sync-user",
    triggers: ["clerk/user.created"]
  },
  async ({ event }) => {

    const {id, email_addresses, first_name, last_name, image_url} = event.data;

    const newUser = new User({
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
      avatar: image_url,
    });

    await newUser.save();


    // TODO : Add error handling and logging
  }
);

const deleteUser = inngest.createFunction(
  {
    id:"delete-user",
    triggers: ["clerk/user.deleted"]
  },
  async ({ event }) => {
    
    const {id} = event.data;

    await User.findOneAndDelete({clerkId: id});
    // TODO : Add error handling and logging

  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser,deleteUser];