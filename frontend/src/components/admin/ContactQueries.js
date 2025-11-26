import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(response.data);
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQueries();
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  if (loading) {
    return <div className="text-text-primary">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Contact Queries</h2>

      {queries.length === 0 ? (
        <div className="text-text-primary/70 text-center py-8">No contact queries yet.</div>
      ) : (
        <div className="space-y-4">
          {queries.map(query => (
            <div key={query._id} className="bg-bg-dark border border-primary/20 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{query.subject}</h3>
                  <p className="text-text-primary/70 text-sm">
                    <span className="font-medium">From:</span> {query.name} ({query.email})
                  </p>
                  <p className="text-text-primary/70 text-sm">
                    <span className="font-medium">Date:</span> {new Date(query.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(query._id)}
                  className="px-4 py-2 bg-accent text-white rounded text-sm hover:bg-orange-500 transition-all"
                >
                  Delete
                </button>
              </div>
              <div className="bg-card-bg/50 rounded-lg p-4">
                <p className="text-text-primary whitespace-pre-wrap">{query.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactQueries;

