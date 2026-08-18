import http from "http";

import app from "./src/app.js";
import env from "./src/configs/env.js";

const server  = http.createServer(app);
const port = env.PORT;

server.listen(port,()=>{
     console.log(`Server is running on port ${port}`)
})