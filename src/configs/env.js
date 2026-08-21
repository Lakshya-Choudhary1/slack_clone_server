import dotenv from  "dotenv";

dotenv.config();

const env = {
     PORT: process.env.PORT,
     MONGODB_URI: process.env.MONGODB_URI,
     WHITELISTED_DOMAINS: process.env.WHITELISTED_DOMAINS,
     NODE_ENV: process.env.NODE_ENV,
     CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
     CLERK_SECRET_KEY : process.env.CLERK_SECRET_KEY,
     SENTRY_DNS: process.env.SENTRY_DNS,
     STREAM_API_KEY: process.env.STREAM_CHAT_API_KEY,
     STREAM_API_SECRET: process.env.STREAM_CHAT_API_SECRET,
     INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
     INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
};

export default env;