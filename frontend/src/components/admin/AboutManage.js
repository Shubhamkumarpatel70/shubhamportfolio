import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AboutManage = () => {
  const [aboutData, setAboutData] = useState({
    name: 'Shubham Kumar',
    title: 'Full Stack MERN Developer',
    description: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    profileImage: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/about', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        // Ensure all fields have values (never undefined) to avoid controlled/uncontrolled warning
        setAboutData({
          name: response.data.name || 'Shubham Kumar',
          title: response.data.title || 'Full Stack MERN Developer',
          description: response.data.description || '',
          bio: response.data.bio || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          profileImage: response.data.profileImage || ''
        });
        if (response.data.profileImage) {
          setImagePreview(response.data.profileImage);
        }
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const handleChange = (e) => {
    setAboutData({
      ...aboutData,
      [e.target.name]: e.target.value || ''
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
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
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
          
          setAboutData({
            ...aboutData,
            profileImage: compressedBase64
          });
          setImagePreview(compressedBase64);
        };
        img.src = base64String;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAboutData({
      ...aboutData,
      profileImage: ''
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/about', aboutData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'About information updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Manage About Section</h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image Upload */}
        <div>
          <label className="block font-medium mb-2 text-text-primary">Profile Image</label>
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none"
              />
              <p className="text-text-primary/70 text-sm mt-2">Upload a profile image (Max 5MB, JPG/PNG)</p>
            </div>
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary/30"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-all text-xs"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-text-primary">Name</label>
            <input
              type="text"
              name="name"
              value={aboutData.name || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-text-primary">Title</label>
            <input
              type="text"
              name="title"
              value={aboutData.title || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-text-primary">Short Description</label>
          <textarea
            name="description"
            value={aboutData.description || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-text-primary">Bio</label>
          <textarea
            name="bio"
            value={aboutData.bio || ''}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-2 text-text-primary">Email</label>
            <input
              type="email"
              name="email"
              value={aboutData.email || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-text-primary">Phone</label>
            <input
              type="tel"
              name="phone"
              value={aboutData.phone || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-text-primary">Location</label>
            <input
              type="text"
              name="location"
              value={aboutData.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-500 transition-all disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save About Information'}
        </button>
      </form>
    </div>
  );
};

export default AboutManage;

