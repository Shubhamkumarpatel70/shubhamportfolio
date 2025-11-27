import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('Shubham Kumar');
  const [title, setTitle] = useState('Full Stack MERN Developer');
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      
      // Get user role from localStorage
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserRole(userData.role || 'user');
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        setUserRole(null);
      }
    };

    updateAuthState();
    fetchAboutData();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', updateAuthState);
    
    // Also listen for custom storage event (for same-tab updates)
    const handleStorageChange = () => updateAuthState();
    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', updateAuthState);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/about`);
      if (response.data) {
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
        if (response.data.name) {
          setName(response.data.name);
        }
        if (response.data.title) {
          setTitle(response.data.title);
        }
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    // Dispatch custom event to update header in same tab
    window.dispatchEvent(new Event('localStorageChange'));
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
      <div className="bg-card-bg/80 backdrop-blur-md rounded-2xl border border-primary/20 px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-xl gap-2">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 hover:opacity-90 transition-opacity group min-w-0 flex-shrink">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-md group-hover:blur-lg transition-all"></div>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/60 flex items-center justify-center overflow-hidden shadow-lg shadow-primary/30 group-hover:border-primary group-hover:shadow-primary/50 transition-all flex-shrink-0">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#58A6FF" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#58A6FF" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="80" fill="url(#logoGradient)"/>
                  <text x="100" y="115" textAnchor="middle" fontSize="40" fill="#58A6FF" fontWeight="bold" fontFamily="Arial, sans-serif">SK</text>
                </svg>
              )}
            </div>
          </div>
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-text-primary group-hover:text-primary transition-colors cursor-pointer leading-tight whitespace-nowrap">
            {name}
          </span>
        </Link>
        
        <nav className={`flex items-center gap-1 sm:gap-2 ${
          isMenuOpen 
            ? 'absolute top-full left-0 right-0 mt-2 bg-card-bg/95 backdrop-blur-md rounded-xl p-2 sm:p-4 flex flex-wrap gap-1 sm:gap-2 border border-primary/20 shadow-xl justify-center' 
            : 'hidden md:flex'
        }`}>
          <Link 
            to="/" 
            onClick={() => setIsMenuOpen(false)}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsMenuOpen(false)}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
          >
            About
          </Link>
          <Link 
            to="/projects" 
            onClick={() => setIsMenuOpen(false)}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
          >
            Projects
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsMenuOpen(false)}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/resume" 
                onClick={() => setIsMenuOpen(false)}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-primary/50 text-primary rounded-lg font-medium hover:bg-primary/10 transition-all text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                Resume
              </Link>
              {userRole === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-500 transition-all text-xs sm:text-sm md:text-base whitespace-nowrap"
                >
                  Admin
                </Link>
              )}
              <Link 
                to="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-primary/50 text-primary rounded-lg font-medium hover:bg-primary/10 transition-all text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-accent text-white rounded-lg font-medium hover:bg-orange-500 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/resume" 
              onClick={() => setIsMenuOpen(false)}
              className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-primary/50 text-primary rounded-lg font-medium hover:bg-primary/10 transition-all text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Resume
            </Link>
          )}
        </nav>

        <button 
          className="md:hidden flex flex-col gap-1.5 p-1" 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-text-primary transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-text-primary transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-text-primary transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
