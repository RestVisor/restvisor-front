import axios from 'axios';
import { Order } from '../types';

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
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const submitOrderAPI = async (order: Order) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    return null;
  }
};