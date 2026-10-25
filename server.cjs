
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const applicationRoutes = require("./routes/applications.cjs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100kb" }));

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "JobTrack API is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Application CRUD routes
app.use("/api/applications", applicationRoutes);

async function startServer() {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error(
        "MONGODB_URI is missing. Check your .env file."
      );
    }

    if (
      !uri.startsWith("mongodb+srv://") &&
      !uri.startsWith("mongodb://")
    ) {
      throw new Error(
        "MONGODB_URI must start with mongodb:// or mongodb+srv://"
      );
    }

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully!");
    console.log("Database:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`JobTrack API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("\nMongoDB connection failed.");
    console.error("Error:", error.message);

    if (error.reason?.servers) {
      console.error("\nServer details:");

      for (const [host, info] of error.reason.servers) {
        console.error(`Host: ${host}`);
        console.error(
          "Details:",
          info.error?.message || "No additional details"
        );
      }
    }

    process.exitCode = 1;
  }
}

startServer();
