import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState({});
  const [aboutData, setAboutData] = useState({
    name: 'Shubham Kumar',
    email: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    fetchSocialLinks();
    fetchAboutData();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/social`);
      setSocialLinks(response.data || {});
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/about`);
      if (response.data) {
        setAboutData({
          name: response.data.name || 'Shubham Kumar',
          email: response.data.email || '',
          phone: response.data.phone || '',
          location: response.data.location || ''
        });
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const socialPlatforms = [
    { key: 'github', label: 'GitHub', icon: '🔗', color: 'hover:text-white hover:bg-gray-800' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'hover:text-white hover:bg-blue-600' },
    { key: 'twitter', label: 'Twitter', icon: '🐦', color: 'hover:text-white hover:bg-sky-500' },
    { key: 'instagram', label: 'Instagram', icon: '📷', color: 'hover:text-white hover:bg-pink-600' },
    { key: 'facebook', label: 'Facebook', icon: '👥', color: 'hover:text-white hover:bg-blue-700' },
    { key: 'youtube', label: 'YouTube', icon: '📺', color: 'hover:text-white hover:bg-red-600' }
  ];

  return (
    <footer className="relative bg-bg-dark border-t border-primary/20 text-text-primary mt-auto overflow-hidden">
      {/* Glowing background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold text-primary hover:text-blue-400 transition-colors">
                {aboutData.name || 'Portfolio'}
              </h3>
            </Link>
            <p className="text-text-primary/70 leading-relaxed mb-4 max-w-md">
              Full Stack MERN Developer passionate about creating innovative web solutions and delivering exceptional user experiences.
            </p>
            <div className="space-y-2">
              {aboutData.email && (
                <a 
                  href={`mailto:${aboutData.email}`}
                  className="flex items-center gap-2 text-text-primary/70 hover:text-primary transition-colors text-sm"
                >
                  <span className="text-primary">✉</span>
                  <span>{aboutData.email}</span>
                </a>
              )}
              {aboutData.phone && (
                <a 
                  href={`tel:${aboutData.phone}`}
                  className="flex items-center gap-2 text-text-primary/70 hover:text-primary transition-colors text-sm"
                >
                  <span className="text-primary">📞</span>
                  <span>{aboutData.phone}</span>
                </a>
              )}
              {aboutData.location && (
                <div className="flex items-center gap-2 text-text-primary/70 text-sm">
                  <span className="text-primary">📍</span>
                  <span>{aboutData.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text-primary">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-text-primary/70 hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-text-primary/70 hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/projects" 
                  className="text-text-primary/70 hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-text-primary/70 hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/resume" 
                  className="text-text-primary/70 hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  Resume
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text-primary">Connect With Me</h4>
            <div className="flex flex-wrap gap-2">
              {socialPlatforms.map(platform => {
                if (socialLinks[platform.key]) {
                  return (
                    <a 
                      key={platform.key}
                      href={socialLinks[platform.key]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`group px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg hover:border-primary/50 hover:-translate-y-0.5 transition-all text-text-primary/70 ${platform.color} flex items-center gap-2 text-sm`}
                      title={platform.label}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      <span className="hidden sm:inline">{platform.label}</span>
                    </a>
                  );
                }
                return null;
              })}
            </div>
            {Object.keys(socialLinks).length === 0 && (
              <p className="text-text-primary/50 text-sm">No social links added yet</p>
            )}
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-primary/60 text-sm text-center md:text-left">
              &copy; {currentYear} <span className="text-primary">{aboutData.name || 'Portfolio'}</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-text-primary/60 text-sm">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>using MERN Stack</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
