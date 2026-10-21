import "./configs/instrument.mjs";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import { clerkMiddleware, getAuth, clerkClient } from "@clerk/express";
import { serve } from "inngest/express";
import cookieParser from "cookie-parser";
import { inngest, functions } from "./configs/inngest.js";
import * as Sentry from "@sentry/node";
import env from "./configs/env.js";
import User from "./models/user.model.js";

import chatRoutes from "./routers/chat.routes.js";

const app = express();

//middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (env.NODE_ENV === "production") {
        if (!origin || env.WHITELISTED_DOMAINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

app.get("/protected", async (req, res) => {
  const auth = getAuth(req);

  if (!auth.isAuthenticated) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized! you need to be logged in to access.",
        request: auth,
      });
  }

  const clerkUser = await clerkClient.users.getUser(auth.userId);

  if (!clerkUser) {
    return res
      .status(404)
      .json({
        success: false,
        message: "User not found in Clerk.",
        request: auth,
      });
  }

  res.json({
    cookieReceived: !!req.headers.cookie,
    authorizationReceived: !!req.headers.authorization,
    cookies: req.cookies,
    isAuthenticated: auth.isAuthenticated,
    userId: auth.userId,
    sessionId: auth.sessionId,
    clerkUser: clerkUser,
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok", date: new Date().toISOString() });
});

export default app;
