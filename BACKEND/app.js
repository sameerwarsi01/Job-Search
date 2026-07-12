const express= require("express");
const dotenv=require("dotenv");
const cookieParser= require("cookie-parser");
const cors = require("cors");

const connectDB= require("./Database/db.js");
const userRoutes = require("./routes/User.routes.js");

const app=express();
dotenv.config();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use('/user' , userRoutes);

connectDB();

module.exports=app;