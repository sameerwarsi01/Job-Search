const cron = require("node-cron");
const User = require("../Models/user.model.js");
const Job = require("../Models/job.models.js");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Title aur description se real WorkMode detect karna
const detectWorkMode = (title = "", desc = "") => {
  const combined = `${title} ${desc}`.toLowerCase();
  if (combined.includes("hybrid")) return "Hybrid";
  if (combined.includes("remote") || combined.includes("work from home")) return "Remote";
  return "Onsite";
};

// 1. Live Job Fetcher (Adzuna India Live Endpoint)
const fetchLiveIndianJobs = async (searchQuery = "technology") => {
  try {
    const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
    const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      console.warn("⚠️ Adzuna credentials missing in .env for cron job!");
      return [];
    }

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=10&what=${encodeURIComponent(searchQuery)}&content-type=application/json`;

    const response = await fetch(url);
    const data = await response.json();
    const rawJobs = data.results || [];

    return rawJobs.map((job) => {
      const cleanTitle = (job.title || "").replace(/<\/?[^>]+(>|$)/g, "");
      const cleanDesc = (job.description || "").replace(/<\/?[^>]+(>|$)/g, "");

      return {
        title: cleanTitle,
        company: job.company?.display_name || "Indian Tech Partner",
        location: job.location?.display_name || "India",
        url: job.redirect_url,
        description: cleanDesc,
        workMode: detectWorkMode(cleanTitle, cleanDesc),
        postedAt: job.created ? new Date(job.created) : new Date(),
        salary: job.salary_min
          ? `₹${Math.round(job.salary_min / 100000)}L - ₹${Math.round((job.salary_max || job.salary_min) / 100000)}L`
          : "Competitive",
      };
    });
  } catch (error) {
    console.error("Adzuna Live Feed Error in Cron:", error.message);
    return [];
  }
};

// 2. Resume & Skills Matcher + DB Save + Email Alert Engine
const runDailyMatchingJobAlerts = async () => {
  console.log("📡 Fetching REAL-TIME Indian jobs for daily digest...");

  try {
    const users = await User.find({ jobAlertsEnabled: true });
    if (!users.length) {
      console.log("No active candidates with alerts enabled.");
      return;
    }

    for (const user of users) {
      const userSkills = (user.skills || []).map((s) => s.toLowerCase().trim());
      const userTargetRole = user.targetRole || "Software Developer";
      
      // Dynamic search query candidate ke preference ke hisaab se
      const queryTerm = userSkills.length > 0 ? userSkills.slice(0, 2).join(" ") : userTargetRole;

      const liveJobsPool = await fetchLiveIndianJobs(queryTerm);
      if (!liveJobsPool.length) continue;

      const matched = liveJobsPool.slice(0, 3); // Top 3 Indian matched jobs

      if (matched.length > 0) {
        // Database mein save/update
        for (const job of matched) {
          await Job.findOneAndUpdate(
            { user: user._id, company: job.company, role: job.title },
            {
              user: user._id,
              company: job.company,
              role: job.title,
              location: job.location,
              workMode: job.workMode,
              stream: user.stream || "software_it",
              skillsRequired: userSkills.length > 0 ? userSkills.slice(0, 5) : [userTargetRole],
              salary: job.salary,
              status: "Applied",
              priority: "High",
              jobLink: job.url,
              notes: `Auto-synced via daily radar (${queryTerm})`,
              postedAt: job.postedAt || new Date(),
            },
            { upsert: true, returnDocument: "after" }
          );
        }
        console.log(`💾 Auto-saved ${matched.length} Indian jobs into DB for: ${user.email}`);

        // Email Digest Template
        const jobListHtml = matched
          .map(
            (j) => `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:15px; margin-bottom:12px; font-family: sans-serif;">
              <h3 style="margin:0 0 4px 0; color:#1e293b; font-size:16px;">${j.title}</h3>
              <p style="margin:0 0 8px 0; color:#475569; font-size:14px;">
                <strong>${j.company}</strong> • <span style="color:#059669; font-weight:600;">${j.location}</span> (${j.workMode})
              </p>
              <a href="${j.url}" target="_blank" style="display:inline-block; background:#4f46e5; color:white; padding:8px 16px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:bold;">
                View & Apply on Board →
              </a>
            </div>`
          )
          .join("");

        const mailOptions = {
          from: `"Daily Job Radar" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `⚡ Live Openings Matched: ${matched.length} New Jobs for You!`,
          html: `
            <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e2e8f0; border-radius:12px; padding:24px; background:#ffffff;">
              <h2 style="color:#4f46e5; margin-top:0;">Real-Time Job Alerts 🚀</h2>
              <p style="color:#475569; font-size:14px;">
                Hi <strong>${user.fullname?.firstname || user.name || "Candidate"}</strong>,<br/>
                Aapke profile aur skills ke matching fresh Indian market ki openings mili hain:
              </p>
              ${jobListHtml}
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:20px 0;" />
              <p style="color:#94a3b8; font-size:12px; margin-bottom:0;">
                Yeh jobs aapke Applications dashboard par bhi sync kar di gayi hain!
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📨 Live jobs digest sent to: ${user.email}`);
      }
    }
  } catch (error) {
    console.error("Match Engine Error:", error.message);
  }
};

// Scheduler (Subah 9:00 AM Indian Standard Time)
const startAutoJobService = () => {
  console.log("⏰ Daily Auto Job Matcher Service scheduled for 9:00 AM IST daily.");

  cron.schedule(
    "0 9 * * *",
    () => {
      runDailyMatchingJobAlerts();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports = { startAutoJobService, runDailyMatchingJobAlerts };