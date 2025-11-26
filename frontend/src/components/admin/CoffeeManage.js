import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const CoffeeManage = () => {
  const [coffeeData, setCoffeeData] = useState({
    minCoffee: 1,
    maxCoffee: 10,
    coffeePrice: 5
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCoffeeData();
  }, []);

  const fetchCoffeeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/coffee`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setCoffeeData(response.data);
      }
    } catch (error) {
      console.error('Error fetching coffee data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoffeeData({
      ...coffeeData,
      [name]: parseFloat(value) || 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (coffeeData.minCoffee < 0) {
      setMessage({ type: 'error', text: 'Minimum coffee must be 0 or greater' });
      setLoading(false);
      return;
    }
    if (coffeeData.maxCoffee < coffeeData.minCoffee) {
      setMessage({ type: 'error', text: 'Maximum coffee must be greater than or equal to minimum coffee' });
      setLoading(false);
      return;
    }
    if (coffeeData.coffeePrice < 0) {
      setMessage({ type: 'error', text: 'Coffee price must be 0 or greater' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/admin/coffee`, coffeeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Coffee settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Manage Coffee Prices</h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2 text-text-primary">
            Minimum Coffee
          </label>
          <input
            type="number"
            name="minCoffee"
            value={coffeeData.minCoffee}
            onChange={handleChange}
            min="0"
            step="1"
            required
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
          <p className="text-text-primary/60 text-sm mt-2">Minimum number of coffees a user can buy</p>
        </div>

        <div>
          <label className="block font-medium mb-2 text-text-primary">
            Maximum Coffee
          </label>
          <input
            type="number"
            name="maxCoffee"
            value={coffeeData.maxCoffee}
            onChange={handleChange}
            min="1"
            step="1"
            required
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
          <p className="text-text-primary/60 text-sm mt-2">Maximum number of coffees a user can buy</p>
        </div>

        <div>
          <label className="block font-medium mb-2 text-text-primary">
            Coffee Price (INR)
          </label>
          <input
            type="number"
            name="coffeePrice"
            value={coffeeData.coffeePrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
          <p className="text-text-primary/60 text-sm mt-2">Price per coffee in INR (₹)</p>
        </div>

        <div className="bg-card-bg/50 border border-primary/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Preview</h3>
          <p className="text-text-primary/70 text-sm">
            Users can buy between <span className="text-primary font-semibold">{coffeeData.minCoffee}</span> and{' '}
            <span className="text-primary font-semibold">{coffeeData.maxCoffee}</span> coffees
          </p>
          <p className="text-text-primary/70 text-sm mt-1">
            Price per coffee: <span className="text-primary font-semibold">₹{coffeeData.coffeePrice.toFixed(2)}</span>
          </p>
          <p className="text-text-primary/70 text-sm mt-1">
            Total for {coffeeData.maxCoffee} coffee{coffeeData.maxCoffee > 1 ? 's' : ''}:{' '}
            <span className="text-primary font-semibold">₹{(coffeeData.maxCoffee * coffeeData.coffeePrice).toFixed(2)}</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-500 transition-all disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Coffee Settings'}
        </button>
      </form>
    </div>
  );
};

export default CoffeeManage;

