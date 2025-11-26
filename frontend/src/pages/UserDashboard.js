import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const UserDashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      fetchPurchases();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/public/my-coffee-purchases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 p-8 rounded-2xl shadow-2xl text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-4 text-text-primary">Login Required</h1>
          <p className="text-text-primary/70 mb-6">
            Please login to view your dashboard
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/50 transition-all"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  const approvedPurchases = purchases.filter(p => p.status === 'approved');

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 shadow-2xl mb-6">
          <h1 className="text-4xl font-bold mb-2 text-text-primary">My Dashboard</h1>
          <p className="text-text-primary/70">View your coffee purchases and project access</p>
        </div>

        {approvedPurchases.length > 0 && (
          <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 shadow-2xl mb-6">
            <h2 className="text-2xl font-bold mb-6 text-text-primary">Approved Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedPurchases.map(purchase => (
                <div
                  key={purchase._id}
                  className="bg-bg-dark/50 border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all"
                >
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {purchase.projectTitle}
                  </h3>
                  <p className="text-text-primary/70 text-sm mb-4">
                    Purchased {purchase.numberOfCoffees} coffee{purchase.numberOfCoffees > 1 ? 's' : ''} for ₹{purchase.totalAmount.toFixed(2)}
                  </p>
                  {purchase.projectLink && (
                    <a
                      href={purchase.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-500 transition-all"
                    >
                      Access Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">All Purchases</h2>
          {purchases.length === 0 ? (
            <div className="text-center text-text-primary/70 py-8">
              <p className="mb-4">No purchases yet.</p>
              <Link
                to="/projects"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-500 transition-all"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map(purchase => (
                <div
                  key={purchase._id}
                  className="bg-bg-dark/50 border border-primary/20 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {purchase.projectTitle}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(purchase.status)}`}>
                      {purchase.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-text-primary/70">
                    <p>
                      <span className="font-medium">Coffees:</span> {purchase.numberOfCoffees}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> ₹{purchase.totalAmount.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span> {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                    {purchase.rejectionReason && (
                      <p className="text-red-400">
                        <span className="font-medium">Rejection Reason:</span> {purchase.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

