import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('${API_URL}/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <div className="text-text-primary">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Manage Users</h2>

      {users.length === 0 ? (
        <div className="text-text-primary/70 text-center py-8">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left py-3 px-4 text-text-primary font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">Joined</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-primary/10">
                  <td className="py-3 px-4 text-text-primary">{user.name}</td>
                  <td className="py-3 px-4 text-text-primary/70">{user.email}</td>
                  <td className="py-3 px-4 text-text-primary/70">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-4 py-2 bg-accent text-white rounded text-sm hover:bg-orange-500 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

