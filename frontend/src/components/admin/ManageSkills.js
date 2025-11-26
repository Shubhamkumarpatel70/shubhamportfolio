import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '💼'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('${API_URL}/api/admin/skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');

      if (editingId) {
        await axios.put(`${API_URL}/api/admin/skills/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Skill updated successfully!' });
      } else {
        await axios.post('${API_URL}/api/admin/skills', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Skill added successfully!' });
      }

      setFormData({ name: '', description: '', icon: '💼' });
      setEditingId(null);
      fetchSkills();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      description: skill.description,
      icon: skill.icon
    });
    setEditingId(skill._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Skill deleted successfully!' });
      fetchSkills();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Manage Skills</h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-text-primary">Skill Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-text-primary">Icon/Emoji</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-text-primary">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-500 transition-all disabled:opacity-60"
        >
          {loading ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', description: '', icon: '💼' });
            }}
            className="ml-4 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Skills List */}
      <div>
        <h3 className="text-xl font-bold text-text-primary mb-4">Existing Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map(skill => (
            <div key={skill._id} className="bg-bg-dark border border-primary/20 rounded-lg p-4">
              <div className="text-4xl mb-2">{skill.icon}</div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">{skill.name}</h4>
              <p className="text-text-primary/70 text-sm mb-3">{skill.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-blue-500 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="px-4 py-2 bg-accent text-white rounded text-sm hover:bg-orange-500 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSkills;

