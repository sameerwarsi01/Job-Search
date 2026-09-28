const express = require("express");
const multer = require("multer");
const {
  parseAndUploadResume,
  guestAnalyzeResume,
} = require("../Controller/resumeController.js");

const router = express.Router();

// Memory storage use karein taaki buffer controller me direct mil sake
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 1. Landing Page: Guest ATS Analyzer (Stateless - No DB save)
router.post("/guest-analyze", upload.single("resume"), guestAnalyzeResume);

// 2. Dashboard: Authenticated User Resume Upload (Saves in DB)
router.post("/upload", upload.single("resume"), parseAndUploadResume);

module.exports = router;