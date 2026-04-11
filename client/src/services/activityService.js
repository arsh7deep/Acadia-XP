import API from './api';

export const addActivity = async (data) => {
  try {
    console.log('API Request - POST /activity with data:', data);
    const res = await API.post('/activity', data);
    console.log('API Response:', res.data);
    return res.data.data || res.data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getActivities = async () => {
  try {
    console.log('API Request - GET /activity');
    const res = await API.get('/activity');
    console.log('API Response:', res.data);
    return res.data.data || res.data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};
