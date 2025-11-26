import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const AddResume = () => {
  const [resumeData, setResumeData] = useState({
    fileUrl: '',
    fileName: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/resume`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setResumeData(response.data);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Please upload a PDF file only' });
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size should be less than 10MB' });
        e.target.value = ''; // Reset file input
        return;
      }
      
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      let dataToSend = {};

      if (file) {
        // Convert PDF to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64String = reader.result;
            dataToSend = {
              fileData: base64String,
              fileName: file.name,
              fileType: file.type || 'application/pdf'
            };

            await axios.post(`${API_URL}/api/admin/resume`, dataToSend, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
            setFile(null);
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
            fetchResume();
          } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' });
          } finally {
            setLoading(false);
          }
        };
        reader.onerror = () => {
          setMessage({ type: 'error', text: 'Error reading file' });
          setLoading(false);
        };
        reader.readAsDataURL(file);
        return; // Exit early, will continue in reader.onloadend
      } else if (resumeData.fileUrl) {
        // If no new file but URL exists, just update the URL
        dataToSend = {
          fileUrl: resumeData.fileUrl,
          fileName: resumeData.fileName || ''
        };
        await axios.post(`${API_URL}/api/admin/resume`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Resume URL updated successfully!' });
        fetchResume();
      } else {
        setMessage({ type: 'error', text: 'Please upload a file or provide a URL' });
        setLoading(false);
        return;
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' });
      setLoading(false);
    }
  };

  const handleUrlChange = (e) => {
    setResumeData({
      ...resumeData,
      fileUrl: e.target.value
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Manage Resume</h2>

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
          <label className="block font-medium mb-2 text-text-primary">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none"
          />
          <p className="text-text-primary/70 text-sm mt-2">Upload a PDF file (Max 10MB) or provide a URL below</p>
          {file && (
            <p className="text-primary text-sm mt-1">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card-bg text-text-primary/70">OR</span>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2 text-text-primary">Resume URL</label>
          <input
            type="url"
            name="fileUrl"
            value={resumeData.fileUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/resume.pdf"
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
        </div>

        {(resumeData.fileUrl || resumeData.fileData) && (
          <div className="bg-bg-dark border border-primary/20 rounded-lg p-4">
            <p className="text-text-primary/70 mb-2">Current Resume:</p>
            {resumeData.fileUrl ? (
              <a
                href={resumeData.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {resumeData.fileName || resumeData.fileUrl}
              </a>
            ) : (
              <div>
                <p className="text-text-primary mb-2">{resumeData.fileName || 'resume.pdf'}</p>
                <a
                  href={resumeData.fileData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Current Resume
                </a>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-500 transition-all disabled:opacity-60"
        >
          {loading ? 'Uploading...' : 'Save Resume'}
        </button>
      </form>
    </div>
  );
};

export default AddResume;

