const nodemailer = require("nodemailer");

// 1. Gmail SMTP Transporter config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a stylized HTML email with matched jobs to the candidate
 * @param {string} userEmail 
 * @param {string} userName 
 * @param {Array} matchedJobs 
 */
const sendJobAlertEmail = async (userEmail, userName, matchedJobs) => {
  if (!matchedJobs || matchedJobs.length === 0) return;

  // every mathched job for a generate html cards
  const jobsListHtml = matchedJobs
    .slice(0, 5)
    .map(
      (job) => `
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 12px; background-color: #ffffff;">
        <h3 style="margin: 0 0 6px 0; color: #4338ca; font-size: 16px;">${job.title || job.role || "Software Role"}</h3>
        <p style="margin: 0 0 6px 0; color: #475569; font-size: 13px;">
          <strong>Company:</strong> ${job.company || job.companyName || "Hiring Partner"} &nbsp;|&nbsp; 
          <strong>Location:</strong> ${job.location || "Remote / Hybrid"}
        </p>
        <p style="margin: 0; color: #64748b; font-size: 12px;">
          <strong>Matched Skills:</strong> ${(job.skills || []).join(", ") || "Relevant to your domain"}
        </p>
      </div>
    `
    )
    .join("");

  const mailOptions = {
    from: `"Job Tracker Alerts" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🎯 New Job Matches Found for You, ${userName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 12px; color: #334155;">
        <h2 style="color: #4f46e5; margin-top: 0;">Daily Job Digest</h2>
        <p style="font-size: 14px; line-height: 1.5;">Hi <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.5; color: #64748b;">
          Aapke uploaded resume aur saved tech skills ke hisaab se aaj ke fresh job matches:
        </p>
        
        <div style="margin: 20px 0;">
          ${jobsListHtml}
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <a href="http://localhost:5173/dashboard" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            Open Dashboard & Apply
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
          Job Tracker AI Engine • Auto-matched based on your verified skills & resume.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendJobAlertEmail };