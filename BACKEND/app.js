
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const connectDb = require("./Database/db.js");

const app = express();


connectDb();

module.exports = app;