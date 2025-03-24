import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

export const getTablesAPI = async () => {
  if (!token) {
    throw new Error('No token found, please log in');
  }

  try {
    const response = await axios.get(`${API_URL}/tables`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

export const getMenuItemsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/menu`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const submitOrderAPI = async (order: any) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, order);
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    return null;
  }
};