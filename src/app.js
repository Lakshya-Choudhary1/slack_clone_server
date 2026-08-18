import express from "express";
import helmet from "helmet";
import cors from "cors";

import env from "./configs/env.js";

const app = express();

//middlewares
app.use(helmet({}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cors({
     origin: (origin, callback) => {
          if (env.NODE_ENV === "production") {
               // Allow requests from the production domain,
               // Replace "your-production-domain.com" with your actual domain
               if (!origin ||  env.WHITELISTED_DOMAINS.includes(origin)) {
                    callback(null, true);
               } else {
                    callback(new Error("Not allowed by CORS"));
               }
          } else {
               // Allow requests from localhost during development
               callback(null, true);
          }
     },
     methods: ["GET", "POST", "PUT", "DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
}));



app.get("/health", (req, res) => {
     res.status(200).json({ status: "ok" });
});

export default app;