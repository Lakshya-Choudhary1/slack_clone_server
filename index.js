import http from "http";

import app from "./src/app.js";
import env from "./src/configs/env.js";
import {connectDB} from "./src/databases/db.js";

const server  = http.createServer(app);
const port = env.PORT;

const startServer = async ()=>{
     try{

          server.listen(port,()=>{
               console.log(`Server is running on port ${port}`)
          })

          await connectDB();

     }catch(error){
          console.error("Server failed to start:", error.message);
          process.exit(1);
     }
}

startServer();