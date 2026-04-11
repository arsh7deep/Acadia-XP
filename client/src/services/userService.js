import API from './api';

export const getLeaderboard = async () => {
  const res = await API.get('/leaderboard');
  return res.data.data || res.data;
};

export const getUserProfile = async () => {
  const res = await API.get('/users/profile');
  return res.data.data || res.data;
};

export const getProfile = async () => {
  return getUserProfile();
};

export const getUserBadges = async () => {
  const res = await API.get('/users/badges');
  return res.data.data || res.data;
};

export const getUserStats = async () => {
  const res = await API.get('/users/stats');
  return res.data.data || res.data;
};
