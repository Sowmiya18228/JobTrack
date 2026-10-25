
const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application.cjs");

const router = express.Router();

const allowedFields = [
  "company", "role", "location", "status", "priority",
  "date", "salary", "jobUrl", "notes", "interviewDate",
  "interviewTime", "interviewType", "interviewer",
  "interviewNotes", "followUpDate"
];

// GET: Retrieve all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(applications.map((item) => ({
      ...item,
      id: item._id.toString(),
    })));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// GET: Retrieve one application
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const item = await Application.findById(req.params.id).lean();

    if (!item) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ ...item, id: item._id.toString() });
  } catch {
    res.status(500).json({ message: "Failed to fetch application" });
  }
});

// POST: Create an application
router.post("/", async (req, res) => {
  try {
    const data = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    const item = await Application.create(data);

    res.status(201).json({
      ...item.toObject(),
      id: item._id.toString(),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to create application" });
  }
});

// PUT: Update an application
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const item = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ ...item.toObject(), id: item._id.toString() });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to update application" });
  }
});

// DELETE: Remove an application
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const item = await Application.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete application" });
  }
});

module.exports = router;
