const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./Database/db.js");
const userRoutes = require("./routes/User.routes.js");
const jobRoutes = require("./routes/Job.routes.js");
const interviewRoutes = require("./routes/interview.routes.js");
const resumeRoutes = require("./routes/resumeRoutes");
const paymentRoutes = require("./routes/payment.routes.js");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://job-search-liard-sigma.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route Mounts
app.use("/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/payment", paymentRoutes);

connectDB();

module.exports = app;