// Determine API URL based on environment
const getApiUrl = () => {
  // If REACT_APP_API_URL is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In production (when deployed), use the same origin (backend serves frontend)
  if (process.env.NODE_ENV === 'production') {
    return ''; // Empty string means same origin
  }
  
  // In development, use localhost
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

export default API_URL;

