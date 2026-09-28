const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
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
    // Stream match ke liye zaroori fields
    stream: {
      type: String,
      enum: [
        "software_it",
        "marketing",
        "finance_accounting",
        "human_resources",
        "design_creative",
        "sales_business",
        "general",
      ],
      default: "software_it",
      index: true,
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      default: "-",
    },
    salary: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
    },
    jobLink: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    externalId: {
      type: String,
      sparse: true,
      unique: true,
    },
    jobType: {
      type: String,
      trim: true,
    },
    workMode: {
      type: String,
      trim: true,
    },
    postedAt: {
      type: Date,
      default: Date.now, // bina parenthesis ke dynamic banaya
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);