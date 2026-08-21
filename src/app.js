import express from "express";
import helmet from "helmet";
import cors from "cors";
import {clerkMiddleware,getAuth,clerkClient} from "@clerk/express";
import * as Sentry from "@sentry/node";

import env from "./configs/env.js";

import "./sentry/instrument.js"; // Import the Sentry instrumentation

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
app.use(clerkMiddleware());

app.get("/protected",async (req,res)=>{
     const {isAuthenticated,userId} = getAuth(req);

     if(!isAuthenticated){
          return res.status(401).json({message:"Unauthorized"});
     }

     try{

          const user = await clerkClient.users.getUser(userId);

          if(!user){
               return res.status(404).json({message:"User not found"});
          }

          return res.status(200).json({message:"User data fetched successfully",user});

     }catch(error){
          console.error("Error fetching user data:", error);
          return status(500).json({message:"Internal Server Error"});
     }

})

app.get("/health", (req, res) => {
     res.status(200).json({ status: "ok" });
});

Sentry.setupExpressErrorHandler(app); // Setup Sentry error handlers

app.use((err,req,res,next)=>{
     res.statusCode = 500;
     res.end(res.sentry+"\n");
})

app.get("/debug-sentry", function mainHandler(req, res) {
  // Send a log before throwing the error
  Sentry.logger.info('User triggered test error', {
    action: 'test_error_endpoint',
  });
  // Send a test metric before throwing the error
  Sentry.metrics.count('test_counter', 1);
  throw new Error("My first Sentry error!");
});

export default app;