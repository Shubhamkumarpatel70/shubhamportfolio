import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Glowing background accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>

      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-text-primary">My Projects</h1>
            <p className="text-xl text-text-primary/80">Explore my recent work and creations</p>
          </div>

          {loading ? (
            <div className="text-center text-text-primary/70 py-8">Loading projects...</div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project._id} className="bg-card-bg/50 backdrop-blur-sm border border-primary/20 rounded-2xl overflow-hidden hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all">
                  <div className="bg-gradient-to-br from-primary/30 to-primary/10 p-12 text-center border-b border-primary/20">
                    {project.image && project.image.startsWith('data:image') ? (
                      <img src={project.image} alt={project.title} className="w-24 h-24 mx-auto object-contain" />
                    ) : (
                      <div className="text-6xl">{project.image || '💼'}</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3 text-text-primary">
                      {project.title}
                      {project.featured && (
                        <span className="ml-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs">Featured</span>
                      )}
                    </h3>
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
                      {project.github ? (
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
                      ) : null}
                      {isAuthenticated ? (
                        <Link
                          to={`/coffee?projectId=${project._id}`}
                          className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40 transition-all text-center flex items-center justify-center gap-2"
                        >
                          <span>☕</span>
                          <span>Source Code</span>
                        </Link>
                      ) : (
                        <div className="relative group">
                          <button
                            disabled
                            className="px-6 py-2 bg-primary/30 text-primary/50 rounded-full font-medium text-center cursor-not-allowed flex items-center justify-center gap-2 w-full"
                          >
                            🔒 Login to View
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card-bg border border-primary/20 rounded-lg text-sm text-text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Login to view Source Code
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-text-primary/70 py-8">No projects added yet.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
