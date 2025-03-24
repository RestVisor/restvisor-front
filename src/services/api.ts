import axios from 'axios';
import { Table } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const getTablesAPI = async (): Promise<Table[]> => {
  try {
    const response = await axios.get(`${API_URL}/tables`);
    return response.data;  // Se asegura que la respuesta sea un arreglo de mesas
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];  // Devuelve un arreglo vacío si ocurre un error
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