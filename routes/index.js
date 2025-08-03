const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/boards");
const jobRoutes = require("./routes/jobs");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/jobtracker";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoutes);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("Job Application Tracker API is running!");
});

// --- Starting the server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
