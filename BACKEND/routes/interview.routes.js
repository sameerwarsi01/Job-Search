const express = require("express");
const router = express.Router();
const Interview = require("../Models/interview.models.js");

router.get("/", async (requestAnimationFrame, res) => {
    try {
        const interviews = await Interview.find().sort({ InterviewDate: 1});
        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({message: "Error Fetching interviews", error: error.message});
    }
});

// Create New Interview Schedule
router.post("/", async (req, res) => {
    try {
        const newInterview = new Interview(req.body);
        const saved = await newInterview.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({message: "failed to scheduled interview", error: error.message});
    }
});

// Update Interview (status, Notes, Reschedule)
router.put("/:id", async (req, res) => {
    try {
        const updated = await Interview.findByIdAndUpdate(res.params.id, req.body, {
            new: true,
            runValidator: true,
        });
        if(!updated){
            return res.status(400).json({ message: "Interview Not Found"} );
        }
        res.status(200).json(updated)
    } catch {
        res.status(400).json({ message: "Failed to Update Interview", error: error.message });
    }
});

// Delete Interview
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Interview.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({ message: "Interview Not Found" });
        }
        res.status(200).json({ message: "Interview Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to Delete Interview", error: error.message });
    }
});

module.exports = router;