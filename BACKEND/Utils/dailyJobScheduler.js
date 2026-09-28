const cron = require("node-cron");
const User = require("../Models/user.model.js");
const Job = require("../Models/job.models.js");
const { sendJobAlertEmail } = require("./mailer.js");

// Safely handle special characters (e.g., C++)
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const initDailyJobScheduler = () => {
// Runs daily at 9:00 AM IST
  cron.schedule(
    "0 9 * * *",
    async () => {
      console.log("⏰ [Cron] Daily resume-based job matching started...");

      try {
        const users = await User.find({
          email: { $exists: true,$ne: "" },
          jobAlertsEnabled: { $ne: false },$or: [
            { "resumeInfo.skills.0": { $exists: true } },
            { stream: { $exists: true } },
          ],
        });

        console.log(`🔍 [Cron] Found ${users.length} active candidate profiles to evaluate.`);

        for (const targetUser of users) {
          const candidateSkills = targetUser.resumeInfo?.skills || [];
          const candidateStream = targetUser.stream || "software_it";

          const queryConditions = [{ category: candidateStream }];

          if (candidateSkills.length > 0) {
            queryConditions.push({
              skills: {
                $in: candidateSkills
                  .filter(Boolean)
                  .map((s) => new RegExp(`^${escapeRegex(s.trim())}$`, "i")),
              },
            });
          }

          const matchedJobs = await Job.find({ $or: queryConditions })
            .sort({ createdAt: -1 })
            .limit(5);

          if (matchedJobs.length > 0) {
            const recipientName =
              targetUser.fullname?.firstname ||
              targetUser.fullname?.lastname ||
              targetUser.name?.split(" ")[0] ||
              "Candidate";

            await sendJobAlertEmail(targetUser.email, recipientName, matchedJobs);
            console.log(`✉️ [Cron] Job alert dispatched successfully to: ${targetUser.email}`);
          }
        }
      } catch (error) {
        console.error("❌ [Cron] Error running daily job matching:", error.message);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata", // Indian Standard Time (Production safe)
    }
  );
};

module.exports = initDailyJobScheduler;