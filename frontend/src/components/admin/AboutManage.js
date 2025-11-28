import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const AboutManage = () => {
  const [aboutData, setAboutData] = useState({
    name: 'Shubham Kumar',
    title: 'Full Stack MERN Developer',
    description: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    profileImage: '',
    experience: [],
    education: []
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
      const response = await axios.get(`${API_URL}/api/admin/about`, {
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
          profileImage: response.data.profileImage || '',
          experience: response.data.experience || [],
          education: response.data.education || []
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
      await axios.post(`${API_URL}/api/admin/about`, aboutData, {
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

        {/* Experience Section */}
        <div className="border-t border-primary/20 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-text-primary">Experience</h3>
            <button
              type="button"
              onClick={() => {
                setAboutData({
                  ...aboutData,
                  experience: [...(aboutData.experience || []), {
                    company: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    current: false
                  }]
                });
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-500 transition-all"
            >
              + Add Experience
            </button>
          </div>
          {aboutData.experience && aboutData.experience.map((exp, index) => (
            <div key={index} className="bg-bg-dark/50 border border-primary/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-text-primary">Experience #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => {
                    const newExp = [...aboutData.experience];
                    newExp.splice(index, 1);
                    setAboutData({ ...aboutData, experience: newExp });
                  }}
                  className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-orange-500 transition-all"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2 text-text-primary">Company</label>
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => {
                      const newExp = [...aboutData.experience];
                      newExp[index].company = e.target.value;
                      setAboutData({ ...aboutData, experience: newExp });
                    }}
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-text-primary">Position</label>
                  <input
                    type="text"
                    value={exp.position || ''}
                    onChange={(e) => {
                      const newExp = [...aboutData.experience];
                      newExp[index].position = e.target.value;
                      setAboutData({ ...aboutData, experience: newExp });
                    }}
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-text-primary">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate || ''}
                    onChange={(e) => {
                      const newExp = [...aboutData.experience];
                      newExp[index].startDate = e.target.value;
                      setAboutData({ ...aboutData, experience: newExp });
                    }}
                    placeholder="e.g., Jan 2020"
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-text-primary">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate || ''}
                    onChange={(e) => {
                      const newExp = [...aboutData.experience];
                      newExp[index].endDate = e.target.value;
                      setAboutData({ ...aboutData, experience: newExp });
                    }}
                    placeholder="e.g., Dec 2022 or Present"
                    disabled={exp.current}
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={exp.current || false}
                    onChange={(e) => {
                      const newExp = [...aboutData.experience];
                      newExp[index].current = e.target.checked;
                      if (e.target.checked) {
                        newExp[index].endDate = 'Present';
                      }
                      setAboutData({ ...aboutData, experience: newExp });
                    }}
                    className="w-5 h-5 text-primary bg-bg-dark border-primary/20 rounded focus:ring-primary"
                  />
                  <span className="text-text-primary">Current Position</span>
                </label>
              </div>
              <div className="mt-4">
                <label className="block font-medium mb-2 text-text-primary">Description</label>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => {
                    const newExp = [...aboutData.experience];
                    newExp[index].description = e.target.value;
                    setAboutData({ ...aboutData, experience: newExp });
                  }}
                  rows="3"
                  className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="border-t border-primary/20 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-text-primary">Education</h3>
            <button
              type="button"
              onClick={() => {
                setAboutData({
                  ...aboutData,
                  education: [...(aboutData.education || []), {
                    institution: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                  }]
                });
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-500 transition-all"
            >
              + Add Education
            </button>
          </div>
          {aboutData.education && aboutData.education.map((edu, index) => (
            <div key={index} className="bg-bg-dark/50 border border-primary/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-text-primary">Education #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => {
                    const newEdu = [...aboutData.education];
                    newEdu.splice(index, 1);
                    setAboutData({ ...aboutData, education: newEdu });
                  }}
                  className="px-3 py-1 bg-accent text-white rounded text-sm hover:bg-orange-500 transition-all"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2 text-text-primary">Institution</label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => {
                      const newEdu = [...aboutData.education];
                      newEdu[index].institution = e.target.value;
                      setAboutData({ ...aboutData, education: newEdu });
                    }}
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-text-primary">Degree</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const newEdu = [...aboutData.education];
                      newEdu[index].degree = e.target.value;
                      setAboutData({ ...aboutData, education: newEdu });
                    }}
                    placeholder="e.g., Bachelor's, Master's"
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-text-primary">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field || ''}
                    onChange={(e) => {
                      const newEdu = [...aboutData.education];
                      newEdu[index].field = e.target.value;
                      setAboutData({ ...aboutData, education: newEdu });
                    }}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-text-primary">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate || ''}
                    onChange={(e) => {
                      const newEdu = [...aboutData.education];
                      newEdu[index].startDate = e.target.value;
                      setAboutData({ ...aboutData, education: newEdu });
                    }}
                    placeholder="e.g., 2018"
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-text-primary">End Date</label>
                  <input
                    type="text"
                    value={edu.endDate || ''}
                    onChange={(e) => {
                      const newEdu = [...aboutData.education];
                      newEdu[index].endDate = e.target.value;
                      setAboutData({ ...aboutData, education: newEdu });
                    }}
                    placeholder="e.g., 2022 or Present"
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block font-medium mb-2 text-text-primary">Description</label>
                <textarea
                  value={edu.description || ''}
                  onChange={(e) => {
                    const newEdu = [...aboutData.education];
                    newEdu[index].description = e.target.value;
                    setAboutData({ ...aboutData, education: newEdu });
                  }}
                  rows="3"
                  className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          ))}
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

