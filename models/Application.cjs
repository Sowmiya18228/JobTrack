
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected", "Withdrawn"],
      default: "Applied",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    date: { type: String, default: "" },
    salary: { type: String, default: "" },
    jobUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
    interviewDate: { type: String, default: "" },
    interviewTime: { type: String, default: "" },
    interviewType: { type: String, default: "" },
    interviewer: { type: String, default: "" },
    interviewNotes: { type: String, default: "" },
    followUpDate: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
