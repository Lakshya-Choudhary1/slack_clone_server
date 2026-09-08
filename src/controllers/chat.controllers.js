import { generateStreamToken } from "../configs/stream.js";

export const getStreamToken = async (req,res)=>{
     try{
          const token =  generateStreamToken(req.auth().userId);

          console.log("Stream token generated successfully:", token);

          return res.status(200).json({success:true,message:"Stream token generated successfully",token});

     }catch(error){
          console.error("Error generating Stream token:", error);
          return res.status(500).json({success:false,message:"Error generating Stream token",error});
     }
};