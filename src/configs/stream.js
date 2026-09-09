import {StreamChat} from "stream-chat";
import env from "./env.js";

const streamClient = StreamChat.getInstance(env.STREAM_API_KEY, env.STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
     try {

          await streamClient.upsertUsers([userData]);
          console.log("User upserted to Stream successfully:", userData.name);
          return { success: true, message: "User upserted to Stream successfully" , user:userData};
     } catch (error) {
          console.error("Error upserting user to Stream:", error);
          throw error;
     }
};

export const deleteStreamUser = async (userId) => {
     try {
            await streamClient.deleteUsers({
               user_ids: [userId]
          });
          console.log("User deleted from Stream successfully:", userId);
          return { success: true, message: "User deleted from Stream successfully" , userId};
     } catch (error) {
          console.error("Error deleting user from Stream:", error);
          throw error;
     }
};

export const generateStreamToken = (userId) => {
     try{
          const token = streamClient.generateUserToken(userId);

          return token;

     }catch(error){
          console.error("Error generating Stream token:", error);
          return null;
     }
}


export const addUserToPublicChannel = async (newUserId) => {

     try{

          const publicChannel = await streamClient.queryChannels({discoverable:true});

          for(const channel of publicChannel){
               await channel.addMembers([newUserId]);
          }

     }catch(error){
          console.error("Error adding user to public channel:", error);
          throw error;
     }

}