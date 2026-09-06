import express from "express";
import { getStreamToken } from "../controllers/chat.controllers.js";

const router = express.Router();

router.get("/test", (req, res) => {
     res.status(200).json({success:true, message: "Chat route is working!" });
});

router.get("/token",getStreamToken);

export default  router;