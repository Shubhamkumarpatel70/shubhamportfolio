import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      fetchResume();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchResume = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/public/resume');
      if (response.data && (response.data.fileUrl || response.data.fileData)) {
        setResume(response.data);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 p-8 rounded-2xl shadow-2xl text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold mb-4 text-text-primary">Login to View Resume</h1>
            <p className="text-text-primary/70 mb-6">
              Please login to view my resume
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-primary">Loading resume...</div>
      </div>
    );
  }

  if (!resume || (!resume.fileUrl && !resume.fileData)) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 p-8 rounded-2xl shadow-2xl text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-3xl font-bold mb-4 text-text-primary">Resume Not Available</h1>
          <p className="text-text-primary/70">
            Resume has not been uploaded yet.
          </p>
        </div>
      </div>
    );
  }

  // Get resume URL - either from fileUrl or create blob URL from base64
  const getResumeUrl = () => {
    if (resume.fileUrl) {
      return resume.fileUrl;
    } else if (resume.fileData) {
      // Check if base64 string already includes data URL prefix
      const base64String = resume.fileData.includes(',') 
        ? resume.fileData.split(',')[1] 
        : resume.fileData;
      
      // Convert base64 to blob URL
      try {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: resume.fileType || 'application/pdf' });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error converting base64 to blob:', error);
        // Fallback: return data URL directly if conversion fails
        return resume.fileData.startsWith('data:') 
          ? resume.fileData 
          : `data:${resume.fileType || 'application/pdf'};base64,${resume.fileData}`;
      }
    }
    return null;
  };

  const resumeUrl = getResumeUrl();
  const fileName = resume.fileName || 'resume.pdf';

  if (!resumeUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 p-8 rounded-2xl shadow-2xl text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-3xl font-bold mb-4 text-text-primary">Resume Not Available</h1>
          <p className="text-text-primary/70">
            Resume has not been uploaded yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 shadow-2xl text-center">
          <h1 className="text-4xl font-bold mb-4 text-text-primary">My Resume</h1>
          <p className="text-text-primary/70 mb-8 text-lg">View or download my resume</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40 transition-all"
            >
              View Resume
            </a>
            <a
              href={resumeUrl}
              download={fileName}
              className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

