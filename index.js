// In a real project, you would install these dependencies:
// npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();

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
    // useNewUrlParser and useUnifiedTopology are deprecated but kept for compatibility with older guides.
    // They can be safely removed if you are using a recent version of the mongoose driver.
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Models ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: String,
  source: String,
  resume: String,
  coverLetter: String,
  interviewProcess: String,
  interviewQuestions: String,
  url: String,
  interviewHelperFiles: [{ name: String, path: String }],
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Job = mongoose.model("Job", jobSchema);

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Board = mongoose.model("Board", boardSchema);

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// --- API Routes ---

// 1. Auth Routes
const authRouter = express.Router();
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 2. Board Routes
const boardRouter = express.Router();
boardRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.id });
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

boardRouter.post("/", authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const newBoard = new Board({ name, userId: req.user.id });
    const board = await newBoard.save();
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 3. Job Routes
const jobRouter = express.Router();
jobRouter.get("/board/:boardId", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({
      boardId: req.params.boardId,
      userId: req.user.id,
    });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

jobRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const newJob = new Job({ ...req.body, userId: req.user.id });
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

jobRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    if (job.userId.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

jobRouter.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // --- FIX: Use findByIdAndDelete instead of the deprecated findByIdAndRemove ---
        await Job.findByIdAndDelete(req.params.id);
        
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 4. Upload Routes
const uploadRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

uploadRouter.post("/", upload.single("file"), (req, res) => {
  if (req.file) {
    res.send({ filePath: `/${req.file.path}` });
  } else {
    res.status(400).send({ msg: "File upload failed" });
  }
});

// Use the routers
app.use("/api/auth", authRouter);
app.use("/api/boards", boardRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/upload", uploadRouter);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Job Application Tracker API is running!");
});

// --- Starting the server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
