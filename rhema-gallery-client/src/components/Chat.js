import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';

// Set up your server's URL 
const SOCKET_SERVER_URL = 'http://localhost:5000';

const Chat = () => {
  const [socket, setSocket] = useState(null); // To store the socket instance
  const [message, setMessage] = useState(''); // To track the user's message input
  const [messages, setMessages] = useState([]); // To store chat messages

  useEffect(() => {
    // Create a new socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Join the default room 
    newSocket.emit('joinRoom', 'General'); // Using 'General' as the single room name

    // Listen for incoming messages
    newSocket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle sending a message
  const sendMessage = () => {
    if (socket && message) {
      socket.emit('sendMessage', { room: 'General', message }); // Use the single room name
      setMessages((prevMessages) => [...prevMessages, message]); // Add message to local state
      setMessage(''); // Clear the message input
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Room: General</h2> {/* Static room name since there's only one room */}

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>

      <div className="chat-controls">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
