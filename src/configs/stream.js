import {StreamChat} from "stream-chat";
import {env} from "./env.js";

const streamClient = StreamChat.getInstance(env.STREAM_API_KEY, env.STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
     try {

          await streamClient.upsertUser(userData);
          console.log("User upserted to Stream successfully:", userData.name);
          return { success: true, message: "User upserted to Stream successfully" , user:userData};
     } catch (error) {
          console.error("Error upserting user to Stream:", error);
          throw error;
     }
};

export const deleteStreamUser = async (userId) => {
     try {
          await streamClient.deleteUser(userId);
          console.log("User deleted from Stream successfully:", userId);
          return { success: true, message: "User deleted from Stream successfully" , userId};
     } catch (error) {
          console.error("Error deleting user from Stream:", error);
          throw error;
     }
};

export const generateStreamToken = (userId) => {
     try{
          const userIdString = userId.toString();
          const token = streamClient.createToken(userIdString);

          return { success: true, message: "Stream token generated successfully", token };

     }catch(error){
          console.error("Error generating Stream token:", error);
          return { success: false, message: "Error generating Stream token", error };
     }
}
