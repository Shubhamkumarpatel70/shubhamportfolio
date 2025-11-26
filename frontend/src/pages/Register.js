import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await axios.post(`${API_URL}/api/auth/register`, registerData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Dispatch event to update header
      window.dispatchEvent(new Event('localStorageChange'));
      
      // Redirect based on user role (new users are always 'user' by default)
      const userRole = response.data.user.role || 'user';
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Glowing background accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-text-primary">Register</h1>
          <p className="text-center text-text-primary/70 mb-6">Create your account to get started.</p>

          {error && (
            <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 border border-red-500/50 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block font-medium mb-2 text-text-primary">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-2 text-text-primary">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium mb-2 text-text-primary">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-medium mb-2 text-text-primary">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center mt-6 text-text-primary/70">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:text-blue-400 hover:underline transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
