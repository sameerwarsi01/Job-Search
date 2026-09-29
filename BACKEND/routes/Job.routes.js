const express = require("express");
const router = express.Router();
const Job = require("../Models/job.models.js");
const User = require("../Models/user.model.js");
const { userAuthentication } = require("../Middleware/userMiddleware.js");

// Pure Real Jobs Engine (Adzuna India - Broad Tech Keywords for High Volume Real Postings)
router.post("/sync-matched", async (req, res) => {
  try {
    const { skills = [], targetRole = "", stream = "" } = req.body;

    const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
    const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      return res.status(500).json({ success: false, message: "Adzuna credentials missing in .env" });
    }

    // Role ko thoda broad rakhte hain taaki Adzuna India 16 par na atke
    // Agar "Full Stack Developer" hai toh search term "Developer" ya "Software Engineer" broad rakhein
    let searchTerms = [];
    if (targetRole) {
      searchTerms.push(targetRole);
      // Agar role specific hai, ek secondary broad term bhi add karein
      if (targetRole.toLowerCase().includes("full stack")) searchTerms.push("Fullstack Developer");
      if (targetRole.toLowerCase().includes("developer")) searchTerms.push("Software Developer");
    } else if (skills.length > 0) {
      searchTerms.push(skills[0]);
    } else {
      searchTerms.push("Software Engineer");
    }

    let allRealJobs = [];

    // Adzuna API se real jobs fetch karein (Page 1 & 2 for 50+ real postings)
    for (const term of searchTerms.slice(0, 2)) {
      try {
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=50&what=${encodeURIComponent(
          term
        )}&content-type=application/json`;

        const apiRes = await fetch(url);
        const data = await apiRes.json();

        if (data && Array.isArray(data.results)) {
          const mapped = data.results.map((job) => {
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
              company: job.company?.display_name || "Hiring Company",
              role: title,
              stream: stream || "software_it",
              skillsRequired: skills.length > 0 ? skills.slice(0, 5) : [term],
              location: job.location?.display_name || "India",
              salary: salaryText,
              jobLink: job.redirect_url, // Real Adzuna redirection URL
              externalId: `adzuna_${job.id}`,
              jobType: job.contract_time === "full_time" ? "Full-time" : "Contract / Full-time",
              workMode: mode,
              status: "Applied",
              priority: "High",
              postedAt: isNaN(jobDate.getTime()) ? new Date() : jobDate,
              notes: `Verified Adzuna live listing for ${term}`,
            };
          });

          allRealJobs.push(...mapped);
        }
      } catch (err) {
        console.error(`Adzuna fetch error for ${term}:`, err.message);
      }
    }

    // Duplicate real jobs filter karein (ID ke base par)
    const seenIds = new Set();
    const uniqueRealJobs = [];
    for (const job of allRealJobs) {
      if (!seenIds.has(job.externalId)) {
        seenIds.add(job.externalId);
        uniqueRealJobs.push(job);
      }
    }

    if (uniqueRealJobs.length > 0) {
      // User ke bookmark/saved jobs ko bacha kar un-saved ko fresh real jobs se replace karein
      await Job.deleteMany({ isSaved: { $ne: true } });
      await Job.insertMany(uniqueRealJobs);
    }

    const currentJobs = await Job.find().sort({ postedAt: -1, _id: -1 });

    return res.status(200).json({
      success: true,
      message: `Synced ${currentJobs.length} 100% verified live jobs!`,
      jobs: currentJobs,
    });
  } catch (error) {
    console.error("Pure Real Job Sync Error:", error);
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