import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Attach token automatically
API.interceptors.request.use((req) => {
  // Try to get token from localStorage first (new method)
  const token = localStorage.getItem('token');
  
  // If not found, try to get from user object (legacy method)
  if (!token) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
      console.log('Token attached from user object');
    } else {
      console.warn('No token found in user object');
    }
  } else {
    req.headers.Authorization = `Bearer ${token}`;
    console.log('Token attached from localStorage');
  }

  console.log('Request:', {
    method: req.method,
    url: req.url,
    hasAuth: !!req.headers.Authorization
  });

  return req;
});

export default API;
