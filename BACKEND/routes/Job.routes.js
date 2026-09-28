const express = require("express");
const router = express.Router();
const Job = require("../Models/job.models.js");
const User = require("../Models/user.model.js");
const { userAuthentication } = require("../Middleware/userMiddleware.js");

// 1. STRICT INDIA LIVE JOBS SYNC ENGINE (Adzuna India - Fresh/Date-Sorted)
router.post("/sync-matched", async (req, res) => {
  try {
    const { skills = [], targetRole = "Developer", stream = "software_it" } = req.body;

    const queryTerm = skills.length > 0 ? skills[0] : targetRole;
    const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
    const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

    let liveIndianJobs = [];

    if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=25&what=${encodeURIComponent(queryTerm)}&content-type=application/json`;

      const apiRes = await fetch(url);
      const data = await apiRes.json();

      if (data && Array.isArray(data.results)) {
        // Sort descending by created timestamp
        const sortedResults = data.results.sort((a, b) => {
          const dateA = a.created ? new Date(a.created).getTime() : 0;
          const dateB = b.created ? new Date(b.created).getTime() : 0;
          return dateB - dateA;
        });

        liveIndianJobs = sortedResults.slice(0, 15).map((job) => {
          const title = (job.title || "").replace(/<\/?[^>]+(>|$)/g, "");
          const desc = (job.description || "").replace(/<\/?[^>]+(>|$)/g, "");
          const combined = `${title} ${desc}`.toLowerCase();

          let mode = "Onsite";
          if (combined.includes("hybrid")) mode = "Hybrid";
          else if (combined.includes("remote") || combined.includes("work from home")) mode = "Remote";

          let salaryText = "Competitive";
          if (job.salary_min && job.salary_max) {
            salaryText = `₹${Math.round(job.salary_min / 100000)}L - ₹${Math.round(job.salary_max / 100000)}L`;
          } else if (job.salary_min) {
            salaryText = `₹${Math.round(job.salary_min / 100000)}L+`;
          }

          const jobDate = job.created ? new Date(job.created) : new Date();

          return {
            company: job.company?.display_name || "Tech Partner",
            role: title,
            stream: stream,
            skillsRequired: skills.length > 0 ? skills.slice(0, 5) : [targetRole],
            location: job.location?.display_name || "India",
            salary: salaryText,
            jobLink: job.redirect_url,
            externalId: `adzuna_${job.id}`,
            jobType: job.contract_time === "full_time" ? "Full-time" : "Contract/Intern",
            workMode: mode,
            status: "Applied",
            priority: "High",
            postedAt: isNaN(jobDate.getTime()) ? new Date() : jobDate,
            notes: `Synced for ${queryTerm}`,
          };
        });
      }
    }

    if (liveIndianJobs.length > 0) {
      await Job.deleteMany({ isSaved: { $ne: true } });
      await Job.insertMany(liveIndianJobs);
    }

    const currentJobs = await Job.find().sort({ postedAt: -1, _id: -1 });

    return res.status(200).json({
      success: true,
      message: `Fresh Indian job postings synced!`,
      jobs: currentJobs,
    });
  } catch (error) {
    console.error("India Job Sync Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET ALL SAVED JOBS
router.get("/saved", async (req, res) => {
  try {
    const savedJobs = await Job.find({ isSaved: true }).sort({ updatedAt: -1 });
    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved jobs", error: error.message });
  }
});

// 3. TOGGLE SAVE / UNSAVE STATUS
router.patch("/:id/toggle-save", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.isSaved = !job.isSaved;
    await job.save();

    res.status(200).json({
      message: job.isSaved ? "Job bookmarked" : "Job unbookmarked",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating saved status", error: error.message });
  }
});

// 4. GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1, createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

// 5. CREATE NEW MANUAL JOB
router.post("/", userAuthentication, async (req, res) => {
  try {
    const { company, role, location, salary, status, priority, jobLink, notes, date, workMode } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: "Company and Role are required." });
    }

    const newJob = new Job({
      user: req.user._id,
      company: company.trim(),
      role: role.trim(),
      location: location || "Remote",
      workMode: workMode || "Remote",
      salary: salary || "",
      status: status || "Applied",
      priority: priority || "Medium",
      jobLink: jobLink || "",
      notes: notes || "",
      postedAt: date ? new Date(date) : new Date(),
    });

    const saved = await newJob.save();
    res.status(201).json(saved);
  } catch (e) {
    console.error("Job creation error:", e);
    res.status(400).json({ error: e.message });
  }
});

// 6. UPDATE JOB
router.put("/:id", async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    res.status(200).json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 7. DELETE JOB
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;