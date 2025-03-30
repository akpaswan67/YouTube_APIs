import express from "express"
import dotenv from "dotenv" ;
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

import { ConnectDB } from "./config/db.config.js";
import  userRoutes from "./routes/userRoutes.js";

dotenv. config();

const app = express();
ConnectDB();

app.use(bodyParser.json());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}));

// middleware
app.use("/api/v1/user", userRoutes);

app.listen(process.env.PORT ,()=>{
console.log(`Server running at Port http://localhost:${process.env.PORT}`);
});



