import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ setAuth, setError }) => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorState] = useState(''); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorState(''); // Clear previous errors

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      console.log(response.data);

      const { token } = response.data;
      sessionStorage.setItem('token', token);
      setAuth(true); 

      // Redirect the user after successful login
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorState('Invalid email or password'); // Use setErrorState to update the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
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
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
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
