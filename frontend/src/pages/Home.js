import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [aboutData, setAboutData] = useState({
    name: 'Shubham Kumar',
    title: 'Full Stack MERN Developer',
    profileImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    fetchFeaturedProjects();
    fetchSkills();
    fetchAboutData();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/projects/featured`);
      setFeaturedProjects(response.data);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/about`);
      if (response.data) {
        setAboutData(response.data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Glowing background accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>

      <section className="min-h-screen flex items-center justify-center py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Large Profile Image with Glowing Circle and Skills Orbit */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl glow-blue-strong"></div>
              
              {/* Skills Circular Orbit */}
              {skills.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-[450px] h-[450px] md:w-[550px] md:h-[550px] animate-spin-slow">
                    {skills.slice(0, 8).map((skill, index) => {
                      const totalSkills = Math.min(skills.length, 8);
                      const angle = (index * 360) / totalSkills - 90; // Start from top
                      const radius = 200; // Distance from center
                      const radian = (angle * Math.PI) / 180;
                      const x = Math.cos(radian) * radius;
                      const y = Math.sin(radian) * radius;
                      return (
                        <div
                          key={skill._id}
                          className="absolute top-1/2 left-1/2 pointer-events-auto"
                          style={{
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                            transformOrigin: 'center'
                          }}
                        >
                          <div 
                            className="bg-card-bg/90 backdrop-blur-sm border-2 border-primary/50 rounded-full p-2 shadow-lg hover:scale-110 hover:border-primary transition-all group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
                            style={{
                              transform: `rotate(${angle + 90}deg)`,
                              transformOrigin: 'center'
                            }}
                          >
                            <div className="text-xl md:text-2xl" style={{ transform: 'rotate(0deg)' }}>{skill.icon}</div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card-bg border border-primary/20 rounded-lg text-xs text-text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                              {skill.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-primary/50 overflow-hidden bg-card-bg z-10">
                {aboutData.profileImage ? (
                  <img 
                    src={aboutData.profileImage} 
                    alt={aboutData.name || 'Profile'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="100" cy="100" r="100" fill="#161B22"/>
                    <circle cx="100" cy="100" r="80" fill="#58A6FF" opacity="0.1"/>
                    <text x="100" y="120" textAnchor="middle" fontSize="80" fill="#58A6FF" fontWeight="bold">SK</text>
                  </svg>
                )}
              </div>
              <div className="absolute -inset-4 border-2 border-primary/30 rounded-full animate-pulse z-10"></div>
            </div>

            {/* Name and Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-text-primary">
              Hi, I'm <span className="text-primary">{aboutData.name || 'Shubham Kumar'}</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-6 text-primary font-medium">{aboutData.title || 'Full Stack MERN Developer'}</p>
            <p className="text-lg md:text-xl mb-10 text-text-primary/80 max-w-2xl leading-relaxed">
              {aboutData.description || "I create beautiful and functional web applications using modern technologies. Passionate about clean code and user experience."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/projects" 
                className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                View Projects
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-bg-dark relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-text-primary">Skills & Technologies</h2>
          {loading ? (
            <div className="text-center text-text-primary/70">Loading skills...</div>
          ) : skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map(skill => (
                <div key={skill._id} className="bg-card-bg/50 backdrop-blur-sm border border-primary/20 p-8 rounded-2xl text-center hover:-translate-y-2 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <div className="text-5xl mb-4">{skill.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">{skill.name}</h3>
                  <p className="text-text-primary/70">{skill.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-text-primary/70">No skills added yet.</div>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-bg-dark relative z-10 border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Featured Projects</h2>
            <p className="text-lg text-text-primary/80">Some of my recent work and creations</p>
          </div>

          {featuredProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProjects.map(project => (
                  <div key={project._id} className="bg-card-bg/50 backdrop-blur-sm border border-primary/20 rounded-2xl overflow-hidden hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all">
                    <div className="bg-gradient-to-br from-primary/30 to-primary/10 p-12 text-center border-b border-primary/20">
                      <div className="text-6xl">{project.image}</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold mb-3 text-text-primary">{project.title}</h3>
                      <p className="text-text-primary/70 leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech?.map((tech, index) => (
                          <span key={index} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        {project.link && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40 transition-all text-center"
                          >
                            View Project
                          </a>
                        )}
                        {project.github && (
                          isAuthenticated ? (
                            <a 
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40 transition-all text-center"
                            >
                              GitHub
                            </a>
                          ) : (
                            <div className="relative group">
                              <button
                                disabled
                                className="px-6 py-2 bg-primary/30 text-primary/50 rounded-full font-medium text-center cursor-not-allowed flex items-center justify-center gap-2 w-full"
                              >
                                🔒 Login to View
                              </button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card-bg border border-primary/20 rounded-lg text-sm text-text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Login to view GitHub link
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-text-primary/70 py-8">No featured projects yet.</div>
          )}

          <div className="text-center">
            <Link 
              to="/projects" 
              className="inline-block px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Buy Me a Coffee Section */}
      <section className="py-20 bg-bg-dark relative z-10 border-t border-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card-bg/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
            <div className="text-8xl mb-6">☕</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Buy Me a Coffee</h2>
            <p className="text-lg md:text-xl mb-8 text-text-primary/80 max-w-2xl mx-auto">
              If you found my projects helpful or interesting, consider buying me a coffee to support my work and help me create more amazing projects!
            </p>
            {isAuthenticated ? (
              <Link
                to="/coffee"
                className="inline-block px-8 py-4 bg-accent text-white rounded-full font-bold text-lg hover:bg-orange-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/50 transition-all"
              >
                ☕ Buy Me a Coffee
              </Link>
            ) : (
              <div className="space-y-4">
                <p className="text-text-primary/70 mb-4">Please login to support my work</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/register"
                    className="inline-block px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/50 transition-all"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-block px-8 py-4 border-2 border-primary text-primary rounded-full font-bold text-lg hover:bg-primary/10 transition-all"
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
