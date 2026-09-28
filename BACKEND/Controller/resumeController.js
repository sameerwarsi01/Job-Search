// PDF-Parse ke internal font-warning noise ko suppress karne ke liye filter
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("TT: undefined function")) {
    return;
  }
  originalWarn(...args);
};

let pdfParse = require("pdf-parse");
if (typeof pdfParse !== "function") {
  if (pdfParse.default && typeof pdfParse.default === "function") {
    pdfParse = pdfParse.default;
  } else if (pdfParse.pdfParse && typeof pdfParse.pdfParse === "function") {
    pdfParse = pdfParse.pdfParse;
  }
}

const User = require("../Models/user.model.js");
const DOMAIN_SKILLS = require("../Utils/domainSkills.js");

// Helper: Calculate dynamic score & recruiter-grade suggestions
const evaluateResume = (text, targetKeywords, stream) => {
  const lowerCaseText = text.toLowerCase();

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/
  );

  // Exact & partial keyword matching
  const matchedSkills = targetKeywords.filter((skill) =>
    lowerCaseText.includes(skill.toLowerCase())
  );
  const missingSkills = targetKeywords
    .filter((skill) => !lowerCaseText.includes(skill.toLowerCase()))
    .slice(0, 4);

  // Dynamic ATS Score Calculation
  let baseScore = 20;
  if (emailMatch) baseScore += 10;
  if (phoneMatch) baseScore += 10;

  // Skill alignment ratio
  const totalKeywords = targetKeywords.length || 1;
  const matchRatio = matchedSkills.length / totalKeywords;
  const skillScore = Math.round(matchRatio * 58);

  const finalScore = Math.min(96, Math.max(25, baseScore + skillScore));

  const readableStream = stream
    ? stream.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "General";

  const suggestions = [
    `Profile calibrated for ${readableStream}.`,
    matchedSkills.length > 0
      ? `Key extracted skills: ${matchedSkills.slice(0, 4).join(", ")}.`
      : `No direct ${readableStream} skills identified in resume text.`,
    missingSkills.length > 0
      ? `Recommended additions: ${missingSkills.join(", ")}.`
      : `Strong alignment with target domain requirements.`,
  ];

  return {
    score: finalScore,
    matchedSkills: [...new Set(matchedSkills)],
    missingSkills,
    suggestions,
    extractedEmail: emailMatch ? emailMatch[0] : "",
    extractedPhone: phoneMatch ? phoneMatch[0] : "",
  };
};

// 1. Logged-in User Resume Upload (Saves in DB)
const parseAndUploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const targetUserId = (req.user && req.user._id) || req.body.userId;
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing. Provide token or userId in body.",
      });
    }

    const stream = req.body.stream || "software_it";
    const targetKeywords =
      DOMAIN_SKILLS[stream] || DOMAIN_SKILLS["software_it"] || [];

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text || "";

    const {
      score,
      matchedSkills,
      missingSkills,
      suggestions,
      extractedEmail,
      extractedPhone,
    } = evaluateResume(text, targetKeywords, stream);

    const resumePayload = {
      fileName: req.file.originalname,
      uploadedAt: new Date(),
      score,
      skills: matchedSkills,
      missingSkills,
      suggestions,
      extractedEmail,
      extractedPhone,
      rawSummary: text.slice(0, 500).trim(),
    };

    // Update in MongoDB using returnDocument: 'after' (Resolves Mongoose deprecation warning)
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      {
        stream: stream,
        resumeInfo: resumePayload,
      },
      { returnDocument: "after" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with provided ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume processed and details extracted successfully!",
      data: {
        stream,
        ...resumePayload,
      },
    });
  } catch (error) {
    console.error("Resume Extraction Error:", error);
    return res.status(500).json({
      success: false,
      message: "Resume parsing error",
      error: error.message,
    });
  }
};

// 2. Guest Preview (Landing page free scanner - No DB save)
const guestAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const stream = req.body.stream || "software_it";
    const targetKeywords =
      DOMAIN_SKILLS[stream] || DOMAIN_SKILLS["software_it"] || [];

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text || "";

    const analysis = evaluateResume(text, targetKeywords, stream);

    return res.status(200).json({
      success: true,
      data: {
        stream,
        fileName: req.file.originalname,
        ...analysis,
      },
    });
  } catch (error) {
    console.error("Guest Analyze Error:", error);
    return res.status(500).json({
      success: false,
      message: "Resume analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  parseAndUploadResume,
  guestAnalyzeResume,
};