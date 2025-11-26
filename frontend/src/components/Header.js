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
      <div className="bg-card-bg/80 backdrop-blur-md rounded-2xl border border-primary/20 px-6 py-4 flex items-center justify-between shadow-xl">
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="#58A6FF" opacity="0.2"/>
                <text x="100" y="110" textAnchor="middle" fontSize="35" fill="#58A6FF" fontWeight="bold">SK</text>
              </svg>
            )}
          </div>
          <span className="text-2xl font-bold text-text-primary hover:text-primary transition-colors cursor-pointer">{name}</span>
        </Link>
        
        <nav className={`md:flex md:items-center md:gap-2 ${
          isMenuOpen 
            ? 'absolute top-full left-0 right-0 mt-2 bg-card-bg/95 backdrop-blur-md rounded-xl p-4 flex flex-col gap-2 border border-primary/20 shadow-xl' 
            : 'hidden md:flex'
        }`}>
          <Link 
            to="/" 
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2 text-text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-base font-medium"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2 text-text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-base font-medium"
          >
            About
          </Link>
          <Link 
            to="/projects" 
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2 text-text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-base font-medium"
          >
            Projects
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2 text-text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-base font-medium"
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/resume" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 border border-primary/50 text-primary rounded-lg font-medium hover:bg-primary/10 transition-all text-base"
              >
                Resume
              </Link>
              {userRole === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-500 transition-all text-base"
                >
                  Admin
                </Link>
              )}
              <Link 
                to="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 border border-primary/50 text-primary rounded-lg font-medium hover:bg-primary/10 transition-all text-base"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-orange-500 transition-colors text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/resume" 
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 border border-primary/50 text-primary rounded-lg font-medium hover:bg-primary/10 transition-all text-base"
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
