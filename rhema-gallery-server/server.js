const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Ensure you load your environment variables first

// Import route files
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/bookRoutes');

// Cloudinary configuration
const { cloudinary } = require('./config/cloudinaryConfig'); // Import Cloudinary instance

const app = express();
const http = require('http'); // To integrate Socket.io with the server
const server = http.createServer(app); // Create the HTTP server
const { Server } = require('socket.io'); // Importing the Socket.io server
const io = new Server(server); // Initialize Socket.io with the HTTP server
const port = process.env.PORT || 5000; // Use PORT from environment variables or default to 5000

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api', bookRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
