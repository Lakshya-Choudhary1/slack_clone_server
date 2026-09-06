export const getStreamToken = async(req,res)=>{
     return res.status(200).json({success:true, message: "Stream token route is working!" });
};