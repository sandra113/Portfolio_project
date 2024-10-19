const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Cloudinary configuration
const { cloudinary } = require('./config/cloudinaryConfig');

const app = express();
const http = require('http'); // To integrate Socket.io with the server
const server = http.createServer(app);
const { Server } = require('socket.io'); // Importing the Socket.io server
const io = new Server(server); // Initialize Socket.io with the HTTP server
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static("files"));
app.use("/covers", express.static("covers"));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const multer = require('multer');

// multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'coverImage') {
      cb(null, './covers'); // Separate folder for cover images
    } else {
      cb(null, './files'); // Folder for PDFs
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});

// Use the single instance for both file types
const upload = multer({ storage: storage });

// Import the PdfDetails model
require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");

require("./models/User");
const User = mongoose.model("User");

app.post("/signUp", upload.fields([{name: "name"}, { name: "email"}, {password: "password"}]), async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Ensure both files were uploaded
  if (!username || !email || !password) {
    return res.status(400).send({ status: 'error', message: 'all fields are required.' });
  }

  try {
    await User.create({ username: username, email: email, password: password });
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send({ status: "error", message: "Error saving details." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ status: "error", message: "All fields are required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({ status: "error", message: "Invalid email or password." });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).send({ status: "error", message: "Invalid email or password." });
    }

    res.send({ status: "ok", message: "Login successful." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ status: "error", message: "Server error." });
  }
});


// Endpoint to upload PDF files and cover images
app.post("/upload-files", upload.fields([{ name: "file" }, { name: "coverImage" }]), async (req, res) => {
  const title = req.body.title;
  const fileName = req.files['file'] ? req.files['file'][0].filename : null;
  const coverImageName = req.files['coverImage'] ? req.files['coverImage'][0].filename : null;
  console.log('coverimage', coverImageName);

  // Ensure both files were uploaded
  if (!fileName || !coverImageName) {
    return res.status(400).send({ status: 'error', message: 'Both file and cover image are required.' });
  }

  try {
    await PdfSchema.create({ title: title, pdf: fileName, image: coverImageName });
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send({ status: "error", message: "Error saving file details." });
  }
});

// Socket.io Setup for real-time chat functionality
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Joining rooms based on topics
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handling incoming messages
  socket.on('sendMessage', ({ room, message }) => {
    // Broadcast message to users in the room
    io.to(room).emit('receiveMessage', message);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfSchema.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send({ status: "error", error: "Error fetching files." });
  }
});

app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
