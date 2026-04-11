import API from './api';

export const registerUser = async (data) => {
  const res = await API.post('/auth/register', data);
  const userData = res.data.data || res.data;
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', userData.token);
  return userData;
};

export const loginUser = async (data) => {
  const res = await API.post('/auth/login', data);
  const userData = res.data.data || res.data;
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', userData.token);
  return userData;
};

export const logoutUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
