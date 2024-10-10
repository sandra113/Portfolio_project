import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Library from './components/Library'; 
import Chat from './components/Chat';
import Home from './components/Home'; // Import the new Home component
import SignUp from './components/SignUp'; // Import the Sign-Up component
import Login from './components/Login'; // Import the Login component
import logo from './logo.svg'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Rhema Gallery</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/library">Library</Link>
            <Link to="/chat">Chat</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <footer>
          <p>&copy; 2024 Rhema Gallery</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
