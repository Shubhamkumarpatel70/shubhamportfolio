import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

const About = () => {
  const [aboutData, setAboutData] = useState({
    name: 'Shubham Kumar',
    title: 'Full Stack MERN Developer',
    description: '',
    bio: '',
    profileImage: ''
  });
  const [socialLinks, setSocialLinks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
    fetchSocialLinks();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/about`);
      if (response.data) {
        setAboutData(response.data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/social`);
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
    <div className="w-full relative overflow-hidden">
      {/* Glowing background accents */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>

      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-text-primary">About Me</h1>
            <p className="text-xl text-text-primary/80">Get to know me better</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
                Hello, I'm {aboutData.name || 'Shubham Kumar'}
              </h2>
              <p className="text-lg text-text-primary/80 leading-relaxed mb-4">
                {aboutData.description || aboutData.bio || "I'm a passionate Full Stack Developer specializing in the MERN stack. With a strong foundation in both frontend and backend development, I create seamless, scalable web applications."}
              </p>
              {aboutData.bio && aboutData.bio !== aboutData.description && (
                <p className="text-lg text-text-primary/80 leading-relaxed">
                  {aboutData.bio}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/30 bg-card-bg/50 backdrop-blur-sm">
                {aboutData.profileImage ? (
                  <img 
                    src={aboutData.profileImage} 
                    alt={aboutData.name || 'Profile'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <rect width="200" height="200" fill="#161B22"/>
                    <circle cx="100" cy="100" r="70" fill="#58A6FF" opacity="0.2"/>
                    <text x="100" y="120" textAnchor="middle" fontSize="50" fill="#58A6FF" fontWeight="bold">SK</text>
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Connect with Us Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-text-primary">Connect with Us</h2>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {socialPlatforms.map(platform => {
                if (socialLinks[platform.key]) {
                  return (
                    <a
                      key={platform.key}
                      href={socialLinks[platform.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 sm:px-6 py-3 bg-card-bg/50 backdrop-blur-sm border border-primary/20 rounded-lg hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="text-xl sm:text-2xl">{platform.icon}</span>
                      <span className="text-text-primary font-medium text-sm sm:text-base">{platform.label}</span>
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Experience & Education Timeline */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-text-primary">Experience & Education</h2>
            
            {/* Experience Section */}
            {aboutData.experience && aboutData.experience.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-8 text-text-primary text-center">Experience</h3>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
                  {aboutData.experience.map((exp, index) => (
                    <div key={index} className="relative mb-12 pl-8">
                      <div className="absolute -left-11 top-0 w-5 h-5 rounded-full bg-primary border-4 border-bg-dark shadow-lg"></div>
                      <div className="font-bold text-primary mb-2 text-lg">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </div>
                      <div>
                        <h4 className="text-2xl font-semibold mb-1 text-text-primary">{exp.position}</h4>
                        <p className="text-xl text-primary/80 mb-2">{exp.company}</p>
                        {exp.description && (
                          <p className="text-text-primary/70 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {aboutData.education && aboutData.education.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-8 text-text-primary text-center">Education</h3>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"></div>
                  {aboutData.education.map((edu, index) => (
                    <div key={index} className="relative mb-12 pl-8">
                      <div className="absolute -left-11 top-0 w-5 h-5 rounded-full bg-accent border-4 border-bg-dark shadow-lg"></div>
                      <div className="font-bold text-accent mb-2 text-lg">
                        {edu.startDate} - {edu.endDate || 'Present'}
                      </div>
                      <div>
                        <h4 className="text-2xl font-semibold mb-1 text-text-primary">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h4>
                        <p className="text-xl text-accent/80 mb-2">{edu.institution}</p>
                        {edu.description && (
                          <p className="text-text-primary/70 leading-relaxed">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show message if no data */}
            {(!aboutData.experience || aboutData.experience.length === 0) && 
             (!aboutData.education || aboutData.education.length === 0) && (
              <div className="text-center text-text-primary/70 py-8">
                <p>Experience and Education information will be displayed here once added.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
