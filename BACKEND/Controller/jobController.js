const Job = require("../Models/job.models");
const User = require("../Models/user.model");
const nodemailer = require("nodemailer");

// Email Transporter (Nodemailer setup)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Send Instant Alert Email
const sendJobAlertEmail = async (userEmail, userName, jobDetails) => {
  try {
    const mailOptions = {
      from: `"Job Tracker Alerts" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🎯 New Job Opportunity: ${jobDetails.role} at ${jobDetails.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #4f46e5; margin-bottom: 5px;">New Job Alert!</h2>
          <p style="color: #475569; font-size: 14px;">Hi ${userName}, a new job matching your profile was just added:</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 4px 0; font-size: 16px;"><strong>Role:</strong> ${jobDetails.role}</p>
            <p style="margin: 4px 0; font-size: 15px;"><strong>Company:</strong> ${jobDetails.company}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #64748b;"><strong>Location:</strong> ${jobDetails.location || "India"}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #64748b;"><strong>Work Mode:</strong> ${jobDetails.workMode || "Onsite"}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #64748b;"><strong>Status:</strong> ${jobDetails.status}</p>
          </div>

          <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
            You received this because Daily Job Alerts are enabled on your dashboard.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Instant alert email sent to: ${userEmail}`);
  } catch (err) {
    console.error("Failed to send job alert email:", err.message);
  }
};

// 1. Get all jobs for the logged-in user only
const getUserJobs = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const jobs = await Job.find({ user: userId }).sort({ postedAt: -1, createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// 2. Create a new job (All fields support + Duplicate check + Instant alert)
const createJob = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { company, role, status, location, salary, priority, workMode, jobLink, notes, date } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required." });
    }

    // Duplicate Check: Same user, company aur role match
    const existingJob = await Job.findOne({
      user: userId,
      company: { $regex: new RegExp(`^${company.trim()}$`, "i") },
      role: { $regex: new RegExp(`^${role.trim()}$`, "i") },
    });

    if (existingJob) {
      return res.status(409).json({
        message: "This job is already in your dashboard.",
        job: existingJob,
      });
    }

    const newJob = new Job({
      user: userId,
      company: company.trim(),
      role: role.trim(),
      status: status || "Applied",
      priority: priority || "Medium",
      location: location || "India",
      workMode: workMode || "Onsite",
      salary: salary || "",
      jobLink: jobLink || "",
      notes: notes || "",
      postedAt: date ? new Date(date) : new Date(),
    });

    const savedJob = await newJob.save();

    // Instant Alert Logic
    const user = await User.findById(userId);
    if (user && user.jobAlertsEnabled) {
      const userName = user.fullname?.firstname || user.name || "Candidate";
      sendJobAlertEmail(user.email, userName, savedJob);
    }

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: "Failed to create job", error: error.message });
  }
};

// 3. Update a job (Mongoose warning resolved)
const updateJob = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { returnDocument: "after" }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job", error: error.message });
  }
};

// 4. Delete a job
const deleteJob = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const deletedJob = await Job.findOneAndDelete({ _id: id, user: userId });

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};

module.exports = {
  getUserJobs,
  createJob,
  updateJob,
  deleteJob,
};