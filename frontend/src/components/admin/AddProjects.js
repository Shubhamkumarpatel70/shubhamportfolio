import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const AddProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '',
    image: '',
    link: '',
    github: '',
    featured: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        
        // Compress image to reduce payload size
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          setFormData({ ...formData, image: compressedBase64 });
          setImagePreview(compressedBase64);
          setMessage({ type: '', text: '' });
        };
        img.src = base64String;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const projectData = {
        ...formData,
        tech: formData.tech.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingId) {
        await axios.put(`${API_URL}/api/admin/projects/${editingId}`, projectData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Project updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/projects`, projectData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Project added successfully!' });
      }

      setFormData({ title: '', description: '', tech: '', image: '', link: '', github: '', featured: false });
      setImagePreview(null);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      tech: project.tech.join(', '),
      image: project.image || '',
      link: project.link || '',
      github: project.github || '',
      featured: project.featured || false
    });
    setImagePreview(project.image || null);
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Project deleted successfully!' });
      fetchProjects();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Manage Projects</h2>

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
            <label className="block font-medium mb-2 text-text-primary">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-text-primary">Project Icon/Image</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="project-image-upload"
              />
              <label
                htmlFor="project-image-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary cursor-pointer hover:border-primary transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Icon/Image</span>
              </label>
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-primary/20" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              {!imagePreview && formData.image && (
                <div className="text-4xl">{formData.image}</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-text-primary">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-text-primary">Technologies (comma separated)</label>
          <input
            type="text"
            name="tech"
            value={formData.tech}
            onChange={handleChange}
            required
            placeholder="React, Node.js, MongoDB"
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-text-primary">Project Link</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-text-primary">GitHub Link</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-5 h-5 text-primary bg-bg-dark border-primary/20 rounded focus:ring-primary"
          />
          <label htmlFor="featured" className="text-text-primary font-medium">
            Featured Project (Show in Home Page)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-500 transition-all disabled:opacity-60"
        >
          {loading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ title: '', description: '', tech: '', image: '', link: '', github: '', featured: false });
              setImagePreview(null);
            }}
            className="ml-4 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Projects List */}
      <div>
        <h3 className="text-xl font-bold text-text-primary mb-4">Existing Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project._id} className="bg-bg-dark border border-primary/20 rounded-lg p-4">
              <div className="mb-2">
                {project.image && project.image.startsWith('data:image') ? (
                  <img src={project.image} alt={project.title} className="w-16 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="text-4xl">{project.image || '💼'}</div>
                )}
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                {project.title}
                {project.featured && (
                  <span className="ml-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs">Featured</span>
                )}
              </h4>
              <p className="text-text-primary/70 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tech?.map((tech, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-blue-500 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
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

export default AddProjects;

