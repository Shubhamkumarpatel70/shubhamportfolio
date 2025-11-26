import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState({});

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/public/social');
      setSocialLinks(response.data || {});
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const socialPlatforms = [
    { key: 'github', label: 'GitHub', icon: '🔗' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { key: 'twitter', label: 'Twitter', icon: '🐦' },
    { key: 'instagram', label: 'Instagram', icon: '📷' },
    { key: 'facebook', label: 'Facebook', icon: '👥' },
    { key: 'youtube', label: 'YouTube', icon: '📺' }
  ];

  return (
    <footer className="bg-card-bg/50 backdrop-blur-sm border-t border-primary/20 text-text-primary py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary">Portfolio</h3>
            <p className="text-text-primary/80 leading-relaxed">
              Building amazing web experiences with MERN stack
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-text-primary/80 hover:text-primary hover:underline transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-primary/80 hover:text-primary hover:underline transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-text-primary/80 hover:text-primary hover:underline transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-primary/80 hover:text-primary hover:underline transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-text-primary">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {socialPlatforms.map(platform => {
                if (socialLinks[platform.key]) {
                  return (
                    <a 
                      key={platform.key}
                      href={socialLinks[platform.key]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary/20 rounded-lg hover:bg-primary/30 hover:-translate-y-0.5 transition-all text-text-primary border border-primary/30"
                    >
                      {platform.label}
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary/20 text-center text-text-primary/60">
          <p>&copy; {currentYear} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
