import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // useNavigate hook to redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      console.log(response.data);

      // Store the token and user info in localStorage (or use cookies)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);

      // Redirect the user to a different page after successful login
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}> {/* Disable button when loading */}
          {loading ? 'Logging in...' : 'Log In'} {/* Show loading text */}
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <Link to="/signup" className="signup-link">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
