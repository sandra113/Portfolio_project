import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from "axios";
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state to show error messages if sign-up fails
  const navigate = useNavigate(); // useNavigate hook to redirect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when the form is submitted

    try {
      const result = await axios.post("http://localhost:5000/signUp", formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(result.data);
      
      // After successful sign-up, redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error("Error during sign-up:", error.response ? error.response.data : error.message);
      setError('Sign-up failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading whether sign-up succeeds or fails
    }
  };

  return (
    <div className="sign-up">
      <h2>Sign Up</h2>

      {/* Display error message if sign-up fails */}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Disable the button and show loading state when signing up */}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
