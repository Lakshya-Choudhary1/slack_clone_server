import "./configs/instrument.mjs"; 

import express from "express";
import helmet from "helmet";
import cors from "cors";
import {clerkMiddleware,getAuth,clerkClient} from "@clerk/express";
import { serve } from "inngest/express";
import cookieParser from "cookie-parser";
import { inngest, functions } from "./configs/inngest.js";
import * as Sentry from "@sentry/node";
import env from "./configs/env.js";

import chatRoutes from "./routers/chat.routes.js";

const app = express();

//middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
     origin: (origin, callback) => {
          if (env.NODE_ENV === "production") {
               if (!origin ||  env.WHITELISTED_DOMAINS.includes(origin)) {
                    callback(null, true);
               } else {
                    callback(new Error("Not allowed by CORS"));
               }
          } else {
               callback(null, true);
          }
     },
     credentials: true,
}));
app.use(cookieParser());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

app.get("/protected", (req, res) => {

  const auth = getAuth(req);

  res.json({
    cookieReceived: !!req.headers.cookie,
    authorizationReceived: !!req.headers.authorization,
    cookies: req.cookies,
    isAuthenticated: auth.isAuthenticated,
    userId: auth.userId,
    sessionId: auth.sessionId,
  });
});



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