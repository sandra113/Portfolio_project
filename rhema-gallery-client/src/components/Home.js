import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Rhema Gallery!</h1>
      <p>Your word is a lamp for my feet, a light on my path. Psalms 119:105</p>
      <div className="auth-links">
        <Link to="/signup" className="button">Sign Up</Link>
        <Link to="/login" className="button">Log In</Link>
      </div>
    </div>
  );
};

export default Home;
