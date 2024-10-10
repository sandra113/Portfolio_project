const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config(); // Ensure you load your environment variables first

// Import route files
const authRoutes = require('./routes/auth');
const sermonRoutes = require('./routes/sermonRoutes');
const songRoutes = require('./routes/songRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const http = require('http'); // To integrate Socket.io with the server
const server = http.createServer(app); // Create the HTTP server
const { Server } = require('socket.io'); // Importing the Socket.io server
const io = new Server(server); // Initialize Socket.io with the HTTP server
const port = 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use('/api/auth', authRoutes);

// Use the routes
app.use('/api', sermonRoutes);
app.use('/api', songRoutes);
app.use('/api', bookRoutes);

// Endpoint to fetch sermon videos from YouTube
app.get('/api/sermons/videos', async (req, res) => {
  try {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY; // Use environment variable for security
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        maxResults: 10,
        q: 'sermon',
        key: youtubeApiKey,
      },
    });
    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching videos from YouTube:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {})
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
