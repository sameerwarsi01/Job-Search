const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    round: {
      type: String,
      enum: [
        "HR Round",
        "Technical Round 1",
        "Technical Round 2",
        "System Design",
        "Managerial",
        "Final Round",
      ],
      default: "Technical Round 1",
    },
    interviewDate: {
      type: Date,
      required: true,
    },
    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },
    interviewerName: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
      default: "Scheduled",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);